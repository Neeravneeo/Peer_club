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
    <Card className="border-border bg-gradient-to-br from-pure-white via-surface-elevated to-pure-white rounded-[24px] overflow-hidden shadow-sm relative border hover:border-true-black/60 transition-colors">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ash">
              Daily Study Habit
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voltage-lime text-true-black text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" /> Best: {longestStreak}d
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              scale: streakDays > 0 ? [1, 1.08, 1] : 1,
              rotate: streakDays > 0 ? [0, -3, 3, 0] : 0,
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="p-3.5 rounded-[18px] bg-voltage-lime text-true-black font-extrabold shadow-sm border border-black/10 shrink-0"
          >
            <Flame className="w-7 h-7 fill-true-black" />
          </motion.div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-carbon-ink tracking-tight font-sans">
                {streakDays}
              </span>
              <span className="text-sm font-bold text-ash">
                {streakDays === 1 ? 'Day Streak' : 'Days Streak'}
              </span>
            </div>
            <p className="text-xs text-ash mt-0.5">
              {streakDays === 0
                ? 'Log a study session today to start your streak!'
                : streakDays >= 7
                ? 'Unstoppable! You are in the top study tier.'
                : 'Great momentum! Keep studying daily.'}
            </p>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between text-[11px] font-semibold text-ash">
            <span>Next Milestone: {nextMilestone} Days</span>
            <span className="text-carbon-ink font-bold">
              {daysToNext === 1 ? '1 day left' : `${daysToNext} days left`}
            </span>
          </div>

          <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-voltage-lime rounded-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
