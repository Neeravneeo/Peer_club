import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Award, ArrowRight } from 'lucide-react';

/**
 * QuizCard in Craft Docs Scrapbook Style
 */
export const QuizCardComponent = ({ quiz, onTakeQuiz }) => {
  const title = quiz?.title || 'Interactive Knowledge Quiz';
  const score = quiz?.score ?? quiz?.attempts?.[0]?.score;
  const questionsCount = quiz?.questions?.length || quiz?._count?.questions || quiz?.totalQuestions || 5;

  // Score Badge Styling
  let badgeStyle = 'bg-linen text-graphite border-ash';
  let badgeLabel = 'Unattempted';

  if (score !== undefined && score !== null) {
    if (score >= 70) {
      badgeStyle = 'bg-mint/30 text-emerald-950 border-mint/50';
      badgeLabel = `${score}% Score`;
    } else if (score >= 50) {
      badgeStyle = 'bg-marigold/35 text-amber-950 border-marigold/50';
      badgeLabel = `${score}% Score`;
    } else {
      badgeStyle = 'bg-papaya/15 text-orange-950 border-papaya/30';
      badgeLabel = `${score}% Score`;
    }
  }

  const quizId = quiz?.id;

  return (
    <div className="group relative bg-white rounded-[18px] p-5 border border-ash/60 shadow-craft-subtle hover:shadow-craft-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon & Quiz Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-linen border border-ash/60 flex items-center justify-center shrink-0 text-graphite group-hover:bg-periwinkle/30 group-hover:text-indigo-950 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-semibold text-ink truncate font-sans max-w-[200px] sm:max-w-xs">
              {title}
            </h4>
            <p className="text-[12px] text-stone font-medium mt-0.5 font-sans">
              {questionsCount} Questions • AI Generated
            </p>
          </div>
        </div>

        {/* Right: Score Badge & Take Quiz Button */}
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[12px] font-semibold px-3 py-1 rounded-craft-pill border ${badgeStyle}`}>
            {badgeLabel}
          </span>

          <Link
            to={quizId ? `/quiz/${quizId}` : '/quizzes'}
            className="inline-flex items-center gap-1.5 bg-ink text-white rounded-craft-pill px-4 py-1.5 text-[12px] font-semibold hover:bg-graphite transition-colors shadow-xs"
          >
            <span>Take Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const QuizCard = React.memo(QuizCardComponent);
export default QuizCard;
