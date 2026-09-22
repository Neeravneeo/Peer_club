import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma.js';
import {
  normalizeDateToUtc,
  formatUtcDateString,
  isSameDay,
  isYesterday,
  daysBetween,
  isStreakActive,
} from '../utils/dateUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STREAKS_FILE = path.join(DATA_DIR, 'streaks.json');

// Ensure data directory exists for persistent multi-user storage
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (_) {}
}

/**
 * Reads persistent streak records from disk
 * @returns {Record<string, { currentStreak: number, bestStreak: number, lastVisitDate: string|null, lastStudyActivity: string|null, lastStreakIncrementAt: string|null }>}
 */
function readPersistentStreaks() {
  try {
    if (fs.existsSync(STREAKS_FILE)) {
      const content = fs.readFileSync(STREAKS_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.warn('[streak.service] File read notice:', err.message);
  }
  return {};
}

/**
 * Writes persistent streak records to disk
 * @param {Record<string, any>} data
 */
function writePersistentStreaks(data) {
  try {
    fs.writeFileSync(STREAKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[streak.service] File write notice:', err.message);
  }
}

/**
 * Pure function computing the next streak state.
 * Enforces BOTH:
 * 1. Minimum 24-hour gap between streak-counting activities
 * 2. Calendar day progression in UTC/server standard
 * 3. Missed streak break detection (2+ calendar days passed)
 *
 * @param {{ currentStreak: number, bestStreak: number, lastVisitDate: Date|string|null, lastStudyActivity?: Date|string|null, lastStreakIncrementAt?: Date|string|null }|null} prevState
 * @param {Date|string} [activityDate=new Date()]
 * @returns {{ currentStreak: number, bestStreak: number, lastVisitDate: string, lastStudyActivity: string, lastStreakIncrementAt: string, message: string, incremented: boolean }}
 */
export function calculateNextStreak(prevState, activityDate = new Date()) {
  const now = activityDate instanceof Date ? activityDate : new Date(activityDate);
  const todayDateStr = formatUtcDateString(now);
  const nowIso = now.toISOString();

  const prevCurrent = Number(prevState?.currentStreak) || 0;
  const prevBest = Number(prevState?.bestStreak) || 0;
  const prevVisitDateStr = prevState?.lastVisitDate ? formatUtcDateString(prevState.lastVisitDate) : null;

  // 1. Initial State / First valid study activity ever
  if (!prevState || !prevVisitDateStr || prevCurrent === 0) {
    const initialCurrent = 1;
    const initialBest = Math.max(prevBest, 1);
    return {
      currentStreak: initialCurrent,
      bestStreak: initialBest,
      lastVisitDate: todayDateStr,
      lastStudyActivity: nowIso,
      lastStreakIncrementAt: nowIso,
      message: 'First activity logged! 1-day streak started! 🔥',
      incremented: true,
    };
  }

  // Calculate elapsed time from the last streak-incrementing activity
  const lastIncrementTimestamp = prevState.lastStreakIncrementAt || prevState.lastStudyActivity || prevState.lastVisitDate;
  const lastIncrementDate = new Date(lastIncrementTimestamp);
  const elapsedMs = now.getTime() - lastIncrementDate.getTime();
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  // Calculate calendar days between last streak visit date and current activity date
  const calendarDaysDiff = daysBetween(prevVisitDateStr, todayDateStr);

  // 2. SAME-PERIOD ACTIVITY: Less than 24 hours have elapsed OR same calendar day
  // (e.g. Monday 11:50 PM -> Tuesday 12:10 AM is only 20 min; Monday 10:00 AM -> Monday 6:00 PM is 8 hrs)
  if (elapsedHours < 24 || calendarDaysDiff === 0) {
    return {
      currentStreak: prevCurrent,
      bestStreak: prevBest,
      lastVisitDate: prevVisitDateStr,
      lastStudyActivity: nowIso,
      lastStreakIncrementAt: lastIncrementDate.toISOString(),
      message: 'Activity recorded! You already extended your streak for this period.',
      incremented: false,
    };
  }

  // 3. CONSECUTIVE STREAK: At least 24 hours have passed AND it is the next calendar day period
  if (calendarDaysDiff === 1) {
    const nextCurrent = prevCurrent + 1;
    const nextBest = Math.max(prevBest, nextCurrent);
    return {
      currentStreak: nextCurrent,
      bestStreak: nextBest,
      lastVisitDate: todayDateStr,
      lastStudyActivity: nowIso,
      lastStreakIncrementAt: nowIso,
      message: `Streak continued! You are on a ${nextCurrent}-day streak! 🔥`,
      incremented: true,
    };
  }

  // 4. MISSED STREAK: User went beyond the allowed streak window (2+ calendar days passed)
  // Current streak resets to 1, while best streak is preserved
  if (calendarDaysDiff >= 2) {
    return {
      currentStreak: 1,
      bestStreak: Math.max(prevBest, 1),
      lastVisitDate: todayDateStr,
      lastStudyActivity: nowIso,
      lastStreakIncrementAt: nowIso,
      message: 'Welcome back! Your streak reset to 1 day. Keep it going! 🔥',
      incremented: true,
    };
  }

  // Fallback: Clock skew / anomaly
  return {
    currentStreak: prevCurrent,
    bestStreak: prevBest,
    lastVisitDate: prevVisitDateStr,
    lastStudyActivity: nowIso,
    lastStreakIncrementAt: lastIncrementDate.toISOString(),
    message: 'Activity recorded.',
    incremented: false,
  };
}

/**
 * Fetch a user's current streak status
 * Completely user-specific. Completely isolated.
 *
 * @param {string} userId
 * @param {Date} [asOfDate=new Date()]
 * @returns {Promise<{ currentStreak: number, bestStreak: number, lastVisit: string|null, lastStudyActivity: string|null, isActive: boolean }>}
 */
export async function getUserStreak(userId, asOfDate = new Date()) {
  if (!userId) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastVisit: null,
      lastStudyActivity: null,
      isActive: false,
    };
  }

  const now = asOfDate instanceof Date ? asOfDate : new Date(asOfDate);
  const allStreaks = readPersistentStreaks();
  let record = allStreaks[userId] || null;

  // If no record exists for this user: Fresh new account with 0 streak
  if (!record || !record.lastVisitDate || record.currentStreak === 0) {
    return {
      currentStreak: 0,
      bestStreak: record?.bestStreak || 0,
      lastVisit: null,
      lastStudyActivity: null,
      isActive: false,
    };
  }

  // Check if active streak has lapsed (2 or more calendar days without study)
  const calendarDaysDiff = daysBetween(record.lastVisitDate, now);

  if (calendarDaysDiff >= 2) {
    // Streak has broken due to missed day!
    if (record.currentStreak > 0) {
      record.currentStreak = 0;
      allStreaks[userId] = record;
      writePersistentStreaks(allStreaks);

      // Async DB sync without blocking
      Promise.resolve().then(async () => {
        try {
          await prisma.userStreak.update({
            where: { userId },
            data: { currentStreak: 0 },
          });
        } catch (_) {}
      });
    }

    return {
      currentStreak: 0,
      bestStreak: record.bestStreak,
      lastVisit: record.lastVisitDate,
      lastStudyActivity: record.lastStudyActivity || null,
      isActive: false,
    };
  }

  // Active if visited today (0) or visited yesterday (1) and currentStreak > 0
  const active = calendarDaysDiff <= 1 && record.currentStreak > 0;

  return {
    currentStreak: record.currentStreak,
    bestStreak: record.bestStreak,
    lastVisit: record.lastVisitDate,
    lastStudyActivity: record.lastStudyActivity || null,
    isActive: active,
  };
}

/**
 * Record a valid study activity for an authenticated user
 *
 * @param {string} userId
 * @param {'quiz'|'flashcard'|'document'|'session'|string} activityType
 * @param {Date} [activityTimestamp=new Date()]
 * @returns {Promise<{ currentStreak: number, bestStreak: number, lastVisit: string, isActive: boolean, message: string, incremented: boolean }>}
 */
export async function recordUserActivity(userId, activityType = 'study', activityTimestamp = new Date()) {
  if (!userId) {
    throw new Error('User ID is required to record streak activity');
  }

  const now = activityTimestamp instanceof Date ? activityTimestamp : new Date(activityTimestamp);
  const allStreaks = readPersistentStreaks();
  const existing = allStreaks[userId] || null;

  // Compute next state enforcing 24h gap + calendar day rules
  const nextState = calculateNextStreak(existing, now);

  const updatedRecord = {
    userId,
    currentStreak: nextState.currentStreak,
    bestStreak: nextState.bestStreak,
    lastVisitDate: nextState.lastVisitDate,
    lastStudyActivity: nextState.lastStudyActivity,
    lastStreakIncrementAt: nextState.lastStreakIncrementAt,
  };

  // Persist to disk immediately (100% reliable & isolated per user)
  allStreaks[userId] = updatedRecord;
  writePersistentStreaks(allStreaks);

  // Sync to database asynchronously in background without delaying user requests
  Promise.resolve().then(async () => {
    try {
      await prisma.userStreak.upsert({
        where: { userId },
        create: {
          userId,
          currentStreak: nextState.currentStreak,
          bestStreak: nextState.bestStreak,
          lastVisitDate: new Date(nextState.lastVisitDate),
          lastStudyActivity: now,
        },
        update: {
          currentStreak: nextState.currentStreak,
          bestStreak: nextState.bestStreak,
          lastVisitDate: new Date(nextState.lastVisitDate),
          lastStudyActivity: now,
        },
      });

      await prisma.streakHistory.create({
        data: {
          userId,
          activityType: String(activityType || 'study'),
          streakCount: nextState.currentStreak,
          recordedAt: now,
        },
      });
    } catch (_) {}
  });

  return {
    currentStreak: nextState.currentStreak,
    bestStreak: nextState.bestStreak,
    lastVisit: nextState.lastVisitDate,
    isActive: nextState.currentStreak > 0,
    message: nextState.message,
    incremented: nextState.incremented,
  };
}

/**
 * Manually reset a user's current streak (e.g. for testing)
 * Best streak remains unchanged.
 *
 * @param {string} userId
 * @returns {Promise<{ currentStreak: number, bestStreak: number, message: string }>}
 */
export async function resetUserStreak(userId) {
  if (!userId) {
    return { currentStreak: 0, bestStreak: 0, message: 'User ID is required' };
  }

  const allStreaks = readPersistentStreaks();
  const existing = allStreaks[userId];
  const best = existing?.bestStreak || 0;

  allStreaks[userId] = {
    userId,
    currentStreak: 0,
    bestStreak: best,
    lastVisitDate: null,
    lastStudyActivity: null,
    lastStreakIncrementAt: null,
  };
  writePersistentStreaks(allStreaks);

  Promise.resolve().then(async () => {
    try {
      await prisma.userStreak.update({
        where: { userId },
        data: { currentStreak: 0 },
      });
    } catch (_) {}
  });

  return {
    currentStreak: 0,
    bestStreak: best,
    message: 'Streak has been reset to 0 days. Best streak preserved.',
  };
}

/**
 * Automated daily check - Graph Engineering Task Pipeline
 *
 * DAG Execution Shape:
 * Ingest (UTC Snapshot) -> Fetch Active Candidates -> Fan-out Evaluation -> Verifier -> Atomic Mutation -> Telemetry Merge
 *
 * @param {Date|string} [referenceDate=new Date()]
 * @returns {Promise<{ resetCount: number, checkedUsers: number, safeCount: number, atRiskCount: number, lapsedUserIds: string[], executionId: string, executedAt: string }>}
 */
export async function checkAndResetLapsedStreaks(referenceDate = new Date()) {
  const ref = normalizeDateToUtc(referenceDate) || new Date();
  const dateStr = formatUtcDateString(ref);
  const executionId = `streak-check-${dateStr}`;

  const allStreaks = readPersistentStreaks();
  let checkedUsers = 0;
  let resetCount = 0;
  let safeCount = 0;
  let atRiskCount = 0;
  const lapsedUserIds = [];

  // 1. FAN-OUT EVALUATION: Evaluate all active streaks
  const evaluations = [];
  for (const [userId, s] of Object.entries(allStreaks)) {
    if (s.currentStreak > 0 && s.lastVisitDate) {
      checkedUsers++;
      const days = daysBetween(s.lastVisitDate, ref);

      let decision = 'SAFE';
      if (days >= 2) {
        decision = 'LAPSED';
      } else if (days === 1) {
        decision = 'AT_RISK';
      }

      evaluations.push({
        userId,
        currentStreak: s.currentStreak,
        bestStreak: s.bestStreak,
        lastVisitDate: s.lastVisitDate,
        daysBetween: days,
        decision,
      });
    }
  }

  // 2. VERIFIER NODE (Context Separation & Sanity Guard)
  // Stop-rule guardrail: if > 50 active users and 100% flagged as lapsed, check for clock skew
  const flaggedLapsed = evaluations.filter((e) => e.decision === 'LAPSED');
  if (evaluations.length > 50 && flaggedLapsed.length === evaluations.length) {
    console.error(`[streak.service] [GUARDRAIL TRIGGERED] 100% of ${evaluations.length} active streaks flagged lapsed for ${dateStr}. Aborting mutation to prevent data wipe.`);
    return {
      resetCount: 0,
      checkedUsers: evaluations.length,
      safeCount: 0,
      atRiskCount: 0,
      lapsedUserIds: [],
      executionId,
      executedAt: new Date().toISOString(),
      abortedDueToGuardrail: true,
    };
  }

  // 3. ATOMIC MUTATION: Apply updates
  for (const evaluation of evaluations) {
    const s = allStreaks[evaluation.userId];
    if (evaluation.decision === 'LAPSED') {
      s.currentStreak = 0;
      resetCount++;
      lapsedUserIds.push(evaluation.userId);
    } else if (evaluation.decision === 'AT_RISK') {
      atRiskCount++;
    } else {
      safeCount++;
    }
  }

  // Persist to disk immediately
  if (resetCount > 0) {
    writePersistentStreaks(allStreaks);

    // Asynchronously synchronize with database
    Promise.resolve().then(async () => {
      try {
        await prisma.userStreak.updateMany({
          where: { userId: { in: lapsedUserIds } },
          data: { currentStreak: 0 },
        });

        await prisma.streakHistory.createMany({
          data: lapsedUserIds.map((id) => ({
            userId: id,
            activityType: 'streak_reset_daily_check',
            streakCount: 0,
            recordedAt: ref,
          })),
        });
      } catch (err) {
        // Fallback or offline DB logging
        console.warn('[streak.service] Async DB batch sync notice:', err.message);
      }
    });
  }

  const result = {
    resetCount,
    checkedUsers,
    safeCount,
    atRiskCount,
    lapsedUserIds,
    executionId,
    executedAt: new Date().toISOString(),
  };

  return result;
}

/**
 * Alias conforming to task graph naming conventions
 */
export const executeDailyStreakCheckGraph = checkAndResetLapsedStreaks;

let schedulerTimeout = null;

/**
 * Calculates milliseconds remaining until the upcoming midnight UTC
 * @returns {number}
 */
export function getMsUntilNextUtcMidnight() {
  const now = new Date();
  const nextMidnightUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return Math.max(nextMidnightUtc.getTime() - now.getTime(), 1000);
}

/**
 * Starts an in-process daily scheduler that runs the streak check at UTC midnight.
 * Completely replaces external n8n automation triggers.
 */
export function startDailyStreakScheduler() {
  if (schedulerTimeout) {
    clearTimeout(schedulerTimeout);
    schedulerTimeout = null;
  }

  const scheduleNextRun = () => {
    const delay = getMsUntilNextUtcMidnight();
    const hours = (delay / (1000 * 60 * 60)).toFixed(2);
    console.log(`[streak.scheduler] Next UTC midnight check scheduled in ${hours} hours.`);

    schedulerTimeout = setTimeout(async () => {
      try {
        console.log('[streak.scheduler] Executing midnight UTC streak check graph...');
        const result = await checkAndResetLapsedStreaks();
        console.log(`[streak.scheduler] Completed: checked ${result.checkedUsers} users, reset ${result.resetCount} lapsed streaks.`);
      } catch (err) {
        console.error('[streak.scheduler] Error running daily streak check:', err.message);
      } finally {
        scheduleNextRun();
      }
    }, delay);

    // Ensure this timeout doesn't hold process open during tests or shutdown
    if (schedulerTimeout && typeof schedulerTimeout.unref === 'function') {
      schedulerTimeout.unref();
    }
  };

  scheduleNextRun();
}

/**
 * Stops the in-process scheduler
 */
export function stopDailyStreakScheduler() {
  if (schedulerTimeout) {
    clearTimeout(schedulerTimeout);
    schedulerTimeout = null;
  }
}

