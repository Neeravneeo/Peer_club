import React from 'react';
import { Star, Clock, CheckCircle2, Flame, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PersonalRankCard({ userStats, onLogSession }) {
  const navigate = useNavigate();

  const rank = userStats?.rank || 8;
  const totalUsers = userStats?.totalUsers || 142;
  const hours = userStats?.studyHours || 24.5;
  const quizzes = userStats?.quizzesCompleted || 10;
  const streak = userStats?.streak || 5;
  const nextTargetName = userStats?.nextTargetName || 'Sarah K.';
  const nextTargetHours = userStats?.nextTargetDiff || 1.2;

  return (
    <div className="bg-gradient-to-r from-[var(--color-mint)]/20 via-white to-[var(--color-periwinkle)]/20 rounded-[28px] border-2 border-dashed border-[var(--color-ash)] p-6 md:p-8 mb-10 shadow-xs relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-[var(--color-ink)]">
              Your Current Standing
            </h3>
            <p className="text-xs text-[var(--color-stone)]">
              Real-time standing based on verified focus sessions and quizzes
            </p>
          </div>
        </div>

        {/* Rank Pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[var(--color-ash)] text-xs font-bold text-[var(--color-ink)] shadow-xs">
          <span>#{rank} of {totalUsers} Scholars</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Top 6%</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="flex items-center gap-2.5 bg-white/80 rounded-[14px] p-3 border border-[var(--color-ash)]/60">
          <Clock className="w-4 h-4 text-[var(--color-azure)]" />
          <span className="text-xs font-semibold text-[var(--color-ink)] font-mono">
            {hours} hrs logged
          </span>
        </div>
        <div className="flex items-center gap-2.5 bg-white/80 rounded-[14px] p-3 border border-[var(--color-ash)]/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-[var(--color-ink)] font-mono">
            {quizzes} Quizzes Completed
          </span>
        </div>
        <div className="flex items-center gap-2.5 bg-white/80 rounded-[14px] p-3 border border-[var(--color-ash)]/60">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
          <span className="text-xs font-semibold text-[var(--color-ink)] font-mono">
            🔥 {streak} Days Streak
          </span>
        </div>
      </div>

      {/* Progress to next rank */}
      <div className="space-y-2 mt-4 pt-4 border-t border-[var(--color-ash)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 max-w-md">
          <div className="text-xs font-medium text-[var(--color-graphite)]">
            💡 Study <span className="font-bold text-[var(--color-ink)]">{nextTargetHours} hours more</span> to overtake #{rank - 1} ({nextTargetName})
          </div>
          <div className="w-full h-2 bg-[var(--color-linen)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full transition-all duration-500"
              style={{ width: '68%' }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => {
            if (onLogSession) onLogSession();
            else navigate('/rooms');
          }}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-bold hover:shadow-md transition-all active:scale-[0.99] whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Log Study Session</span>
        </button>
      </div>
    </div>
  );
}
