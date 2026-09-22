import React from 'react';
import { Search } from 'lucide-react';

export function FilterTabs({
  timeframe,
  setTimeframe,
  category,
  setCategory,
  searchQuery,
  setSearchQuery,
}) {
  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all-time', label: 'All-Time' },
  ];

  const categories = [
    'Global',
    'Biology 101',
    'CS Algorithms',
    'Mathematics',
    'Medicine',
    'History',
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      {/* Timeframe & Category Chips */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Timeframe Pill Switcher */}
        <div className="flex items-center gap-1 bg-white rounded-full p-1 border border-[var(--color-ash)] shadow-xs">
          {timeframes.map((tf) => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => setTimeframe(tf.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-mint)]/40 text-[var(--color-ink)] border border-[var(--color-mint)] shadow-xs font-bold'
                    : 'text-[var(--color-stone)] hover:text-[var(--color-graphite)]'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                    : 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)] hover:border-gray-400 hover:bg-[var(--color-linen)]/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find peer or buddy..."
          className="w-full h-10 pl-9 pr-4 rounded-full bg-white border border-[var(--color-ash)] shadow-xs text-xs text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-gray-900 transition-all"
        />
      </div>
    </div>
  );
}
