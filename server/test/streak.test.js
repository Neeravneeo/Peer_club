import assert from 'node:assert/strict';
import {
  normalizeDateToUtc,
  isSameDay,
  isYesterday,
  daysBetween,
  isStreakActive,
  formatUtcDateString,
} from '../src/utils/dateUtils.js';
import {
  calculateNextStreak,
  getUserStreak,
  recordUserActivity,
  resetUserStreak,
  checkAndResetLapsedStreaks,
  executeDailyStreakCheckGraph,
  getMsUntilNextUtcMidnight,
} from '../src/services/streak.service.js';


console.log('🧪 Starting Comprehensive Streak Logic Unit Tests (10 Scenarios)...\n');

// ==========================================
// TEST 1: Completely New User
// Expected: Current: 0d, Best: 0d, isActive: false
// ==========================================
console.log('--- TEST 1: Completely New User ---');
const userNewStatus = await getUserStreak('test-user-brand-new-' + Date.now());
assert.equal(userNewStatus.currentStreak, 0, 'New user current streak must be 0');
assert.equal(userNewStatus.bestStreak, 0, 'New user best streak must be 0');
assert.equal(userNewStatus.isActive, false, 'New user must not have an active streak');
assert.equal(userNewStatus.lastVisit, null, 'New user last visit must be null');
console.log('✔ TEST 1 Passed: New user begins at 0d streak, Best: 0d, Inactive.');

// ==========================================
// TEST 2: New User Performs First Valid Activity
// Expected: Current: 1d, Best: 1d
// ==========================================
console.log('\n--- TEST 2: First Valid Activity ---');
const userA_Id = 'test-user-A-' + Date.now();
const t1_Monday10AM = new Date('2026-09-14T10:00:00Z');
const afterFirstActivity = await recordUserActivity(userA_Id, 'quiz', t1_Monday10AM);

assert.equal(afterFirstActivity.currentStreak, 1, 'Current streak should become 1d');
assert.equal(afterFirstActivity.bestStreak, 1, 'Best streak should become 1d');
assert.equal(afterFirstActivity.isActive, true, 'Streak is now active');
assert.equal(afterFirstActivity.incremented, true, 'First activity must increment');
console.log('✔ TEST 2 Passed: First study activity starts a 1d streak.');

// ==========================================
// TEST 3: Same User Performs Multiple Activities Within 24 Hours
// Expected: The streak does not increase multiple times (stays at 1d)
// ==========================================
console.log('\n--- TEST 3: Multiple Activities Within 24 Hours ---');
// User completes another quiz Monday 6:00 PM (8 hours later)
const t2_Monday6PM = new Date('2026-09-14T18:00:00Z');
const afterSecondActivity = await recordUserActivity(userA_Id, 'flashcard', t2_Monday6PM);

assert.equal(afterSecondActivity.currentStreak, 1, 'Streak must stay at 1d for activity within 24 hours');
assert.equal(afterSecondActivity.bestStreak, 1, 'Best streak must stay at 1d');
assert.equal(afterSecondActivity.incremented, false, 'Should not increment within 24 hours');
console.log('✔ TEST 3 Passed: Activities within 24h maintain streak without double-counting.');

// ==========================================
// TEST 4: User Performs Activity After At Least 24 Hours (Next Day)
// Expected: Current streak increases by 1 (1d -> 2d, Best: 2d)
// ==========================================
console.log('\n--- TEST 4: Valid Activity After 24+ Hours (Consecutive Day) ---');
// User completes session Tuesday 10:30 AM (24.5 hours after Monday 10:00 AM)
const t3_Tuesday1030AM = new Date('2026-09-15T10:30:00Z');
const afterTuesdayActivity = await recordUserActivity(userA_Id, 'session', t3_Tuesday1030AM);

assert.equal(afterTuesdayActivity.currentStreak, 2, 'Current streak must increase to 2d');
assert.equal(afterTuesdayActivity.bestStreak, 2, 'Best streak must increase to 2d');
assert.equal(afterTuesdayActivity.incremented, true, 'Consecutive activity after 24h must increment');
console.log('✔ TEST 4 Passed: Activity after 24h gap on consecutive day increases streak to 2d.');

// ==========================================
// TEST 5: User Crosses Midnight But Has NOT Completed 24-Hour Gap
// Example: Monday 11:50 PM -> Tuesday 12:10 AM (Only 20 minutes have passed)
// Expected: Streak does NOT increase
// ==========================================
console.log('\n--- TEST 5: Midnight Crossing Without 24-Hour Gap ---');
const userMidnightId = 'test-user-midnight-' + Date.now();
const mon1150PM = new Date('2026-09-14T23:50:00Z');
const tues1210AM = new Date('2026-09-15T00:10:00Z'); // 20 minutes later

await recordUserActivity(userMidnightId, 'quiz', mon1150PM);
const midnightCheck = await recordUserActivity(userMidnightId, 'flashcard', tues1210AM);

assert.equal(midnightCheck.currentStreak, 1, 'Streak must NOT increase when only 20 min passed across midnight');
assert.equal(midnightCheck.incremented, false, '20-minute jump must not increment streak');
console.log('✔ TEST 5 Passed: Calendar date change alone without 24-hour gap does not increment.');

// ==========================================
// TEST 6: User Misses the Required Streak Period
// Expected: Current streak becomes 0, Best streak remains unchanged
// ==========================================
console.log('\n--- TEST 6: Missed Streak Period ---');
// User A was on 2d streak on Tuesday (2026-09-15).
// Skip Wednesday (2026-09-16). On Thursday (2026-09-17) user checks streak without studying.
const t4_ThursdayNoon = new Date('2026-09-17T12:00:00Z');
const lapsedCheck = await getUserStreak(userA_Id, t4_ThursdayNoon);

assert.equal(lapsedCheck.currentStreak, 0, 'Current streak should lapse to 0 after missing period');
assert.equal(lapsedCheck.bestStreak, 2, 'Best streak must NOT be deleted, remains 2d');
assert.equal(lapsedCheck.isActive, false, 'Streak is now inactive');
console.log('✔ TEST 6 Passed: Missed period lapses current streak to 0 while preserving best streak.');

// ==========================================
// TEST 7: User Starts a New Streak After Breaking Previous One
// Expected: Current: 1d, Best: previous highest streak (2d)
// ==========================================
console.log('\n--- TEST 7: Return After Breaking Streak ---');
const afterReturnActivity = await recordUserActivity(userA_Id, 'quiz', t4_ThursdayNoon);

assert.equal(afterReturnActivity.currentStreak, 1, 'Current streak resets to 1d upon new activity');
assert.equal(afterReturnActivity.bestStreak, 2, 'Best streak remains highest historical record (2d)');
assert.equal(afterReturnActivity.isActive, true, 'Streak is active again');
console.log('✔ TEST 7 Passed: Returning after broken streak starts fresh at 1d, preserving Best: 2d.');

// ==========================================
// TEST 8 & 9: Multi-User Data Isolation
// User A has active streak, User B is completely new
// User B must never inherit User A's streak!
// ==========================================
console.log('\n--- TEST 8 & 9: Multi-User Data Isolation ---');
const userB_Id = 'test-user-B-' + Date.now();
const userB_Status = await getUserStreak(userB_Id);

assert.equal(userB_Status.currentStreak, 0, 'User B must see 0d');
assert.equal(userB_Status.bestStreak, 0, 'User B must see Best: 0d');

// Verify User A still retains their own data
const userA_Status = await getUserStreak(userA_Id, t4_ThursdayNoon);
assert.equal(userA_Status.currentStreak, 1, 'User A retains their own 1d streak');
assert.equal(userA_Status.bestStreak, 2, 'User A retains their own Best: 2d');

console.log('✔ TEST 8 & 9 Passed: Multi-user data is 100% isolated. User B never sees User A data.');

// ==========================================
// TEST 10: Persistence on Reload
// Expected: Reading the status repeatedly returns the exact same data
// ==========================================
console.log('\n--- TEST 10: Persistence & Reload ---');
const reloadedUserA = await getUserStreak(userA_Id, t4_ThursdayNoon);
assert.equal(reloadedUserA.currentStreak, 1);
assert.equal(reloadedUserA.bestStreak, 2);

const reloadedUserB = await getUserStreak(userB_Id);
assert.equal(reloadedUserB.currentStreak, 0);
assert.equal(reloadedUserB.bestStreak, 0);
console.log('✔ TEST 10 Passed: Streak data remains identical and persistent across reloads.');

// ==========================================
// TEST 11: Task Graph Daily Streak Batch Check & Reset
// Setup user with activity 2 days ago (Lapsed) and user with activity yesterday (Safe)
// ==========================================
console.log('\n--- TEST 11: Task Graph Batch Check & Reset ---');
const userLapsed = 'test-graph-lapsed-' + Date.now();
const userSafe = 'test-graph-safe-' + Date.now();

// userLapsed studied 2026-09-14
await recordUserActivity(userLapsed, 'quiz', new Date('2026-09-14T10:00:00Z'));
// userSafe studied 2026-09-15
await recordUserActivity(userSafe, 'quiz', new Date('2026-09-15T10:00:00Z'));

// Batch check on 2026-09-16 (diff for userLapsed is 2 -> LAPSED, diff for userSafe is 1 -> AT_RISK/SAFE)
const checkResult = await executeDailyStreakCheckGraph(new Date('2026-09-16T00:00:00Z'));
assert.ok(checkResult.checkedUsers >= 2, 'Must check all active users');
assert.ok(checkResult.lapsedUserIds.includes(userLapsed), 'userLapsed must be in lapsed list');
assert.ok(!checkResult.lapsedUserIds.includes(userSafe), 'userSafe must NOT be lapsed');

// Verify user states
const lapsedUserStatus = await getUserStreak(userLapsed, new Date('2026-09-16T12:00:00Z'));
assert.equal(lapsedUserStatus.currentStreak, 0, 'Lapsed user streak must be 0');
assert.equal(lapsedUserStatus.bestStreak, 1, 'Lapsed user bestStreak must be preserved at 1');

const safeUserStatus = await getUserStreak(userSafe, new Date('2026-09-16T12:00:00Z'));
assert.equal(safeUserStatus.currentStreak, 1, 'Safe user streak must remain intact at 1');
console.log('✔ TEST 11 Passed: Task Graph Batch Check correctly lapses 2-day users and preserves active ones.');

// ==========================================
// TEST 12: In-Process Midnight Scheduler Calculation
// ==========================================
console.log('\n--- TEST 12: Scheduler Midnight Calculation ---');
const msToMidnight = getMsUntilNextUtcMidnight();
assert.ok(msToMidnight > 0, 'msToMidnight must be positive');
assert.ok(msToMidnight <= 24 * 60 * 60 * 1000, 'msToMidnight must be within 24 hours');
console.log(`✔ TEST 12 Passed: Scheduler correctly calculates ${Math.round(msToMidnight / 1000 / 60)} minutes to UTC midnight.`);

console.log('\n🎉 ALL 12 EXHAUSTIVE STREAK & GRAPH REQUIREMENTS VERIFIED SUCCESSFULLY!\n');

