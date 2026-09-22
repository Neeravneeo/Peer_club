import React from 'react';
import { Pencil, Flame, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { TornPaperBackdrop } from '@/components/DecorativeElements';

/**
 * ProfileHero Component
 * Good Game inspired hero banner combined with Craft.do scrapbook aesthetic.
 */
export const ProfileHero = ({
  name = 'Finn Campbell Mertens',
  email = 'finn@university.edu',
  avatar = '🎓',
  role = 'Verified Scholar',
  joinDate = 'Member since September 2026',
  streakDays = 5,
  totalStudyMinutes = 750,
  badgesCount = 4,
  onEditAvatarClick,
}) => {
  const hours = Math.floor(totalStudyMinutes / 60);
  const mins = totalStudyMinutes % 60;
  const timeFormatted = `${hours}h ${mins > 0 ? `${mins}m` : ''} Total`;

  return (
    <div className="w-full bg-white rounded-[32px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-8 md:p-12 mb-10 relative overflow-hidden select-none group">
      {/* Decorative Torn Paper Backdrop Corner */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-mint)]/20 rounded-full blur-2xl pointer-events-none -z-0" />
      <TornPaperBackdrop color="bg-[var(--color-mint)]/20" className="hidden md:block" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        {/* Left: Avatar Section */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[24px] bg-gradient-to-br from-[var(--color-mint)]/30 to-[var(--color-periwinkle)]/30 flex items-center justify-center text-5xl md:text-6xl border-4 border-white shadow-lg transition-transform group-hover:scale-105">
            {avatar}
          </div>

          <button
            type="button"
            onClick={onEditAvatarClick}
            title="Change Avatar"
            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center hover:shadow-md transition-all cursor-pointer group/btn"
          >
            <Pencil className="w-4 h-4 text-[var(--color-mint)] transition-transform group-hover/btn:rotate-12" />
          </button>
        </div>

        {/* Right: Profile Information */}
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-32px sm:text-[38px] md:text-[46px] leading-[1.1] tracking-[-1.38px] text-[var(--color-ink)] mb-2 font-normal truncate">
            {name} 👋
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-mint)]/25 border border-[var(--color-mint)]/50 text-[var(--color-ink)] text-xs font-semibold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>{role}</span>
            </span>
          </div>

          <p className="text-sm text-[var(--color-graphite)] font-sans mb-5">
            {email} • {joinDate}
          </p>

          {/* Metric Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {/* Metric 1: Streak */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-marigold)]/30 border border-[var(--color-marigold)]/70 text-[var(--color-ink)] text-sm font-medium shadow-xs">
              <Flame className="w-4 h-4 text-amber-900 fill-amber-500" />
              <span className="font-semibold">{streakDays}-Day Streak</span>
            </div>

            {/* Metric 2: Total Study Time */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-periwinkle)]/30 border border-[var(--color-periwinkle)]/70 text-[var(--color-ink)] text-sm font-medium shadow-xs">
              <Clock className="w-4 h-4 text-indigo-900" />
              <span>{timeFormatted}</span>
            </div>

            {/* Metric 3: Badges */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-mint)]/30 border border-[var(--color-mint)]/70 text-[var(--color-ink)] text-sm font-medium shadow-xs">
              <Trophy className="w-4 h-4 text-emerald-900" />
              <span>{badgesCount} Badges Unlocked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
