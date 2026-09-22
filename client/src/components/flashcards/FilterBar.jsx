import React from 'react';
import { Search, Sparkles, Plus, X } from 'lucide-react';

export const FILTER_CHIPS = [
  'All Decks',
  'Computer Science',
  'Biochemistry',
  'Mathematics',
  'History',
  'Needs Review',
];

/**
 * FilterBar Component
 * Search input, subject filter chips, and creation buttons.
 */
export const FilterBar = ({
  searchQuery = '',
  onSearchChange,
  activeFilter = 'All Decks',
  onSelectFilter,
  onGenerateFromDoc,
  onNewCustomDeck,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 select-none">
      {/* Left: Search Input + Filter Chips */}
      <div className="w-full md:flex-1 space-y-3 max-w-2xl">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-stone)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search flashcard decks by title or concept..."
            className="w-full h-11 pl-11 pr-9 rounded-full bg-white border border-[var(--color-ash)] shadow-xs text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--color-stone)] hover:text-[var(--color-ink)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onSelectFilter?.(chip)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[var(--color-mint)]/35 border-[var(--color-mint)] text-[var(--color-ink)] font-semibold shadow-xs'
                    : 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)] hover:border-[var(--color-mint)]/60 hover:bg-[var(--color-linen)]/60'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 shrink-0 self-start md:self-auto">
        <button
          type="button"
          onClick={onGenerateFromDoc}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[var(--color-periwinkle)]/35 hover:bg-[var(--color-periwinkle)]/55 text-indigo-950 text-xs sm:text-sm font-semibold transition-colors border border-[var(--color-periwinkle)] shadow-xs cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-indigo-800" />
          <span>+ Generate from Doc</span>
        </button>

        <button
          type="button"
          onClick={onNewCustomDeck}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-xs sm:text-sm font-semibold hover:shadow-md transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[var(--color-mint)]" />
          <span>+ New Custom Deck</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
