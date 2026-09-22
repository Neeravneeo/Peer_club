/**
 * Date Comparison Utilities for Streak Tracking
 * Uses UTC server time boundaries to ensure consistency and prevent clock skew / client manipulation.
 */

/**
 * Normalizes a date into a UTC midnight Date object (00:00:00.000)
 * @param {Date|string|number} dateInput
 * @returns {Date|null}
 */
export function normalizeDateToUtc(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Formats a date into YYYY-MM-DD string in UTC
 * @param {Date|string|number} dateInput
 * @returns {string|null}
 */
export function formatUtcDateString(dateInput) {
  const norm = normalizeDateToUtc(dateInput);
  if (!norm) return null;
  return norm.toISOString().split('T')[0];
}

/**
 * Checks if two dates represent the exact same calendar day in UTC
 * @param {Date|string|number} date1
 * @param {Date|string|number} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  const d1 = normalizeDateToUtc(date1);
  const d2 = normalizeDateToUtc(date2);
  if (!d1 || !d2) return false;
  return d1.getTime() === d2.getTime();
}

/**
 * Calculates whole calendar days between two dates: (date2 - date1)
 * Positive if date2 > date1.
 * 0 = same day
 * 1 = exactly 1 day apart
 * >= 2 = two or more days apart
 * @param {Date|string|number} date1 Earlier date (e.g. last visit)
 * @param {Date|string|number} date2 Later date (e.g. today)
 * @returns {number}
 */
export function daysBetween(date1, date2 = new Date()) {
  const d1 = normalizeDateToUtc(date1);
  const d2 = normalizeDateToUtc(date2);
  if (!d1 || !d2) return 0;

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((d2.getTime() - d1.getTime()) / msPerDay);
}

/**
 * Checks if the given date is yesterday relative to baseDate (defaults to server now)
 * @param {Date|string|number} date
 * @param {Date|string|number} [baseDate=new Date()]
 * @returns {boolean}
 */
export function isYesterday(date, baseDate = new Date()) {
  return daysBetween(date, baseDate) === 1;
}

/**
 * Checks if a streak is still active based on the last visit date.
 * Active if last visit was today (0 days ago) or yesterday (1 day ago).
 * Inactive if last visit was 2 or more days ago or never.
 * @param {Date|string|number|null} lastVisitDate
 * @param {Date|string|number} [currentDate=new Date()]
 * @returns {boolean}
 */
export function isStreakActive(lastVisitDate, currentDate = new Date()) {
  if (!lastVisitDate) return false;
  const diff = daysBetween(lastVisitDate, currentDate);
  return diff >= 0 && diff <= 1;
}
