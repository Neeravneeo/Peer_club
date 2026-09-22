import React from 'react';
import { Check, X, Lightbulb, Clock } from 'lucide-react';

export function ResultsBreakdown({ questions, answers }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-[24px] text-[var(--color-ink)] font-normal tracking-[-0.6px]">
        Detailed Question Breakdown
      </h3>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAns = answers?.find((a) => a.questionId === q.id) || answers?.[idx];
          const isCorrect = Boolean(userAns?.isCorrect);
          const isSkipped = userAns?.selectedOptionIndex === null || userAns?.selectedOptionIndex === undefined;

          // Border & background based on correctness
          let cardBorder = 'border-emerald-300 bg-emerald-50/20';
          let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let badgeIcon = <Check className="w-3.5 h-3.5" />;
          let badgeText = 'Correct';

          if (isSkipped) {
            cardBorder = 'border-gray-300 bg-gray-50/30';
            badgeClass = 'bg-gray-100 text-gray-700 border-gray-300';
            badgeIcon = null;
            badgeText = 'Skipped';
          } else if (!isCorrect) {
            cardBorder = 'border-rose-300 bg-rose-50/20';
            badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
            badgeIcon = <X className="w-3.5 h-3.5" />;
            badgeText = 'Incorrect';
          }

          return (
            <div
              key={q.id || idx}
              className={`bg-white rounded-[24px] border-2 p-6 md:p-8 transition-all ${cardBorder}`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)]">
                  Question {(idx + 1).toString().padStart(2, '0')}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                    {badgeIcon}
                    <span>{badgeText}</span>
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <p className="font-serif text-[18px] md:text-[20px] text-[var(--color-ink)] leading-snug mb-4">
                {q.questionText}
              </p>

              {/* Options list showing user selection vs correct answer */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userAns?.selectedOptionIndex === optIdx;
                    const isCorrectAnswer = q.correctIndex === optIdx;

                    let optStyle = 'bg-[var(--color-linen)]/30 border border-transparent text-[var(--color-graphite)]';
                    let optIcon = null;

                    if (isCorrectAnswer) {
                      optStyle = 'bg-emerald-100 border border-emerald-400 text-emerald-950 font-medium';
                      optIcon = <Check className="w-4 h-4 text-emerald-700 ml-auto flex-shrink-0" />;
                    } else if (isUserChoice && !isCorrect) {
                      optStyle = 'bg-rose-100 border border-rose-400 text-rose-950';
                      optIcon = <X className="w-4 h-4 text-rose-700 ml-auto flex-shrink-0" />;
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-3 p-3.5 rounded-[14px] text-sm transition-all ${optStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white/80 border border-black/10 flex items-center justify-center text-xs font-bold text-[var(--color-ink)] flex-shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isUserChoice && (
                          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/80 text-[var(--color-graphite)]">
                            Your Choice
                          </span>
                        )}
                        {optIcon}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* AI Explanation Box */}
              {(q.explanation || userAns?.explanation) && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-[18px] p-4 md:p-5 mt-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Why this is correct:</span>
                  </div>
                  <p className="text-sm text-amber-950 leading-relaxed">
                    {q.explanation || userAns?.explanation}
                  </p>
                  {(q.sourceConcept || q.sourcePage !== undefined || q.sourceNoteSnippet || userAns?.sourceNoteSnippet) && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex flex-wrap items-center gap-2 text-xs text-amber-900/80 font-sans">
                      {q.sourceConcept && (
                        <span className="bg-amber-100/80 border border-amber-300/70 px-2 py-0.5 rounded-md font-medium">
                          Concept: {q.sourceConcept}
                        </span>
                      )}
                      {q.sourcePage !== null && q.sourcePage !== undefined && (
                        <span className="bg-amber-100/80 border border-amber-300/70 px-2 py-0.5 rounded-md font-medium">
                          Page {q.sourcePage}
                        </span>
                      )}
                      {(q.sourceNoteSnippet || userAns?.sourceNoteSnippet) && (
                        <span className="italic">
                          {q.sourceNoteSnippet || userAns?.sourceNoteSnippet}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
