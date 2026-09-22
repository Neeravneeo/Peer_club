import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar component for documents filtering
 */
export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search documents...',
  className = '',
}) => {
  return (
    <div className={`w-full max-w-2xl ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-[var(--color-stone)] pointer-events-none" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-10 rounded-[14px] bg-white border border-[var(--color-ash)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-[var(--color-azure)] focus:ring-2 focus:ring-[var(--color-azure)]/20 shadow-xs transition-all"
        />

        {value && (
          <button
            onClick={() => onClear ? onClear() : onChange?.('')}
            className="absolute right-3.5 p-1 rounded-full text-[var(--color-stone)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
