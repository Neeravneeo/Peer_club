import React from 'react';
import { FlashcardDeckCard } from './FlashcardDeckCard';
import { Layers, Plus } from 'lucide-react';

/**
 * DeckGrid Component
 * Responsive 3-col grid displaying flashcard decks or empty state.
 */
export const DeckGrid = ({
  decks = [],
  onStudyDeck,
  onEditDeck,
  onDeleteDeck,
  onCreateDeckClick,
}) => {
  if (decks.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-[32px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] max-w-lg mx-auto select-none animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-full bg-[var(--color-periwinkle)]/30 border border-[var(--color-periwinkle)]/60 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-10 h-10 text-indigo-900" />
        </div>
        <h3 className="font-serif text-2xl text-[var(--color-ink)] mb-2 font-normal">
          No Flashcard Decks Found
        </h3>
        <p className="text-sm text-[var(--color-graphite)] max-w-sm mx-auto mb-6 leading-relaxed">
          Create custom flashcards or auto-extract active recall question decks directly from your uploaded study notes.
        </p>
        {onCreateDeckClick && (
          <button
            type="button"
            onClick={onCreateDeckClick}
            className="bg-[var(--color-ink)] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[var(--color-mint)]" />
            <span>Create First Deck</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <FlashcardDeckCard
          key={deck.id}
          deck={deck}
          onStudy={onStudyDeck}
          onEdit={onEditDeck}
          onDelete={onDeleteDeck}
        />
      ))}
    </div>
  );
};

export default DeckGrid;
