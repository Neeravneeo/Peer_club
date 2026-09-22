import React from 'react';
import { Check } from 'lucide-react';

export function OptionButton({
  letter,
  text,
  isSelected,
  onClick,
  disabled = false,
  status = 'default', // 'default' | 'correct' | 'incorrect'
}) {
  let containerClasses =
    'border-2 border-[var(--color-ash)] bg-white hover:border-gray-900 hover:bg-[var(--color-linen)]/30 hover:-translate-y-0.5 text-[var(--color-ink)]';
  let badgeClasses =
    'border-2 border-[var(--color-ash)] bg-white text-[var(--color-graphite)] group-hover:border-gray-900 group-hover:text-gray-900';

  if (isSelected && status === 'default') {
    containerClasses =
      'border-gray-900 bg-gray-50 shadow-sm -translate-y-0.5 text-[var(--color-ink)]';
    badgeClasses = 'border-gray-900 bg-gray-900 text-white';
  } else if (status === 'correct') {
    containerClasses =
      'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium shadow-xs';
    badgeClasses = 'border-emerald-600 bg-emerald-600 text-white';
  } else if (status === 'incorrect') {
    containerClasses =
      'border-rose-400 bg-rose-50/70 text-rose-950 line-through opacity-80';
    badgeClasses = 'border-rose-500 bg-rose-500 text-white';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-start gap-4 p-4 md:p-5 rounded-[20px] transition-all duration-200 cursor-pointer text-left group ${containerClasses}`}
    >
      {/* Letter Circular Badge */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${badgeClasses}`}
      >
        {letter}
      </div>

      {/* Option Text */}
      <div className="flex-1 text-[15px] md:text-base leading-relaxed pt-2">
        {text}
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="flex-shrink-0 pt-2.5">
          <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
      )}
    </button>
  );
}
