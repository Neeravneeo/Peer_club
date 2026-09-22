import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Trophy, Sparkles } from 'lucide-react'

export function StreakCounter({ streakDays = 0, longestStreak = 0 }) {
  // Determine next milestone
  const milestones = [3, 7, 14, 30, 60, 100]
  const nextMilestone = milestones.find((m) => m > streakDays) || (streakDays + 10)
  const prevMilestone = [...milestones].reverse().find((m) => m <= streakDays) || 0
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(((streakDays - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
    )
  )

  const daysToNext = nextMilestone - streakDays

  return (
    <Card className="border border-white/[0.08] bg-[#0d0e11]/80 hover:border-white/[0.16] hover:bg-[#121318]/90 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.5)] relative transition-all">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a8f98]">
              Daily Habit
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <Trophy className="w-3.5 h-3.5" /> Best: {longestStreak}d
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              scale: streakDays > 0 ? [1, 1.06, 1] : 1,
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="p-3 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0"
          >
            <Flame className="w-6 h-6 fill-amber-400" />
          </motion.div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {streakDays}
              </span>
              <span className="text-xs font-medium text-[#8a8f98]">
                {streakDays === 1 ? 'Day Streak' : 'Days Streak'}
              </span>
            </div>
            <p className="text-xs text-[#8a8f98] mt-0.5">
              {streakDays === 0
                ? 'Log a study session today to start your streak!'
                : streakDays >= 7
                ? 'Unstoppable! You are in the top study tier.'
                : 'Great momentum! Keep studying daily.'}
            </p>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#8a8f98]">
            <span>Next Milestone: {nextMilestone} Days</span>
            <span className="text-white font-mono">
              {daysToNext === 1 ? '1 day left' : `${daysToNext} days left`}
            </span>
          </div>

          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
