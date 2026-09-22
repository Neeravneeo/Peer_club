import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export function BadgesWidget({ badges = [], totalBadgesCount = 0 }) {
  const TOTAL_AVAILABLE_BADGES = 10
  const progressPercent = Math.min(
    100,
    Math.round((totalBadgesCount / TOTAL_AVAILABLE_BADGES) * 100)
  )

  return (
    <Card className="border border-white/[0.08] bg-[#0d0e11]/80 hover:border-white/[0.16] hover:bg-[#121318]/90 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.5)] transition-all">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8a8f98] font-medium uppercase tracking-wider">
              Gamification & Badges
            </span>
          </div>
          <Link
            to="/profile"
            className="text-xs font-medium text-[#8a8f98] hover:text-white flex items-center gap-1 group transition-colors"
          >
            All Badges{' '}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Progress header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-semibold text-white tracking-tight">
              {totalBadgesCount} / {TOTAL_AVAILABLE_BADGES}
            </h4>
            <p className="text-xs text-[#8a8f98] mt-0.5">Badges Unlocked</p>
          </div>

          <div className="p-2.5 rounded-xl bg-gradient-to-b from-[#5e6ad2] to-[#454fa8] text-white font-medium shadow-[0_0_16px_rgba(94,106,210,0.3)]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#8f9bff] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Badges List */}
        {badges.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center space-y-1">
            <Sparkles className="w-5 h-5 text-[#8f9bff] mx-auto" />
            <p className="text-xs font-medium text-white">No badges earned yet</p>
            <p className="text-[11px] text-[#8a8f98]">
              Complete your first quiz or a 3-day streak to unlock rewards!
            </p>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {badges.slice(0, 2).map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#5e6ad2]/30 to-[#5e6ad2]/10 border border-[#5e6ad2]/30 flex items-center justify-center text-white shrink-0 shadow-sm text-xs">
                  🏆
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white text-xs truncate">
                    {badge.name}
                  </p>
                  <p className="text-[11px] text-[#8a8f98] truncate">{badge.description}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
