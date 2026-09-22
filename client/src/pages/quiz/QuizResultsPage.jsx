import React from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  CheckCircle2,
  Star,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

// Components
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  DotGridPattern,
  PastelBlob,
  TornPaperBackdrop,
} from '@/components/DecorativeElements';
import { ResultsBreakdown } from '@/components/quiz/ResultsBreakdown';

export function QuizResultsPage() {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve results passed via navigation state
  const result = location.state?.result;

  const score = result?.score ?? 0;
  const totalQuestions = result?.totalQuestions ?? (result?.questions?.length || 1);
  const percentage = result?.percentage ?? (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);
  const timeTakenSeconds = result?.timeTakenSeconds ?? 0;

  const quizTitle = result?.quizTitle || 'Quiz Results';
  const questions = result?.questions || [];
  const answers = result?.answers || [];

  const incorrectCount = totalQuestions - score;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const handleCreateFlashcards = () => {
    toast.success(`Created flashcard deck from ${incorrectCount || 2} missed questions!`);
    navigate('/flashcards');
  };

  const handleRetake = () => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] relative pb-24 selection:bg-lime-200 overflow-x-hidden w-full max-w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-40" />
        <PastelBlob color="#9bd8a9" className="w-96 h-96 -top-10 -left-10" opacity={0.12} />
        <PastelBlob color="#fde99b" className="w-96 h-96 top-1/2 -right-10" opacity={0.12} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-12 max-w-4xl w-full min-w-0 space-y-10">
          {/* CELEBRATION HERO CARD */}
          <section className="bg-white rounded-[32px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center relative overflow-hidden">
          <TornPaperBackdrop color="bg-emerald-100/40" />

          {/* Icon Trophy */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-700 shadow-xs">
            <Trophy className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--color-ink)] mb-2 font-normal tracking-[-1px]">
            Quiz Completed! 🎉
          </h1>
          <p className="text-sm md:text-base text-[var(--color-graphite)] mb-6 max-w-md mx-auto">
            You scored {score}/{totalQuestions} on <span className="font-medium text-[var(--color-ink)]">{quizTitle}</span>
          </p>

          {/* Large Percentage */}
          <div className="font-sans text-6xl sm:text-7xl font-extrabold text-[var(--color-ink)] tracking-tight mb-2">
            {percentage}%
          </div>

          {/* Praise Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{percentage >= 80 ? 'Excellent Mastery!' : percentage >= 60 ? 'Good Effort!' : 'Keep Practicing!'}</span>
          </div>

          {/* 3 Metric Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            {/* Time */}
            <div className="bg-[var(--color-linen)]/60 rounded-[20px] p-4 text-center border border-[var(--color-ash)]/50">
              <Clock className="w-4 h-4 text-emerald-600 mx-auto mb-1.5" />
              <div className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                {formatTime(timeTakenSeconds)}
              </div>
              <div className="text-[11px] font-medium text-[var(--color-stone)] uppercase tracking-wider">
                Time Spent
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-[var(--color-linen)]/60 rounded-[20px] p-4 text-center border border-[var(--color-ash)]/50">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto mb-1.5" />
              <div className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                {score} Correct
              </div>
              <div className="text-[11px] font-medium text-[var(--color-stone)] uppercase tracking-wider">
                Accuracy
              </div>
            </div>

            {/* XP Points */}
            <div className="bg-[var(--color-linen)]/60 rounded-[20px] p-4 text-center border border-[var(--color-ash)]/50">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 mx-auto mb-1.5" />
              <div className="text-base sm:text-lg font-bold text-[var(--color-ink)]">
                +{score * 5} XP
              </div>
              <div className="text-[11px] font-medium text-[var(--color-stone)] uppercase tracking-wider">
                Study Points
              </div>
            </div>
          </div>

          {/* ACTION TOOLBELT */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Create Flashcards */}
            <button
              type="button"
              onClick={handleCreateFlashcards}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors shadow-xs"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>🃏 Create Flashcards from {incorrectCount > 0 ? `${incorrectCount} Mistakes` : 'Review'}</span>
            </button>

            {/* Retake */}
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[var(--color-ash)] text-[var(--color-ink)] text-xs font-bold hover:bg-[var(--color-linen)] transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-[var(--color-graphite)]" />
              <span>🔄 Retake Quiz</span>
            </button>

            {/* Back to Hub */}
            <Link
              to="/quizzes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-bold hover:shadow-md transition-all shadow-xs"
            >
              <span>📑 All Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* DETAILED SOLUTION BREAKDOWN */}
        <section>
          <ResultsBreakdown questions={questions} answers={answers} />
        </section>
      </main>
      </div>
    </div>
  );
}

export default QuizResultsPage;
