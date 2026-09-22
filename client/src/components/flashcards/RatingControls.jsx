import React from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';

/**
 * RatingControls Component
 * Fixed floating action bar with Still Learning and Mastered triggers.
 */
export const RatingControls = ({
  onMarkRevisit,
  onMarkMastered,
  onFlip,
  isFlipped = false,
  disabled = false,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-3 sm:gap-4 bg-white/95 backdrop-blur-xl rounded-full px-4 sm:px-6 py-3 shadow-2xl border border-[var(--color-ash)]">
        {/* Flip toggle on small screens */}
        <button
          type="button"
          onClick={onFlip}
          className="sm:hidden px-3 py-2.5 rounded-full bg-[var(--color-linen)] text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-ash)]"
        >
          {isFlipped ? 'Show Front' : 'Flip'}
        </button>

        {/* Still Learning / Revisit Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onMarkRevisit}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[var(--color-marigold)]/35 hover:bg-[var(--color-marigold)]/55 border-2 border-[var(--color-marigold)] text-[var(--color-ink)] font-semibold hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
        >
          <RotateCcw className="w-4 h-4 text-amber-900" />
          <span>Still Learning</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/70 text-[10px] font-mono text-[var(--color-stone)] border border-amber-300">
            ←
          </span>
        </button>

        {/* Mastered / Got it Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onMarkMastered}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[var(--color-mint)]/35 hover:bg-[var(--color-mint)]/55 border-2 border-[var(--color-mint)] text-[var(--color-ink)] font-semibold hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
        >
          <Check className="w-4 h-4 text-emerald-900 stroke-[2.5]" />
          <span>Mastered</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/70 text-[10px] font-mono text-[var(--color-stone)] border border-emerald-300">
            →
          </span>
        </button>
      </div>

      {/* Keyboard helper text */}
      <div className="text-center mt-2 text-[11px] text-[var(--color-stone)] hidden sm:block font-medium">
        Press <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border border-[var(--color-ash)] text-[var(--color-graphite)]">Space</span> to flip • <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border border-[var(--color-ash)] text-[var(--color-graphite)]">←</span> Revisit • <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border border-[var(--color-ash)] text-[var(--color-graphite)]">→</span> Mastered
      </div>
    </div>
  );
};

export default RatingControls;
