/**
 * Date Comparison Utilities for Frontend Streak Status & Visuals
 */

export function normalizeDateToUtc(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

export function isSameDay(date1, date2) {
  const d1 = normalizeDateToUtc(date1);
  const d2 = normalizeDateToUtc(date2);
  if (!d1 || !d2) return false;
  return d1.getTime() === d2.getTime();
}

export function daysBetween(date1, date2 = new Date()) {
  const d1 = normalizeDateToUtc(date1);
  const d2 = normalizeDateToUtc(date2);
  if (!d1 || !d2) return 0;

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((d2.getTime() - d1.getTime()) / msPerDay);
}

export function isYesterday(date, baseDate = new Date()) {
  return daysBetween(date, baseDate) === 1;
}

export function isStreakActive(lastVisitDate, currentDate = new Date()) {
  if (!lastVisitDate) return false;
  const diff = daysBetween(lastVisitDate, currentDate);
  return diff >= 0 && diff <= 1;
}

/**
 * Returns motivational text corresponding to current streak length
 * @param {number} streak
 * @returns {string}
 */
export function getStreakMotivationalText(streak) {
  const count = Number(streak) || 0;
  if (count === 0) return 'Start your streak today!';
  if (count <= 2) return 'Keep it burning! 🔥';
  if (count <= 6) return 'On fire! 🔥🔥';
  return 'Streak master! 🔥🔥';
}
