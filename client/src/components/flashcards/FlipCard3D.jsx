import React, { useState, useRef } from 'react';
import { Sparkles, HelpCircle, RotateCw } from 'lucide-react';

/**
 * FlipCard3D Component
 * Interactive 3D flip card with front question, back answer, and touch swipe gestures.
 */
export const FlipCard3D = ({
  card = {},
  isFlipped = false,
  onFlip,
  onMarkMastered,
  onMarkRevisit,
}) => {
  const [showHint, setShowHint] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const subject = card?.subject || 'Mathematics / Calculus';
  const question = card?.front || card?.question || 'What is the Fundamental Theorem of Calculus?';
  const answer =
    card?.back ||
    card?.answer ||
    'If f is continuous on [a, b] and F is the antiderivative, then ∫[a to b] f(x)dx = F(b) - F(a).';
  const hint = card?.hint || 'Connects differentiation and integration';
  const highlight = card?.highlight || 'Core relationship linking rates of change and accumulation';
  const memoryTip = card?.memoryTip || 'Evaluate at endpoints and subtract!';

  // Mobile Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 75;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && onMarkRevisit) {
        // Swiped Left
        onMarkRevisit();
      } else if (diff < 0 && onMarkMastered) {
        // Swiped Right
        onMarkMastered();
      }
    }
  };

  return (
    <div
      className="relative w-full max-w-2xl mx-auto mb-8 perspective-1000 h-[400px] md:h-[480px] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Flippable 3D Card Inner */}
      <div
        onClick={onFlip}
        className={`relative w-full h-full transition-transform duration-500 ease-out transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ============================================================ */}
        {/* FRONT FACE                                                   */}
        {/* ============================================================ */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] backface-hidden flex flex-col items-center justify-between p-6 sm:p-10 md:p-12 hover:shadow-2xl transition-shadow">
          {/* Top: Subject Badge & Hint Icon */}
          <div className="w-full flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full bg-[var(--color-periwinkle)]/35 text-indigo-950 text-xs sm:text-sm font-semibold border border-[var(--color-periwinkle)] shadow-xs">
              {subject}
            </span>

            {hint && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint((p) => !p);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-marigold)]/30 hover:bg-[var(--color-marigold)]/50 text-[var(--color-ink)] text-xs font-medium border border-amber-300 transition-colors cursor-pointer"
                title="Toggle Hint"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
                <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
              </button>
            )}
          </div>

          {/* Center: Question Prompt */}
          <div className="my-auto px-2 sm:px-4 text-center">
            <h2 className="font-serif text-22px sm:text-[28px] md:text-[32px] leading-[1.3] tracking-[-0.5px] text-[var(--color-ink)] font-normal">
              {question}
            </h2>

            {showHint && hint && (
              <div className="mt-4 p-3 rounded-xl bg-[var(--color-marigold)]/20 border border-[var(--color-marigold)] text-xs sm:text-sm text-[var(--color-graphite)] animate-in fade-in zoom-in-95 duration-150">
                💡 <span className="font-semibold text-amber-950">Hint:</span> {hint}
              </div>
            )}
          </div>

          {/* Bottom: Flip Cue */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-stone)]">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click card or press Space to reveal answer</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BACK FACE                                                    */}
        {/* ============================================================ */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--color-mint)]/15 via-white to-[var(--color-periwinkle)]/15 rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] backface-hidden rotate-y-180 flex flex-col items-center justify-between p-6 sm:p-10 md:p-12">
          {/* Top Label */}
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-[var(--color-mint)]/30 px-3 py-1 rounded-full border border-[var(--color-mint)]/60">
              Answer & Concept
            </span>
            <span className="text-xs text-[var(--color-stone)] font-mono">
              Space / Click to Flip back
            </span>
          </div>

          {/* Center: Answer Text & Highlight */}
          <div className="my-auto px-2 text-center w-full max-w-xl">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[var(--color-ink)] mb-4 font-sans">
              {answer}
            </p>

            {highlight && (
              <div className="w-full bg-[var(--color-mint)]/30 border border-[var(--color-mint)]/70 rounded-[14px] p-3.5 text-xs sm:text-sm text-[var(--color-ink)] font-medium text-left flex items-start gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </div>
            )}
          </div>

          {/* Bottom: Memory Tip */}
          {memoryTip && (
            <div className="text-xs sm:text-sm text-[var(--color-graphite)] italic text-center">
              📌 <span className="font-semibold not-italic">Remember:</span> {memoryTip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCard3D;
