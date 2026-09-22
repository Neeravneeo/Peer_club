import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Trophy, Flame, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

// Components
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  DotGridPattern,
  PastelBlob,
  TornPaperBackdrop,
} from '@/components/DecorativeElements';
import { StatCard } from '@/components/leaderboard/StatCard';
import { FilterTabs } from '@/components/leaderboard/FilterTabs';
import { PodiumShowcase } from '@/components/leaderboard/PodiumShowcase';
import { PersonalRankCard } from '@/components/leaderboard/PersonalRankCard';
import { RankingTable } from '@/components/leaderboard/RankingTable';
import { LeagueTiers } from '@/components/leaderboard/LeagueTiers';
import { SAMPLE_LEADERBOARD_USERS } from '@/components/leaderboard/sampleLeaderboardData';

export function LeaderboardPage() {
  const { user } = useAuth();

  const [timeframe, setTimeframe] = useState('week');
  const [category, setCategory] = useState('Global');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch backend global leaderboard
  const { data: serverRankings = [], isLoading } = useQuery({
    queryKey: ['leaderboard', 'global', timeframe],
    queryFn: async () => {
      try {
        const res = await api.get('/leaderboard/global');
        return res.data?.leaderboard || [];
      } catch (err) {
        console.warn('API error fetching leaderboard, falling back to sample dataset', err);
        return [];
      }
    },
  });

  // Only display real user rankings from study sessions and quizzes
  const allScholars = useMemo(() => {
    if (!serverRankings || serverRankings.length === 0) {
      return [];
    }

    return serverRankings.map((entry, index) => ({
      id: entry.id || `server-${index}`,
      rank: entry.rank || index + 1,
      name: entry.name || 'Scholar Peer',
      username: `@${(entry.name || 'scholar').toLowerCase().replace(/\s+/g, '_')}`,
      avatar: entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name || 'S')}`,
      roomName: entry.roomName || 'General Studies',
      subjectTag: entry.subjectTag || 'General',
      studyHours: entry.studyHours || 0,
      quizzesCompleted: entry.quizzesCompleted || 0,
      streak: entry.streak || 1,
      cheers: 20 + index * 3,
      points: Math.round((entry.studyHours || 0) * 100 + (entry.quizzesCompleted || 0) * 50),
      rankDelta: 0,
      isCurrentUser: entry.userId === user?.id,
    }));
  }, [serverRankings, user?.id]);

  // Filter scholars by category and search
  const filteredScholars = useMemo(() => {
    return allScholars.filter((scholar) => {
      const matchSearch =
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.roomName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (category === 'Global') return true;
      if (category === 'Biology 101') return scholar.subjectTag?.toLowerCase().includes('bio');
      if (category === 'CS Algorithms') return scholar.subjectTag?.toLowerCase().includes('cs');
      if (category === 'Mathematics') return scholar.subjectTag?.toLowerCase().includes('math');
      if (category === 'Medicine') return scholar.subjectTag?.toLowerCase().includes('med');
      if (category === 'History') return scholar.subjectTag?.toLowerCase().includes('hist');

      return true;
    });
  }, [allScholars, searchQuery, category]);

  // Top 3 Podium
  const top3Scholars = useMemo(() => {
    return filteredScholars.slice(0, 3);
  }, [filteredScholars]);

  // Current User Standing
  const currentUserStats = useMemo(() => {
    const userInList = allScholars.find((s) => s.isCurrentUser) || allScholars[7];
    return {
      rank: userInList?.rank || 8,
      totalUsers: allScholars.length,
      studyHours: userInList?.studyHours || 24.5,
      quizzesCompleted: userInList?.quizzesCompleted || 10,
      streak: userInList?.streak || 5,
      nextTargetName: 'Sarah K.',
      nextTargetDiff: 1.2,
    };
  }, [allScholars]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] relative pb-24 selection:bg-lime-200 overflow-x-hidden w-full max-w-full">
      {/* Decorative Scrapbook Elements */}
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

        {/* Main Container */}
        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-12 max-w-6xl w-full min-w-0">
          {/* SECTION 1: HERO & STATS RIBBON */}
          <section className="w-full bg-gradient-to-br from-[var(--color-marigold)]/20 via-[var(--color-mint)]/20 to-[var(--color-periwinkle)]/20 rounded-[32px] border border-[var(--color-ash)]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-10 relative overflow-hidden">
          <TornPaperBackdrop color="bg-[var(--color-marigold)]/30" />

          <div className="relative z-10">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[46px] leading-[1.15] tracking-[-1.38px] text-[var(--color-ink)] mb-3">
              Hall of Scholars 🏆
            </h1>
            <p className="text-base text-[var(--color-graphite)] mb-8 max-w-2xl leading-relaxed">
              Recognizing dedication, consistent active recall, and collaborative study momentum across all rooms.
            </p>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                label="Total Registered"
                value="1,277"
                icon={Users}
                iconColor="text-emerald-600"
                subtext="Active scholars across circles"
              />
              <StatCard
                label="Total Participated"
                value="255"
                icon={Trophy}
                iconColor="text-blue-600"
                subtext="Logged hours this week"
              />
              <div className="bg-white rounded-[20px] border border-[var(--color-ash)]/70 shadow-xs p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[var(--color-graphite)] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Sprint Countdown 🔥</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-[var(--color-ink)] tracking-wider">
                    12d : 06h : 42m
                  </div>
                </div>
                <div className="text-[11px] text-[var(--color-stone)] mt-2">
                  Top 3 positions unlock exclusive scholar flair
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FILTER TABS & SEARCH */}
        <FilterTabs
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          category={category}
          setCategory={setCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* SECTION 3: TOP 3 PODIUM SHOWCASE */}
        {top3Scholars.length >= 3 && (
          <section>
            <PodiumShowcase topScholars={top3Scholars} />
          </section>
        )}

        {/* SECTION 4: PERSONAL RANK CARD */}
        <section>
          <PersonalRankCard userStats={currentUserStats} />
        </section>

        {/* SECTION 5: GLOBAL RANKING TABLE */}
        <section>
          <RankingTable scholars={filteredScholars} />
        </section>

        {/* SECTION 6: LEAGUE TIERS & MILESTONES */}
        <section>
          <LeagueTiers />
        </section>
      </main>
      </div>
    </div>
  );
}

export default LeaderboardPage;
