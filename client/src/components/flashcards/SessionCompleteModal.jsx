import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, RotateCcw, Clock, Brain, ArrowRight } from 'lucide-react';

/**
 * SessionCompleteModal Component
 * End of study session celebration and retention scorecard.
 */
export const SessionCompleteModal = ({
  isOpen = false,
  deckTitle = 'Flashcard Deck',
  masteredCount = 0,
  revisitCount = 0,
  totalCount = 0,
  onReviewMissed,
  onRestartDeck,
  onGenerateQuiz,
  onBackToDecks,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const totalReviewed = masteredCount + revisitCount;
  const effectiveTotal = totalReviewed > 0 ? totalReviewed : totalCount;
  const retentionPercentage =
    effectiveTotal > 0 ? Math.round((masteredCount / effectiveTotal) * 100) : 100;

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-[32px] shadow-[var(--shadow-xl)] p-6 sm:p-10 max-w-lg w-full relative overflow-hidden border border-[var(--color-ash)]">
        {/* Celebration Trophy */}
        <div className="w-20 h-20 rounded-full bg-[var(--color-mint)]/30 border border-[var(--color-mint)]/60 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Trophy className="w-10 h-10 text-emerald-800" />
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-serif text-[32px] sm:text-[36px] leading-[1.2] tracking-[-1px] text-[var(--color-ink)] text-center mb-2 font-normal">
          Session Complete! 🎉
        </h3>
        <p className="text-sm text-[var(--color-graphite)] text-center mb-6 font-sans">
          Great work on <span className="font-semibold text-[var(--color-ink)]">{deckTitle}</span>! Here's how you did:
        </p>

        {/* Retention Scorecard */}
        <div className="bg-[var(--color-linen)] rounded-[20px] p-6 mb-5 border border-[var(--color-ash)]/50">
          <div className="text-5xl sm:text-6xl font-bold text-[var(--color-ink)] text-center mb-1 font-serif">
            {retentionPercentage}%
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-stone)] text-center mb-4">
            Retention Rate
          </p>

          <div className="flex items-center justify-center gap-6 text-xs sm:text-sm font-semibold pt-2 border-t border-[var(--color-ash)]/60">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{masteredCount} Mastered</span>
            </div>
            <div className="w-px h-4 bg-[var(--color-stone)]/40" />
            <div className="flex items-center gap-2 text-red-600">
              <RotateCcw className="w-4 h-4 text-red-500" />
              <span>{revisitCount} to Revisit</span>
            </div>
          </div>
        </div>

        {/* Study Time Logged */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[var(--color-graphite)] mb-6 font-sans">
          <Clock className="w-4 h-4 text-[var(--color-azure)]" />
          <span>+15 minutes added to your study streak 🔥</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {revisitCount > 0 && (
            <button
              type="button"
              onClick={onReviewMissed}
              className="sm:col-span-2 bg-[var(--color-papaya)]/10 border-2 border-[var(--color-papaya)] text-[var(--color-papaya)] rounded-full py-3 text-sm font-semibold hover:bg-[var(--color-papaya)]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review {revisitCount} Missed Card{revisitCount > 1 ? 's' : ''}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestartDeck}
            className="bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] text-[var(--color-ink)] rounded-full py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-[var(--color-ash)]"
          >
            Restart Deck
          </button>

          <button
            type="button"
            onClick={onGenerateQuiz || (() => navigate('/quizzes'))}
            className="bg-[var(--color-periwinkle)]/35 hover:bg-[var(--color-periwinkle)]/55 border border-[var(--color-periwinkle)] text-indigo-950 rounded-full py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Brain className="w-4 h-4 text-indigo-800" />
            <span>Generate Quiz</span>
          </button>

          <button
            type="button"
            onClick={onBackToDecks || (() => navigate('/flashcards'))}
            className="sm:col-span-2 bg-[var(--color-ink)] text-white rounded-full py-3.5 text-sm font-semibold hover:shadow-md transition-all cursor-pointer"
          >
            Back to All Decks
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCompleteModal;
