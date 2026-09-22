import React from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export function UserRow({ user, index }) {
  const isTop3 = user.rank <= 3;
  const isCurrentUser = user.isCurrentUser;

  const handleCheer = (e) => {
    e.stopPropagation();
    toast.success(`👏 Cheered for ${user.name}!`);
  };

  // Rank badge styling
  let rankBadge = 'bg-[var(--color-linen)] text-[var(--color-graphite)]';
  if (user.rank === 1) rankBadge = 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xs';
  else if (user.rank === 2) rankBadge = 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-xs';
  else if (user.rank === 3) rankBadge = 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-xs';

  return (
    <tr
      className={`border-b border-[var(--color-ash)]/40 last:border-0 transition-colors ${
        isCurrentUser
          ? 'bg-lime-50/60 font-semibold'
          : index % 2 === 0
          ? 'bg-white hover:bg-[var(--color-linen)]/30'
          : 'bg-[var(--color-linen)]/20 hover:bg-[var(--color-linen)]/40'
      }`}
    >
      {/* Rank Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rankBadge}`}>
            {user.rank}
          </div>
          {user.rankDelta > 0 && (
            <span className="text-[11px] font-bold text-emerald-600">
              ▲ +{user.rankDelta}
            </span>
          )}
          {user.rankDelta < 0 && (
            <span className="text-[11px] font-bold text-rose-600">
              ▼ {user.rankDelta}
            </span>
          )}
          {(!user.rankDelta || user.rankDelta === 0) && (
            <span className="text-[11px] text-[var(--color-stone)]">—</span>
          )}
        </div>
      </td>

      {/* User Info Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--color-ash)]/70 flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f1f5f9&color=475569`;
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                {user.name}
              </span>
              {isCurrentUser && (
                <span className="px-2 py-0.5 rounded-full bg-lime-200 text-emerald-950 text-[10px] font-bold uppercase">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-stone)] mt-0.5">
              <span>{user.username}</span>
              {user.roomName && (
                <>
                  <span>•</span>
                  <span className="text-[var(--color-azure)]">{user.roomName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Study Hours */}
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[var(--color-graphite)] font-medium">
        {user.studyHours} hrs
      </td>

      {/* Quizzes Completed */}
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[var(--color-graphite)]">
        {user.quizzesCompleted}
      </td>

      {/* Streak */}
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-[var(--color-graphite)]">
        🔥 {user.streak}d
      </td>

      {/* Total Points */}
      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-[var(--color-ink)]">
        {user.points ? user.points.toLocaleString() : (user.studyHours * 100).toFixed(0)}
      </td>

      {/* Cheer Button */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button
          type="button"
          onClick={handleCheer}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-rose-50 border border-[var(--color-ash)] hover:border-rose-300 text-xs text-[var(--color-graphite)] hover:text-rose-600 transition-colors"
          title="Cheer for scholar"
        >
          <Heart className="w-3 h-3 text-rose-500" />
          <span>{user.cheers || 12}</span>
        </button>
      </td>
    </tr>
  );
}
