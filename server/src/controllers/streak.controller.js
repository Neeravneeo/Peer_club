import {
  getUserStreak,
  recordUserActivity,
  resetUserStreak,
} from '../services/streak.service.js';

/**
 * GET /api/streak
 * Fetch authenticated user's current streak, best streak, last visit date, and active status
 */
export async function getStreak(req, res, next) {
  try {
    const userId = req.user.id;
    const streakData = await getUserStreak(userId);

    return res.json(streakData);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/streak/update
 * Update streak upon user completing an activity (quiz, flashcard, document, session)
 * Body: { activityType?: string }
 */
export async function updateStreak(req, res, next) {
  try {
    const userId = req.user.id;
    const { activityType = 'study' } = req.body || {};

    const updatedStreak = await recordUserActivity(userId, activityType);

    return res.json(updatedStreak);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/streak/reset
 * Admin/emergency or testing reset of current streak (best streak preserved)
 */
export async function resetStreak(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await resetUserStreak(userId);

    return res.json(result);
  } catch (err) {
    next(err);
  }
}
