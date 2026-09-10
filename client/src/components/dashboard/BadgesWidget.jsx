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
    <Card className="border-border bg-pure-white rounded-[24px] shadow-sm hover:border-true-black/60 transition-colors">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ash font-bold uppercase tracking-wider">
              Gamification & Badges
            </span>
          </div>
          <Link
            to="/profile"
            className="text-xs font-semibold text-carbon-ink hover:underline flex items-center gap-1 group"
          >
            All Badges{' '}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Progress header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-extrabold text-carbon-ink tracking-tight font-sans">
              {totalBadgesCount} / {TOTAL_AVAILABLE_BADGES}
            </h4>
            <p className="text-xs text-ash mt-0.5">Badges Unlocked</p>
          </div>

          <div className="p-3 rounded-[16px] bg-voltage-lime text-true-black font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
          <div
            className="h-full bg-voltage-lime rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Badges List */}
        {badges.length === 0 ? (
          <div className="p-4 rounded-[16px] bg-surface-elevated text-center space-y-1">
            <Sparkles className="w-5 h-5 text-voltage-lime mx-auto" />
            <p className="text-xs font-bold text-carbon-ink">No badges earned yet</p>
            <p className="text-[11px] text-ash">
              Complete your first quiz or a 3-day streak to unlock rewards!
            </p>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {badges.slice(0, 2).map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-surface-elevated border border-border/60 hover:border-true-black/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-voltage-lime to-cyan-spark flex items-center justify-center text-true-black font-extrabold shrink-0 shadow-sm text-xs">
                  🏆
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-carbon-ink text-xs truncate">
                    {badge.name}
                  </p>
                  <p className="text-[11px] text-ash truncate">{badge.description}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
