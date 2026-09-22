import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { StreakCard } from '@/components/StreakCard';
import { DocumentCard } from '@/components/DocumentCard';
import { QuizCard } from '@/components/QuizCard';
import { LogSessionModal } from '@/components/LogSessionModal';
import { EmptyState } from '@/components/EmptyState';
import {
  DotGridPattern,
  PastelBlob,
  HandDrawnUnderline,
  TornPaperBackdrop,
} from '@/components/DecorativeElements';
import {
  Flame,
  Clock,
  HelpCircle,
  Trophy,
  Upload,
  ArrowRight,
  Sparkles,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // High-performance deduplicated query with 1-minute cache
  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['dashboard', user?.id || 'guest'],
    queryFn: async () => {
      const startTime = performance.now();
      console.log('🔄 [Dashboard] Query started for user:', user?.id || 'guest');
      const res = await api.get('/dashboard');
      console.log(`⏱️ [Dashboard] Query resolved in ${(performance.now() - startTime).toFixed(1)}ms`);
      return res?.data?.dashboard || null;
    },
    staleTime: 60 * 1000, // 60s cache - instant page transitions without skeleton flashes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Memoized stats data transformation
  const stats = useMemo(() => {
    const d = dashboardData;
    if (!d) {
      return {
        currentStreak: 0,
        longestStreak: 1,
        isStreakActive: false,
        lastVisit: null,
        todayMinutes: 0,
        totalMinutes: 0,
        totalQuizzes: 0,
        badgesCount: 0,
        badgeLevel: 1,
      };
    }
    const currentStreak = Number(d.currentStreak) || 0;
    const bestStreak = Number(d.bestStreak) || Number(d.longestStreak) || 1;
    const isStreakActive = Boolean(d.isStreakActive ?? d.streak?.isActive);
    const lastVisit = d.lastVisit || d.streak?.lastVisit || null;
    const todayMinutes = Number(d.todayMinutes) || 0;
    const totalMinutes = Number(d.totalStudyMinutes) || 0;
    const totalQuizzes = Number(d.totalQuizzesCount ?? d.totalQuizzes ?? d.quizzesCount) || 0;
    const badgesCount = Number(d.badgesCount) || 0;
    const badgeLevel = Number(d.badgeLevel) || (badgesCount < 3 ? 1 : badgesCount < 7 ? 2 : badgesCount < 12 ? 3 : 4);

    return {
      currentStreak,
      longestStreak: bestStreak,
      isStreakActive,
      lastVisit,
      todayMinutes,
      totalMinutes,
      totalQuizzes,
      badgesCount,
      badgeLevel,
    };
  }, [dashboardData]);

  // Derived recent documents with fallback
  const recentDocs = useMemo(() => {
    const docs = dashboardData?.recentDocs || dashboardData?.recentDocuments;
    return Array.isArray(docs) && docs.length > 0 ? docs : [];
  }, [dashboardData]);

  // Derived recent quizzes with fallback
  const recentQuizzes = useMemo(() => {
    const quizzes = dashboardData?.recentQuizzes || dashboardData?.recentQuizAttempts;
    return Array.isArray(quizzes) && quizzes.length > 0 ? quizzes : [];
  }, [dashboardData]);

  // Synchronize real-time streak updates from quiz/flashcard/session/upload events
  useEffect(() => {
    const handleStreakUpdated = (e) => {
      if (e.detail) {
        console.log('[Dashboard] Event peerclub:streak-updated received:', e.detail);
        queryClient.setQueryData(['dashboard', user?.id || 'guest'], (old) => {
          if (!old) return old;
          return {
            ...old,
            currentStreak: Number(e.detail.currentStreak) || 0,
            bestStreak: Number(e.detail.bestStreak) || old.bestStreak || 1,
            isStreakActive: Boolean(e.detail.isActive),
            lastVisit: e.detail.lastVisit || old.lastVisit,
          };
        });
      }
    };

    window.addEventListener('peerclub:streak-updated', handleStreakUpdated);
    return () => window.removeEventListener('peerclub:streak-updated', handleStreakUpdated);
  }, [queryClient, user?.id]);

  // Demo Fallback Data if brand new user has no seeded records
  const displayDocs = recentDocs.length > 0 ? recentDocs : [
    {
      id: 'doc-demo-1',
      fileName: 'Biochemistry_Metabolic_Pathways.pdf',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'doc-demo-2',
      fileName: 'Cognitive_Psychology_Lecture_Notes.docx',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'doc-demo-3',
      fileName: 'Data_Structures_Algorithms_Cheatsheet.pdf',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const displayQuizzes = recentQuizzes.length > 0 ? recentQuizzes : [
    {
      id: 'quiz-demo-1',
      title: 'Cellular Respiration & Glycolysis Quiz',
      questions: [1, 2, 3, 4, 5],
      score: 85,
    },
    {
      id: 'quiz-demo-2',
      title: 'Memory Consolidation & Neural Plasticity',
      questions: [1, 2, 3, 4],
      score: 60,
    },
    {
      id: 'quiz-demo-3',
      title: 'Graph Traversal (BFS & DFS) Practice',
      questions: [1, 2, 3, 4, 5, 6],
      score: 40,
    },
  ];

  const hasContent = displayDocs.length > 0 || displayQuizzes.length > 0;
  const userName = user?.name || user?.email?.split('@')[0] || 'Scholar';
  const studyHours = stats ? (stats.totalMinutes / 60).toFixed(1) : '0.0';

  const handleSessionLogged = (addedMinutes) => {
    queryClient.setQueryData(['dashboard', user?.id || 'guest'], (old) => {
      if (!old) return old;
      return {
        ...old,
        todayMinutes: (Number(old.todayMinutes) || 0) + addedMinutes,
        totalStudyMinutes: (Number(old.totalStudyMinutes) || 0) + addedMinutes,
      };
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-mint/30 selection:text-ink relative overflow-x-clip w-full max-w-full">
      {/* Decorative Scrapbook Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <PastelBlob color="#9bd8a9" className="w-96 h-96 -top-20 -left-20" opacity={0.12} />
        <PastelBlob color="#fde99b" className="w-80 h-80 top-96 right-10" opacity={0.15} />
        <PastelBlob color="#b8caf5" className="w-72 h-72 bottom-20 left-1/3" opacity={0.14} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Content Area */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only - Stays fixed in place while scrolling, full 100vh height) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar streakDays={stats?.currentStreak ?? 0} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 pt-24 px-6 sm:px-10 pb-12 max-w-6xl w-full min-w-0">
          {/* Section 1: Welcome Banner */}
          <section className="mb-12 sm:mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-craft-pill bg-mint/30 text-ink text-[12px] font-medium border border-mint/60 mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Personal Study Journal</span>
                </div>

                <h1 className="font-serif text-[38px] sm:text-[48px] md:text-[54px] leading-[1.08] tracking-craft-heading text-ink font-normal">
                  Hello, {userName}! 👋
                </h1>
                <div className="-mt-1 mb-2">
                  <HandDrawnUnderline className="w-40 h-3 text-mint" />
                </div>
                <p className="text-[16px] text-graphite font-sans mt-1">
                  Welcome to your AI study scrapbook. Your streak is glowing!
                </p>
              </div>

              {/* Quick Actions (Right) */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-linen hover:bg-cloud border border-ash text-ink px-5 py-2.5 rounded-craft-pill text-[14px] font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <Clock className="w-4 h-4 text-graphite" />
                  <span>Log Session</span>
                </button>

                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center gap-2 bg-ink hover:bg-graphite text-white px-6 py-2.5 rounded-craft-pill text-[14px] font-semibold transition-all shadow-craft-sm hover:shadow-craft-md cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-mint" />
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: 4 Stat Cards in a Row (Unified Loading & Shared Resolution) */}
          <section className="mb-14 sm:mb-18">
            {isError && (
              <div className="mb-4 p-3.5 bg-red-50/90 border border-red-200 rounded-craft-card flex items-center justify-between text-[13px] text-red-800 shadow-xs">
                <span>Unable to load live study statistics.</span>
                <button
                  onClick={() => refetch()}
                  className="px-3.5 py-1 bg-white border border-red-300 rounded-craft-pill text-[12px] font-semibold hover:bg-red-50 cursor-pointer transition-colors shadow-xs text-red-900"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1: Study Streak Card */}
              <StreakCard
                loading={isLoading && !dashboardData}
                streakData={{
                  currentStreak: stats?.currentStreak ?? 0,
                  bestStreak: stats?.longestStreak ?? 1,
                  isActive: Boolean(stats?.isStreakActive),
                  lastVisit: stats?.lastVisit ?? null,
                }}
              />

              {/* Stat 2: Total Study Time (Periwinkle) */}
              <StatCard
                loading={isLoading && !dashboardData}
                icon={<Clock className="w-5 h-5" />}
                label="Total Time"
                value={`${studyHours}h`}
                variant="periwinkle"
                subtext={`+${stats?.todayMinutes ?? 0}m today`}
              />

              {/* Stat 3: Quizzes Completed (Mint) */}
              <StatCard
                loading={isLoading && !dashboardData}
                icon={<HelpCircle className="w-5 h-5" />}
                label="Quizzes Mastered"
                value={stats?.totalQuizzes ?? 0}
                variant="mint"
                subtext="AI verified"
              />

              {/* Stat 4: Achievements / Rank (Papaya) */}
              <StatCard
                loading={isLoading && !dashboardData}
                icon={<Trophy className="w-5 h-5" />}
                label="Badges Earned"
                value={`${stats?.badgesCount ?? 0}`}
                variant="papaya"
                badge={`Level ${stats?.badgeLevel ?? 1}`}
              />
            </div>
          </section>

          {/* Section 3: Two-Column Grid (Recent Docs + Recent Quizzes) */}
          {hasContent ? (
            <section className="mb-14 sm:mb-18">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Recent Documents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-[24px] leading-[1.3] tracking-craft-subheading text-ink font-normal">
                      Recent Documents
                    </h3>
                    <Link
                      to="/documents"
                      className="text-[13px] font-medium text-azure hover:underline flex items-center gap-1 font-sans"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {displayDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onGenerateQuiz={() => navigate('/quizzes')}
                        onGenerateFlashcards={() => navigate('/flashcards')}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column: Recent Quizzes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-[24px] leading-[1.3] tracking-craft-subheading text-ink font-normal">
                      Recent Quizzes
                    </h3>
                    <Link
                      to="/quizzes"
                      className="text-[13px] font-medium text-azure hover:underline flex items-center gap-1 font-sans"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {displayQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <EmptyState onUploadClick={() => navigate('/upload')} />
          )}

          {/* Section 4: Log Study Session CTA Banner */}
          <section className="mt-8 mb-16">
            <div className="relative bg-white rounded-craft-card p-8 border border-ash/60 shadow-craft-xl flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
              <TornPaperBackdrop color="bg-marigold/15" />
              <div>
                <span className="text-[12px] font-bold text-amber-900 bg-marigold/30 px-3 py-1 rounded-craft-pill uppercase tracking-wider mb-2 inline-block">
                  Active Revision
                </span>
                <h3 className="font-serif text-[26px] leading-tight text-ink font-normal mt-1">
                  Ready to lock in your study streak?
                </h3>
                <p className="text-[14px] text-graphite font-sans mt-1">
                  Log your offline focus session or reading time to climb the leaderboard.
                </p>
              </div>

              <button
                onClick={() => setIsLogModalOpen(true)}
                className="shrink-0 bg-ink hover:bg-graphite text-white rounded-craft-pill px-8 py-3.5 text-[14px] font-semibold transition-all shadow-craft-sm hover:shadow-craft-md flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-mint" />
                <span>Log Study Session</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Log Study Session Modal */}
      <LogSessionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSessionLogged={handleSessionLogged}
      />
    </div>
  );
}

export default Dashboard;
