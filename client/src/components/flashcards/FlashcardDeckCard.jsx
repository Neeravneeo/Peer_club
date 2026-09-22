import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Pencil, Trash2, Layers } from 'lucide-react';

/**
 * Maps subject to vibrant pastel gradient for header
 */
export const getSubjectGradient = (subject = '') => {
  const s = subject.toLowerCase();
  if (s.includes('computer') || s.includes('algo') || s.includes('code')) {
    return 'bg-gradient-to-br from-[#b8caf5]/60 to-[#a8d8ea]/60';
  }
  if (s.includes('chem') || s.includes('organic')) {
    return 'bg-gradient-to-br from-[#9bd8a9]/60 to-[#fde99b]/60';
  }
  if (s.includes('math') || s.includes('calculus')) {
    return 'bg-gradient-to-br from-[#ffd3b6]/60 to-[#ff9a8b]/60';
  }
  if (s.includes('history') || s.includes('humanities')) {
    return 'bg-gradient-to-br from-[#d4b8f0]/60 to-[#b8caf5]/60';
  }
  if (s.includes('bio') || s.includes('cell')) {
    return 'bg-gradient-to-br from-[#9bd8a9]/60 to-[#a8d8ea]/60';
  }
  if (s.includes('physics') || s.includes('quantum')) {
    return 'bg-gradient-to-br from-[#b8caf5]/60 to-[#d4b8f0]/60';
  }
  return 'bg-gradient-to-br from-[var(--color-mint)]/40 to-[var(--color-periwinkle)]/40';
};

/**
 * FlashcardDeckCard Component
 * Displays a colorful, tactile deck card in the deck grid.
 */
export const FlashcardDeckCard = ({
  deck = {},
  onStudy,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const title = deck.title || 'Untitled Flashcard Deck';
  const subject = deck.subject || 'General Studies';
  const cardCount = deck.cards?.length || deck.cardCount || 10;
  const knownCount = deck.knownCount || 0;
  const masteryPercentage =
    deck.masteryPercentage !== undefined
      ? deck.masteryPercentage
      : cardCount > 0
      ? Math.round((knownCount / cardCount) * 100)
      : 0;
  const lastStudied = deck.lastStudied || '2 days ago';

  const gradientClass = getSubjectGradient(subject);

  const handleCardClick = () => {
    if (onStudy) {
      onStudy(deck);
    } else {
      navigate(`/flashcards/${deck.id}/study`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] overflow-hidden hover:shadow-2xl transition-all group cursor-pointer min-h-[320px] flex flex-col select-none"
    >
      {/* 1. Header (Color-coded by subject gradient) */}
      <div className={`${gradientClass} p-6 pb-4 relative transition-colors`}>
        {/* Hover Overlay Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deck);
              }}
              title="Edit Deck"
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[var(--color-linen)] text-[var(--color-graphite)] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deck);
              }}
              title="Delete Deck"
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Subject Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-semibold text-[var(--color-ink)] mb-3 shadow-xs border border-white/40">
          {subject}
        </span>

        {/* Card Count */}
        <div className="flex items-center justify-between text-xs text-[var(--color-graphite)] font-medium">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[var(--color-graphite)]" />
            <span>{cardCount} Cards</span>
          </span>
          <span className="font-semibold text-emerald-950 font-mono">
            {masteryPercentage}%
          </span>
        </div>
      </div>

      {/* 2. Body Details */}
      <div className="p-6 pb-3 flex-1 flex flex-col justify-between">
        <h3 className="font-serif text-lg sm:text-xl font-normal text-[var(--color-ink)] mb-3 line-clamp-2 leading-tight group-hover:text-black transition-colors">
          {title}
        </h3>

        {/* 3. Progress Section */}
        <div>
          <div className="w-full h-2 bg-[var(--color-linen)] rounded-full overflow-hidden mb-1.5 border border-[var(--color-ash)]/40">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-mint)] to-[var(--color-marigold)] rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--color-graphite)] font-sans">
            <span>Progress</span>
            <span>
              {masteryPercentage}% Mastered ({Math.round((masteryPercentage / 100) * cardCount)}/{cardCount})
            </span>
          </div>
        </div>

        {/* 4. Last Studied Meta */}
        <div className="pt-3 text-xs text-[var(--color-stone)] flex items-center gap-1.5 font-sans">
          <Clock className="w-3.5 h-3.5" />
          <span>Last studied {lastStudied}</span>
        </div>
      </div>

      {/* 5. Footer (Study Button) */}
      <div className="px-6 pb-6 pt-1">
        <button
          type="button"
          onClick={handleCardClick}
          className="w-full bg-[var(--color-ink)] text-white rounded-full py-3 text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] cursor-pointer active:scale-98"
        >
          <Play className="w-4 h-4 fill-current text-[var(--color-mint)]" />
          <span>Study Deck ▶</span>
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeckCard;
