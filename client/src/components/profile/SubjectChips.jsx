import React from 'react';
import { Check } from 'lucide-react';

export const ALL_SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Psychology',
  'Medicine',
  'Law',
];

/**
 * SubjectChips Component
 * Multi-select chips for academic & study subjects.
 */
export const SubjectChips = ({
  selectedSubjects = [],
  onToggleSubject,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-graphite)] font-sans">
        Subjects of Interest
      </label>
      <div className="flex flex-wrap gap-2">
        {ALL_SUBJECTS.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              onClick={() => onToggleSubject(subject)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-[var(--color-mint)]/30 border-[var(--color-mint)] text-[var(--color-ink)] shadow-xs font-semibold'
                  : 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)] hover:border-[var(--color-mint)]/50 hover:bg-[var(--color-linen)]/50'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0" />}
              <span>{subject}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectChips;
