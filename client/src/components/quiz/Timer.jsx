import React from 'react';
import { Clock } from 'lucide-react';

export function Timer({ seconds, isCountdown = false }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Warning when under 1 minute in countdown mode
  const isWarning = isCountdown && seconds <= 60;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs transition-colors ${
        isWarning
          ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
          : 'bg-white border-[var(--color-ash)] text-[var(--color-ink)]'
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${isWarning ? 'text-rose-600' : 'text-emerald-600'}`} />
      <span className="font-mono text-xs font-semibold tracking-wide">
        {formatted}
      </span>
    </div>
  );
}
