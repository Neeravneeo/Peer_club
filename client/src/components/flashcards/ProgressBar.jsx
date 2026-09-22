import React from 'react';

/**
 * ProgressBar Component
 * Shows current card index and session completion bar.
 */
export const ProgressBar = ({ current = 1, total = 20, className = '' }) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-graphite)] mb-2 font-sans">
        <span>Card {current} of {total}</span>
        <span className="font-mono text-emerald-800">{percentage}% completed</span>
      </div>
      <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden border border-[var(--color-ash)]/60 shadow-xs">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-mint)] via-emerald-400 to-[var(--color-azure)] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
