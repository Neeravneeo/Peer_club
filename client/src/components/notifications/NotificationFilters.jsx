import React from 'react';

export function NotificationFilters({ activeFilter, onSelectFilter, counts = {} }) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: `Unread (${counts.unread || 0})` },
    { id: 'cheer', label: '👏 Cheers' },
    { id: 'room_activity', label: '👥 Study Circles' },
    { id: 'quiz_result', label: '🧠 Quizzes' },
    { id: 'streak', label: '🔥 Milestones' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8">
      {filters.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelectFilter(f.id)}
            className={`px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                : 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)] hover:border-gray-400 hover:bg-[var(--color-linen)]/40'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
