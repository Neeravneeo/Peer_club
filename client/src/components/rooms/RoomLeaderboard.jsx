import React from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export function RoomLeaderboard({ rankings = [] }) {
  const handleCheer = (name) => {
    toast.success(`👏 You cheered for ${name}!`);
  };

  if (!rankings || rankings.length === 0) {
    return (
      <div className="text-center py-10 text-xs text-[var(--color-stone)]">
        No study sessions logged in this room yet. Start studying together!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rankings.map((user, idx) => {
        let badgeColor = 'bg-[var(--color-linen)] text-[var(--color-graphite)]';
        if (idx === 0) badgeColor = 'bg-amber-400 text-amber-950 font-bold';
        else if (idx === 1) badgeColor = 'bg-slate-300 text-slate-900 font-bold';
        else if (idx === 2) badgeColor = 'bg-orange-300 text-orange-950 font-bold';

        return (
          <div
            key={user.id || idx}
            className="flex items-center justify-between p-4 rounded-[18px] bg-[var(--color-linen)]/40 border border-[var(--color-ash)]/70 hover:bg-[var(--color-linen)]/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs ${badgeColor}`}>
                {idx + 1}
              </div>

              <div className="w-9 h-9 rounded-full overflow-hidden border border-[var(--color-ash)]">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="text-sm font-semibold text-[var(--color-ink)]">
                  {user.name}
                </div>
                <div className="text-[11px] text-[var(--color-stone)]">
                  Active study circle member
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono font-bold text-[var(--color-ink)]">
                  {user.studyHours || 0} hrs
                </div>
                <div className="text-[10px] text-[var(--color-stone)] uppercase">
                  Logged Time
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono font-bold text-[var(--color-ink)]">
                  {user.quizzesCompleted || 0}
                </div>
                <div className="text-[10px] text-[var(--color-stone)] uppercase">
                  Quizzes
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-[var(--color-ink)]">
                  🔥 {user.streak || 1}d
                </div>
                <div className="text-[10px] text-[var(--color-stone)] uppercase">
                  Streak
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCheer(user.name)}
                className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 border border-[var(--color-ash)] flex items-center justify-center text-rose-500 transition-colors shadow-xs"
                title="Send High-Five"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
