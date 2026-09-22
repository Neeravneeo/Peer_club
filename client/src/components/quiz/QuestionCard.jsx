import React from 'react';
import { Bookmark } from 'lucide-react';
import { OptionButton } from './OptionButton';

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  onTextAnswer,
  isFlagged,
  onToggleFlag,
}) {
  if (!question) return null;

  const isMCQ = !question.questionType || question.questionType === 'mcq';
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="relative bg-white rounded-[32px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-12 transition-all">
      {/* Question Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[var(--color-linen)] text-xs font-bold tracking-wider text-[var(--color-graphite)] uppercase">
            Question {questionNumber.toString().padStart(2, '0')}
          </span>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
            {isMCQ ? 'Multiple Choice' : 'Short Answer'}
          </span>
        </div>

        {/* Flag for Review */}
        <button
          type="button"
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            isFlagged
              ? 'bg-amber-50 border border-amber-300 text-amber-800'
              : 'text-[var(--color-stone)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)]'
          }`}
          title="Flag question to review before submitting"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
          <span>{isFlagged ? 'Flagged' : 'Flag for review'}</span>
        </button>
      </div>

      {/* Question Stem */}
      <h2 className="font-serif text-[22px] md:text-[28px] leading-[1.35] tracking-[-0.5px] text-[var(--color-ink)] font-normal mb-8">
        {question.questionText}
      </h2>

      {/* Options Container */}
      {isMCQ ? (
        <div className="space-y-3">
          {question.options?.map((option, idx) => {
            const letter = letters[idx] || String(idx + 1);
            const isSelected = selectedAnswer?.selectedOptionIndex === idx;

            return (
              <OptionButton
                key={idx}
                letter={letter}
                text={option}
                isSelected={isSelected}
                onClick={() => onSelectOption(idx)}
              />
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider">
            Your Written Answer:
          </label>
          <textarea
            rows={4}
            value={selectedAnswer?.answerText || ''}
            onChange={(e) => onTextAnswer(e.target.value)}
            placeholder="Type your explanation or concise answer here..."
            className="w-full p-4 rounded-[20px] border-2 border-[var(--color-ash)] bg-white text-base focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
      )}

      {/* Decorative torn paper accent in bottom right */}
      <div className="absolute -bottom-2 right-8 w-24 h-4 bg-gradient-to-r from-emerald-100 to-lime-100 rounded-full blur-xs opacity-50 pointer-events-none -z-10" />
    </div>
  );
}
