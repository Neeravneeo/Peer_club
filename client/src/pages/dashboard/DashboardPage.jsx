import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/StatCard'
import { StreakCounter } from '@/components/dashboard/StreakCounter'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { RecentQuizzes } from '@/components/dashboard/RecentQuizzes'
import { RecentDocuments } from '@/components/dashboard/RecentDocuments'
import { BadgesWidget } from '@/components/dashboard/BadgesWidget'
import { LogStudyModal } from '@/components/dashboard/LogStudyModal'
import {
  Flame,
  Clock,
  Award,
  BookOpen,
  UploadCloud,
  Brain,
  Sparkles,
  Layers,
  PlusCircle,
} from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard')
      return res.data.dashboard
    },
  })

  const {
    todayMinutes = 0,
    weekByDay = [],
    currentStreak = 0,
    longestStreak = 0,
    totalStudyMinutes = 0,
    quizzesThisWeek = 0,
    avgQuizScore = 0,
    totalQuizAttempts = 0,
    quizzesCount = 0,
    flashcardsCount = 0,
    recentQuizAttempts = [],
    recentDocuments = [],
    badgesCount = 0,
    recentBadges = [],
  } = dashboardData || {}

  const displayName = user?.name || user?.email?.split('@')[0] || 'Peer Student'

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Quick Actions Banner */}
      <div className="p-8 md:p-10 rounded-[28px] bg-surface-elevated border border-border flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="space-y-2.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voltage-lime text-true-black text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Peer Club Learning Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-carbon-ink tracking-tight font-sans">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-ash max-w-xl">
            Active recall flashcards, AI practice exams, and collaborative study accountability.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap z-10">
          <Button
            onClick={() => setIsLogModalOpen(true)}
            className="gap-2 shadow-sm font-bold bg-voltage-lime text-true-black hover:bg-voltage-lime/90"
          >
            <Clock className="w-4 h-4" /> Log Study Time
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <Link to="/upload">
              <UploadCloud className="w-4 h-4" /> Upload Material
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <Link to="/quizzes">
              <Brain className="w-4 h-4" /> Quizzes
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <Link to="/flashcards">
              <Layers className="w-4 h-4" /> Decks
            </Link>
          </Button>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-voltage-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-64 h-64 bg-cyan-spark/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Streak"
          value={`${currentStreak} ${currentStreak === 1 ? 'Day' : 'Days'}`}
          subtitle={`Personal Best: ${longestStreak} days`}
          icon={Flame}
          accentColor="lime"
          badgeText={currentStreak > 0 ? '🔥 On Fire' : 'Start Today'}
        />

        <StatCard
          title="Study Time Today"
          value={`${todayMinutes}m`}
          subtitle={`Total: ${Math.floor(totalStudyMinutes / 60)}h ${totalStudyMinutes % 60}m`}
          icon={Clock}
          accentColor="cyan"
          badgeText={todayMinutes >= 25 ? 'Target Reached' : '25m Daily Goal'}
        />

        <StatCard
          title="Quiz Mastery"
          value={avgQuizScore > 0 ? `${avgQuizScore}%` : 'N/A'}
          subtitle={`${quizzesThisWeek} quizzes taken this week`}
          icon={Brain}
          accentColor="surface"
          badgeText={`${totalQuizAttempts} total attempts`}
        />

        <StatCard
          title="Learning Materials"
          value={`${recentDocuments.length} Docs`}
          subtitle={`${quizzesCount} Quizzes • ${flashcardsCount} Decks`}
          icon={Layers}
          accentColor="surface"
          badgeText={`${badgesCount} Badges Unlocked`}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Activity Chart + Recent Quizzes */}
        <div className="lg:col-span-7 space-y-6">
          <ActivityChart weekData={weekByDay} />

          <RecentQuizzes
            attempts={recentQuizAttempts}
            totalQuizzes={quizzesCount}
          />
        </div>

        {/* Right Column (5 cols): Streak Counter + Recent Documents + Badges */}
        <div className="lg:col-span-5 space-y-6">
          <StreakCounter
            streakDays={currentStreak}
            longestStreak={longestStreak}
          />

          <RecentDocuments documents={recentDocuments} />

          <BadgesWidget
            badges={recentBadges}
            totalBadgesCount={badgesCount}
          />
        </div>
      </div>

      {/* Log Study Modal */}
      <LogStudyModal
        open={isLogModalOpen}
        onOpenChange={setIsLogModalOpen}
      />
    </div>
  )
}
