import React from 'react';
import { Play, RotateCcw, Trash2, FileText, Trophy, Clock, Sparkles } from 'lucide-react';

export function QuizCard({ quiz, onStart, onRetake, onDelete }) {
  const isMedium = quiz.difficulty?.toLowerCase() === 'medium';
  const isHard = quiz.difficulty?.toLowerCase() === 'hard';
  const isEasy = quiz.difficulty?.toLowerCase() === 'easy';

  // Gradient header by difficulty
  let headerGradient = 'from-emerald-50 to-emerald-100/50';
  let badgeClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let difficultyLabel = 'Easy';

  if (isMedium) {
    headerGradient = 'from-amber-50 to-amber-100/50';
    badgeClasses = 'bg-amber-100 text-amber-800 border-amber-200';
    difficultyLabel = 'Medium';
  } else if (isHard) {
    headerGradient = 'from-rose-50 to-rose-100/50';
    badgeClasses = 'bg-rose-100 text-rose-800 border-rose-200';
    difficultyLabel = 'Hard';
  }

  const hasScore = quiz.bestScore !== null && quiz.bestScore !== undefined;

  return (
    <div className="relative bg-white rounded-[24px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
      {/* Top Header with Difficulty Gradient */}
      <div className={`p-6 pb-4 bg-gradient-to-br ${headerGradient} border-b border-[var(--color-ash)]/40 relative`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 shadow-xs border border-white text-xs font-semibold text-[var(--color-ink)]">
              <span>{quiz.icon || '📝'}</span>
              <span>{quiz.subject || 'General Studies'}</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}>
              {difficultyLabel}
            </span>
          </div>

          {/* Hover Actions */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onRetake && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetake(quiz);
                }}
                className="w-8 h-8 rounded-full bg-white shadow-md border border-[var(--color-ash)]/60 flex items-center justify-center text-[var(--color-graphite)] hover:text-[var(--color-ink)] hover:bg-[var(--color-linen)] transition-colors"
                title="Retake Quiz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(quiz);
                }}
                className="w-8 h-8 rounded-full bg-white shadow-md border border-[var(--color-ash)]/60 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Quiz"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[21px] leading-[1.3] text-[var(--color-ink)] font-normal group-hover:text-emerald-900 transition-colors line-clamp-2">
          {quiz.title}
        </h3>
      </div>

      {/* Meta details & source */}
      <div className="p-6 py-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-xs text-[var(--color-stone)] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{quiz.questionCount || 10} Questions</span>
            <span>•</span>
            <span>~{quiz.estimatedMinutes || 15} mins</span>
          </div>

          {quiz.sourceDoc && (
            <div className="text-xs text-[var(--color-stone)] flex items-center gap-1.5 font-sans truncate">
              <FileText className="w-3.5 h-3.5 text-[var(--color-azure)] flex-shrink-0" />
              <span className="truncate">From {quiz.sourceDoc}</span>
            </div>
          )}
        </div>

        {/* Best Score Indicator */}
        <div className="pt-2">
          {hasScore ? (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                Best: {quiz.bestScore}%
              </span>
              {quiz.lastAttemptDate && (
                <span className="text-[11px] text-[var(--color-stone)]">
                  {quiz.lastAttemptDate}
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-blue-500" />
              New Quiz
            </span>
          )}
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="p-6 pt-0">
        <button
          type="button"
          onClick={() => onStart(quiz)}
          className="w-full bg-[var(--color-ink)] text-white rounded-full py-3 text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.99]"
        >
          <Play className="w-4 h-4 fill-current text-lime-400" />
          <span>{hasScore ? 'Review & Practice ▶' : 'Start Quiz ▶'}</span>
        </button>
      </div>
    </div>
  );
}
