import React from 'react';
import { Trophy, Check, Clock, Lock } from 'lucide-react';
import { TornPaperBackdrop } from '@/components/DecorativeElements';

export const DEFAULT_BADGES = [
  {
    id: 'badge-1',
    icon: '🎯',
    name: 'First Step',
    description: 'Completed your first quiz',
    status: 'earned', // 'earned' | 'in-progress' | 'locked'
  },
  {
    id: 'badge-2',
    icon: '🔥',
    name: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    status: 'earned',
  },
  {
    id: 'badge-3',
    icon: '🧠',
    name: 'Quiz Wizard',
    description: 'Scored 90%+ in 5 quizzes',
    status: 'in-progress',
  },
  {
    id: 'badge-4',
    icon: '📚',
    name: 'Flash Master',
    description: 'Reviewed 100 flashcards',
    status: 'locked',
  },
  {
    id: 'badge-5',
    icon: '🌅',
    name: 'Early Bird',
    description: 'Studied before 8 AM',
    status: 'earned',
  },
  {
    id: 'badge-6',
    icon: '🤝',
    name: 'Collaborator',
    description: 'Hosted a study room',
    status: 'locked',
  },
];

/**
 * BadgesSection Component
 * Gamified trophy case with tiered status indicators.
 */
export const BadgesSection = ({ badges = DEFAULT_BADGES }) => {
  const earnedCount = badges.filter((b) => b.status === 'earned').length;
  const totalCount = badges.length;
  const progressPercent = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-6 sm:p-8 relative">
      <TornPaperBackdrop color="bg-[var(--color-marigold)]/15" className="hidden sm:block" />

      {/* Title */}
      <div className="mb-6">
        <h2 className="font-serif text-24px leading-[1.4] tracking-[-0.72px] text-[var(--color-ink)] flex items-center gap-2.5 font-normal">
          <Trophy className="w-6 h-6 text-amber-600" />
          <span>Badges & Trophies</span>
        </h2>
        <div className="w-12 h-0.5 bg-[var(--color-marigold)] rounded-full mt-2" />
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-[var(--color-linen)]/60 p-4 rounded-[16px] border border-[var(--color-ash)]/40">
        <div className="flex items-center justify-between text-sm font-medium text-[var(--color-graphite)] mb-2 font-sans">
          <span>{earnedCount} / {totalCount} Badges Earned</span>
          <span className="font-semibold text-emerald-800 font-mono text-xs">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[var(--color-ash)]/50">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-marigold)] via-amber-300 to-[var(--color-mint)] rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {badges.map((badge) => {
          const isEarned = badge.status === 'earned';
          const isInProgress = badge.status === 'in-progress';
          const isLocked = badge.status === 'locked';

          return (
            <div
              key={badge.id}
              className={`relative p-4 sm:p-5 rounded-[20px] border transition-all hover:shadow-md flex flex-col items-center text-center select-none ${
                isEarned
                  ? 'bg-[var(--color-mint)]/10 border-[var(--color-mint)]/50 hover:border-[var(--color-mint)]'
                  : isInProgress
                  ? 'bg-[var(--color-marigold)]/10 border-[var(--color-marigold)]/50 hover:border-amber-400'
                  : 'bg-[var(--color-cloud)]/70 border-[var(--color-ash)] opacity-60 grayscale-[40%]'
              }`}
            >
              {/* Status Indicator Top Right */}
              <div className="absolute top-3 right-3">
                {isEarned && (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center" title="Earned">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                )}
                {isInProgress && (
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center" title="In Progress">
                    <Clock className="w-3 h-3 text-orange-600" />
                  </div>
                )}
                {isLocked && (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-linen)] flex items-center justify-center" title="Locked">
                    <Lock className="w-3 h-3 text-[var(--color-stone)]" />
                  </div>
                )}
              </div>

              {/* Icon Circle */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 ${
                  isEarned
                    ? 'bg-[var(--color-mint)]/30 border border-[var(--color-mint)]/60'
                    : isInProgress
                    ? 'bg-[var(--color-marigold)]/30 border border-[var(--color-marigold)]/60'
                    : 'bg-[var(--color-linen)] border border-[var(--color-ash)]'
                }`}
              >
                {badge.icon}
              </div>

              {/* Badge Details */}
              <h4 className="text-sm font-semibold text-[var(--color-ink)] mb-1 font-sans">
                {badge.name}
              </h4>
              <p className="text-xs text-[var(--color-stone)] leading-relaxed font-sans line-clamp-2">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesSection;
