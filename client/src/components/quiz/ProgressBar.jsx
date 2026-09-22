import React from 'react';

export function ProgressBar({ currentIndex, totalQuestions, answeredCount }) {
  const percentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-[var(--color-graphite)]">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-[var(--color-stone)]">
          {answeredCount} / {totalQuestions} Answered ({percentage}%)
        </span>
      </div>

      {/* Dashed line / pill style progress indicator */}
      <div className="flex items-center gap-1.5 w-full">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isPassed = idx < currentIndex;

          let barColor = 'bg-gray-200';
          if (isCurrent) barColor = 'bg-gray-900';
          else if (isPassed) barColor = 'bg-emerald-500';

          return (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${barColor}`}
            />
          );
        })}
      </div>
    </div>
  );
}
