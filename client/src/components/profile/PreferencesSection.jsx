import React from 'react';
import { Bell, Save } from 'lucide-react';

export const DEFAULT_PREFERENCES = {
  weeklyDigest: true,
  streakAlerts: true,
  quizReminders: true,
  flashcardReviews: true,
  roomMentions: false,
  aiInsights: true,
};

/**
 * PreferencesSection Component
 * Granular notification and study cadence toggles.
 */
export const PreferencesSection = ({
  preferences = DEFAULT_PREFERENCES,
  onTogglePreference,
  onSavePreferences,
  isLoading = false,
}) => {
  const toggleItems = [
    {
      key: 'weeklyDigest',
      title: 'Weekly Digest',
      description: 'Receive email summary every Sunday with study stats',
    },
    {
      key: 'streakAlerts',
      title: 'Streak Alerts',
      description: 'Get notified 2 hours before midnight if streak is at risk',
    },
    {
      key: 'quizReminders',
      title: 'Quiz Reminders',
      description: 'Daily reminders to complete AI-generated quizzes',
    },
    {
      key: 'flashcardReviews',
      title: 'Flashcard Reviews',
      description: 'Spaced repetition notifications for flashcards',
    },
    {
      key: 'roomMentions',
      title: 'Room Mentions',
      description: 'Notifications when mentioned in study room discussions',
    },
    {
      key: 'aiInsights',
      title: 'AI Insights',
      description: 'Alerts when new quizzes/flashcards are auto-generated',
    },
  ];

  return (
    <div className="bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-6 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-serif text-24px leading-[1.4] tracking-[-0.72px] text-[var(--color-ink)] flex items-center gap-2.5 font-normal">
          <Bell className="w-6 h-6 text-emerald-800" />
          <span>Study Preferences & Notifications</span>
        </h2>
        <div className="w-12 h-0.5 bg-[var(--color-mint)] rounded-full mt-2" />
      </div>

      {/* Toggle Items */}
      <div className="space-y-4">
        {toggleItems.map((item) => {
          const checked = Boolean(preferences[item.key]);
          return (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-[var(--color-ash)]/30 last:border-0 gap-4"
            >
              <div className="min-w-0 pr-2">
                <h4 className="text-sm font-medium text-[var(--color-ink)] font-sans">
                  {item.title}
                </h4>
                <p className="text-xs text-[var(--color-stone)] mt-0.5 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* iOS style Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onTogglePreference(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--color-cloud)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-mint)]/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-mint)]" />
              </label>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={onSavePreferences}
        disabled={isLoading}
        className="w-full bg-[var(--color-ink)] text-white rounded-full py-3.5 px-6 text-sm font-semibold hover:shadow-[var(--shadow-md)] transition-all mt-6 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Save className="w-4 h-4 text-[var(--color-mint)]" />
            <span>Save Preferences</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PreferencesSection;
