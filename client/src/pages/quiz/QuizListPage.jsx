import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TrendingUp,
  CheckCircle2,
  Flame,
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

// Components
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  DotGridPattern,
  PastelBlob,
  TornPaperBackdrop,
  HandDrawnUnderline,
} from '@/components/DecorativeElements';
import { QuizCard } from '@/components/quiz/QuizCard';
import { GenerationModal } from '@/components/quiz/GenerationModal';
import { SAMPLE_QUIZZES } from '@/components/quiz/sampleQuizzesData';

export function QuizListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Fetch quizzes from API
  const { data: serverQuizzes, isLoading } = useQuery({
    queryKey: ['quizzes', user?.id],
    queryFn: async () => {
      try {
        const res = await api.get('/quiz');
        return res.data?.quizzes || [];
      } catch (err) {
        console.warn('Failed to fetch quizzes from server, falling back to local samples', err);
        return [];
      }
    },
  });

  // Only render user-generated quizzes
  const allQuizzes = useMemo(() => {
    if (!serverQuizzes || serverQuizzes.length === 0) {
      return [];
    }

    // Map server quizzes to UI format
    return serverQuizzes.map((q) => ({
      id: q.id,
      title: q.title || (q.document ? `${q.document.name} Quiz` : 'Adaptive Practice Quiz'),
      subject: q.subject || q.document?.name || 'Study Material',
      icon: '📝',
      difficulty: q.difficulty || 'medium',
      questionCount: q.questionCount || 5,
      estimatedMinutes: Math.round((q.questionCount || 5) * 1.5),
      sourceDoc: q.document?.name || 'Study Notes.pdf',
      bestScore: q.lastAttempt?.percentage ?? null,
      lastAttemptDate: q.lastAttempt ? 'Recently' : null,
      questions: q.questions || [],
    }));
  }, [serverQuizzes]);

  // AI Quiz Generation Mutation
  const generateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/quiz/generate', payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('AI Quiz generated successfully!');
      setIsGenerateModalOpen(false);
      queryClient.invalidateQueries(['quizzes']);
      if (data?.quizId) {
        navigate(`/quiz/${data.quizId}`);
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.error || err.message || 'Failed to generate quiz';
      toast.error(`Quiz generation error: ${msg}`);
      setIsGenerateModalOpen(false);
    },
  });

  // Filter & Search Logic
  const filteredQuizzes = useMemo(() => {
    return allQuizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.sourceDoc?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Easy') return quiz.difficulty?.toLowerCase() === 'easy';
      if (activeFilter === 'Medium') return quiz.difficulty?.toLowerCase() === 'medium';
      if (activeFilter === 'Hard') return quiz.difficulty?.toLowerCase() === 'hard';
      if (activeFilter === 'Completed') return quiz.bestScore !== null && quiz.bestScore !== undefined;
      if (activeFilter === 'Unattempted') return quiz.bestScore === null || quiz.bestScore === undefined;

      // Subject tags
      return quiz.subject?.toLowerCase() === activeFilter.toLowerCase();
    });
  }, [allQuizzes, searchQuery, activeFilter]);

  const handleStartQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleRetakeQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleDeleteQuiz = (quiz) => {
    toast.success(`Removed "${quiz.title}"`);
  };

  const filterChips = [
    'All',
    'Biology',
    'Computer Science',
    'History',
    'Mathematics',
    'Chemistry',
    'Easy',
    'Medium',
    'Hard',
    'Completed',
    'Unattempted',
  ];

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans relative selection:bg-lime-200 overflow-x-clip w-full max-w-full">
      {/* Background Scrapbook Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-40" />
        <PastelBlob color="#fde99b" className="w-96 h-96 -top-10 -left-10" opacity={0.12} />
        <PastelBlob color="#9bd8a9" className="w-[30rem] h-[30rem] top-1/3 -right-20" opacity={0.12} />
        <PastelBlob color="#b8caf5" className="w-80 h-80 bottom-10 left-1/4" opacity={0.1} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        {/* Main Content Hub */}
        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-12 max-w-6xl w-full min-w-0">
          {/* SECTION 1: QUIZ HUB HERO */}
          <section className="w-full bg-gradient-to-br from-[var(--color-marigold)]/20 via-[var(--color-mint)]/20 to-[var(--color-periwinkle)]/20 rounded-[32px] border border-[var(--color-ash)]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-10 relative overflow-hidden">
          <TornPaperBackdrop color="bg-[var(--color-marigold)]/30" />

          <div className="relative z-10">
            {/* Title & Subtitle */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[46px] leading-[1.15] tracking-[-1.38px] text-[var(--color-ink)] mb-3">
              Test Your Knowledge 📝
            </h1>
            <p className="text-base text-[var(--color-graphite)] mb-6 max-w-2xl leading-relaxed">
              AI-powered active recall quizzes generated directly from your uploaded lecture notes and textbooks.
            </p>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {/* Mastery */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[var(--color-ash)]/80 shadow-xs text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-[var(--color-ink)] font-semibold">78% Avg Accuracy</span>
              </div>

              {/* Quizzes Count */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[var(--color-ash)]/80 shadow-xs text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-[var(--color-ink)] font-semibold">14 Quizzes Solved</span>
              </div>

              {/* Study Streak */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-[var(--color-ash)]/80 shadow-xs text-sm font-medium">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
                <span className="text-[var(--color-ink)] font-semibold">🔥 5-Day Streak</span>
              </div>
            </div>

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-gray-950 font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-emerald-800 transition-transform group-hover:rotate-12" />
              <span>+ Generate New Quiz</span>
            </button>
          </div>
        </section>

        {/* SECTION 2: FILTER & SEARCH BAR */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-stone)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes by subject, title, or document..."
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-[var(--color-ash)] shadow-xs text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
              />
            </div>

            {/* Quick Status / Total */}
            <div className="text-xs font-semibold text-[var(--color-stone)] tracking-wide uppercase">
              Showing {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'Quiz' : 'Quizzes'}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveFilter(chip)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                      : 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)] hover:border-gray-400 hover:bg-[var(--color-linen)]/40'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: QUIZ CARDS GRID */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[32px] border border-[var(--color-ash)]/70 p-8 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[var(--color-ink)]">No quizzes match your filter</h3>
              <p className="text-xs text-[var(--color-stone)] mt-1">
                Try searching with different keywords or generate a new practice test.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[var(--color-linen)] text-xs font-semibold text-[var(--color-ink)] hover:bg-[var(--color-cloud)]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStart={handleStartQuiz}
                onRetake={handleRetakeQuiz}
                onDelete={handleDeleteQuiz}
              />
            ))}
          </div>
        )}
      </main>
      </div>

      {/* AI Quiz Generation Modal */}
      <GenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={(payload) => generateMutation.mutate(payload)}
        isGenerating={generateMutation.isPending}
      />
    </div>
  );
}

export default QuizListPage;
