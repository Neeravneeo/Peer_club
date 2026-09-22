import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { triggerStreakActivity } from '@/components/StreakCard';

// Components
import { DotGridPattern, PastelBlob } from '@/components/DecorativeElements';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { Timer } from '@/components/quiz/Timer';
import { SAMPLE_QUIZZES } from '@/components/quiz/sampleQuizzesData';

export function TakeQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes default
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Fetch Quiz Details & Questions
  const { data: quizData, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      try {
        const res = await api.get(`/quiz/${quizId}`);
        if (res?.data?.quiz) {
          return {
            id: res.data.quiz.id,
            title: res.data.quiz.title || (res.data.quiz.document?.name ? `${res.data.quiz.document.name} Quiz` : 'Interactive Quiz'),
            questions: res.data.quiz.questions || [],
            sourceDoc: res.data.quiz.document?.name,
          };
        }
      } catch (err) {
        console.warn('API error fetching quiz:', err);
      }
      return null;
    },
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const questions = quizData?.questions || [];
      const formattedAnswers = questions.map((q) => {
        const ans = answers[q.id];
        return {
          questionId: q.id,
          selectedOptionIndex: ans?.selectedOptionIndex ?? null,
          answerText: ans?.answerText ?? null,
        };
      });

      const timeTaken = 600 - secondsRemaining;

      try {
        const res = await api.post(`/quiz/${quizId}/attempts`, {
          answers: formattedAnswers,
          timeTakenSeconds: timeTaken,
        });
        return res.data;
      } catch (err) {
        // Fallback for demo / offline mode: compute client-side score
        let correctCount = 0;
        const answerResults = questions.map((q) => {
          const userSelected = answers[q.id]?.selectedOptionIndex;
          const isCorrect = userSelected !== undefined && userSelected === q.correctIndex;
          if (isCorrect) correctCount++;
          return {
            questionId: q.id,
            selectedOptionIndex: userSelected ?? null,
            isCorrect,
            explanation: q.explanation,
            sourceNoteSnippet: q.sourceNoteSnippet,
          };
        });

        const total = questions.length || 1;
        const percentage = Math.round((correctCount / total) * 100);

        return {
          score: correctCount,
          totalQuestions: total,
          percentage,
          timeTakenSeconds: timeTaken,
          answers: answerResults,
          quizTitle: quizData?.title || 'Interactive Quiz',
          questions: questions,
        };
      }
    },
    onSuccess: (result) => {
      // Sync streak tracking
      triggerStreakActivity('quiz');

      toast.success('Quiz submitted successfully!');
      navigate(`/quiz/${quizId}/results`, {
        state: {
          result: {
            ...result,
            quizTitle: quizData?.title,
            questions: quizData?.questions,
          },
        },
      });
    },
    onError: (err) => {
      toast.error('Failed to submit attempt. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-mono text-[var(--color-stone)]">Loading questions...</p>
        </div>
      </div>
    );
  }

  const questions = quizData?.questions || [];

  if (!isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] border border-[var(--color-ash)] p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[var(--color-ink)]">Quiz Unavailable</h3>
          <p className="text-xs text-[var(--color-stone)]">
            This quiz does not contain any questions or could not be loaded.
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCurrentFlagged = currentQuestion && flaggedQuestions.has(currentQuestion.id);

  const handleSelectOption = (optIndex) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selectedOptionIndex: optIndex },
    }));
  };

  const handleTextAnswer = (text) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { answerText: text },
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      submitMutation.mutate();
    }
  };

  const handleExitConfirm = () => {
    navigate('/quizzes');
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] relative p-4 sm:p-6 md:p-10 flex flex-col justify-between selection:bg-lime-200 overflow-x-hidden w-full max-w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-40" />
        <PastelBlob color="#fde99b" className="w-80 h-80 -top-10 -left-10" opacity={0.12} />
        <PastelBlob color="#9bd8a9" className="w-80 h-80 top-1/2 -right-10" opacity={0.12} />
      </div>

      {/* TOP SESSION BAR */}
      <header className="max-w-3xl mx-auto w-full mb-8 relative z-10">
        <div className="flex items-center justify-between gap-4 mb-5">
          {/* Exit Button + Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const unanswered = questions.length - answeredCount;
                if (unanswered > 0) {
                  setIsExitModalOpen(true);
                } else {
                  navigate('/quizzes');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--color-ash)] text-xs font-semibold text-[var(--color-graphite)] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Quiz</span>
            </button>
            <h1 className="font-serif text-lg md:text-xl font-normal text-[var(--color-ink)] truncate max-w-xs md:max-w-md">
              {quizData?.title}
            </h1>
          </div>

          {/* Live Countdown Timer */}
          <Timer seconds={secondsRemaining} isCountdown />
        </div>

        {/* Question Progress Bar */}
        <ProgressBar
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          answeredCount={answeredCount}
        />
      </header>

      {/* MAIN QUESTION CARD */}
      <main className="max-w-3xl mx-auto w-full relative z-10 my-auto">
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion?.id]}
          onSelectOption={handleSelectOption}
          onTextAnswer={handleTextAnswer}
          isFlagged={isCurrentFlagged}
          onToggleFlag={handleToggleFlag}
        />
      </main>

      {/* BOTTOM ACTION BAR */}
      <footer className="max-w-3xl mx-auto w-full mt-8 relative z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-ash)] bg-white text-sm font-semibold text-[var(--color-graphite)] hover:bg-[var(--color-linen)]/40 hover:border-gray-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Center Question Navigator Dots */}
          <div className="hidden md:flex items-center gap-1.5">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flaggedQuestions.has(q.id);

              let pillStyle = 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)]';
              if (isCurrent) {
                pillStyle = 'bg-gray-900 border-gray-900 text-white font-bold shadow-xs';
              } else if (isFlagged) {
                pillStyle = 'bg-amber-100 border-amber-300 text-amber-800';
              } else if (isAnswered) {
                pillStyle = 'bg-emerald-100 border-emerald-300 text-emerald-800';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-full border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${pillStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Next or Submit Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={submitMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-gray-950 text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : isLastQuestion ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Submit Quiz ✓</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {isExitModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] border border-[var(--color-ash)] shadow-2xl p-6 md:p-8 max-w-md w-full space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[var(--color-ink)]">
              Exit this quiz session?
            </h3>
            <p className="text-xs text-[var(--color-stone)] leading-relaxed">
              You still have {questions.length - answeredCount} unanswered questions. Your current progress will not be submitted.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsExitModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[var(--color-ash)] text-xs font-semibold text-[var(--color-graphite)] hover:bg-[var(--color-linen)]"
              >
                Continue Quiz
              </button>
              <button
                type="button"
                onClick={handleExitConfirm}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeQuizPage;
