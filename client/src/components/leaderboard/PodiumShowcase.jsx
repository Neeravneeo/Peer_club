import React from 'react';
import { Flame, Clock, CheckCircle2, Heart, Award } from 'lucide-react';
import { toast } from 'sonner';

export function PodiumShowcase({ topScholars = [] }) {
  if (!topScholars || topScholars.length < 3) return null;

  const first = topScholars[0];
  const second = topScholars[1];
  const third = topScholars[2];

  const handleCheer = (name) => {
    toast.success(`👏 You cheered for ${name}!`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
      {/* 2nd Place: Silver (Left, Medium height) */}
      <div className="order-2 md:order-1 relative bg-gradient-to-b from-slate-50/90 to-white rounded-[28px] border-2 border-slate-300 shadow-xl p-6 md:p-8 flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl">
        <div className="text-center relative">
          {/* Rank Badge */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            2
          </div>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-slate-300 mx-auto mb-3 overflow-hidden shadow-md">
            <img
              src={second.avatar}
              alt={second.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(second.name)}&background=e2e8f0&color=334155`;
              }}
            />
          </div>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            🥈 Silver Scholar
          </span>

          <h3 className="font-serif text-xl font-medium text-[var(--color-ink)] truncate">
            {second.name}
          </h3>
          <p className="text-xs text-[var(--color-stone)] mb-1">{second.username}</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium mb-4 truncate max-w-[180px]">
            {second.roomName}
          </span>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/70 text-center mb-4">
            <div>
              <div className="text-base font-bold font-sans text-[var(--color-ink)]">{second.studyHours}h</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Hours</div>
            </div>
            <div>
              <div className="text-base font-bold font-sans text-[var(--color-ink)]">{second.quizzesCompleted}</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Quizzes</div>
            </div>
            <div>
              <div className="text-base font-bold font-sans text-[var(--color-ink)]">🔥 {second.streak}d</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Streak</div>
            </div>
          </div>
        </div>

        {/* Cheer Button */}
        <button
          type="button"
          onClick={() => handleCheer(second.name)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>{second.cheers || 32} Cheers</span>
        </button>
      </div>

      {/* 1st Place: Gold (Center, Elevated & Tallest) */}
      <div className="order-1 md:order-2 relative bg-gradient-to-b from-amber-50/90 via-white to-white rounded-[32px] border-2 border-amber-300 shadow-2xl p-8 md:p-10 md:-translate-y-4 flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl">
        {/* Glowing aura effect */}
        <div className="absolute inset-0 bg-amber-200/20 rounded-[32px] blur-xl -z-10" />

        {/* Floating Crown Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold tracking-wide shadow-lg flex items-center gap-1 whitespace-nowrap">
          <span>👑 Champion of the Week</span>
        </div>

        <div className="text-center relative pt-2">
          {/* Rank Badge */}
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-base shadow-lg ring-2 ring-white">
            1
          </div>

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-amber-400 mx-auto mb-3 overflow-hidden shadow-xl ring-4 ring-amber-200/50">
            <img
              src={first.avatar}
              alt={first.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(first.name)}&background=fef3c7&color=92400e`;
              }}
            />
          </div>

          <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            🥇 #1 Grandmaster
          </span>

          <h3 className="font-serif text-2xl font-bold text-[var(--color-ink)] truncate">
            {first.name}
          </h3>
          <p className="text-xs text-[var(--color-stone)] mb-1">{first.username}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-medium mb-4 truncate max-w-[220px]">
            {first.roomName}
          </span>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-amber-200/80 text-center mb-4">
            <div>
              <div className="text-lg font-bold font-sans text-[var(--color-ink)]">{first.studyHours}h</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Hours</div>
            </div>
            <div>
              <div className="text-lg font-bold font-sans text-[var(--color-ink)]">{first.quizzesCompleted}</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Quizzes</div>
            </div>
            <div>
              <div className="text-lg font-bold font-sans text-[var(--color-ink)]">🔥 {first.streak}d</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Streak</div>
            </div>
          </div>
        </div>

        {/* Cheer Button */}
        <button
          type="button"
          onClick={() => handleCheer(first.name)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span>{first.cheers || 48} Cheers</span>
        </button>
      </div>

      {/* 3rd Place: Bronze (Right, Compact) */}
      <div className="order-3 relative bg-gradient-to-b from-orange-50/90 to-white rounded-[28px] border-2 border-orange-300 shadow-xl p-6 md:p-8 flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl">
        <div className="text-center relative">
          {/* Rank Badge */}
          <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            3
          </div>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-orange-300 mx-auto mb-3 overflow-hidden shadow-md">
            <img
              src={third.avatar}
              alt={third.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(third.name)}&background=ffedd5&color=9a3412`;
              }}
            />
          </div>

          <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            🥉 Bronze Scholar
          </span>

          <h3 className="font-serif text-xl font-medium text-[var(--color-ink)] truncate">
            {third.name}
          </h3>
          <p className="text-xs text-[var(--color-stone)] mb-1">{third.username}</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[11px] font-medium mb-4 truncate max-w-[180px]">
            {third.roomName}
          </span>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-orange-200/70 text-center mb-4">
            <div>
              <div className="text-base font-bold font-sans text-[var(--color-ink)]">{third.studyHours}h</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Hours</div>
            </div>
            <div>
              <div className="text-base font-bold font-sans text-[var(--color-ink)]">{third.quizzesCompleted}</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Quizzes</div>
            </div>
            <div>
              <div className="text-base font-bold font-sans text-[var(--color-ink)]">🔥 {third.streak}d</div>
              <div className="text-[10px] text-[var(--color-stone)] uppercase font-semibold">Streak</div>
            </div>
          </div>
        </div>

        {/* Cheer Button */}
        <button
          type="button"
          onClick={() => handleCheer(third.name)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-900 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
          <span>{third.cheers || 24} Cheers</span>
        </button>
      </div>
    </div>
  );
}
