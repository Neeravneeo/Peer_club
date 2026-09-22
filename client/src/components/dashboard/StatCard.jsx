import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'lime',
  badgeText,
  className,
}) {
  const accentStyles = {
    lime: 'bg-white/[0.06] text-voltage-lime border-white/[0.1]',
    cyan: 'bg-white/[0.06] text-cyan-spark border-white/[0.1]',
    surface: 'bg-white/[0.06] text-white border-white/[0.1]',
    dark: 'bg-[#5e6ad2]/15 text-[#8f9bff] border-[#5e6ad2]/30',
  }

  return (
    <Card
      className={cn(
        'border border-white/[0.08] bg-[#0d0e11]/80 hover:border-white/[0.16] hover:bg-[#121318]/90 transition-all duration-200 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.5)] group relative overflow-hidden',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] text-[#8a8f98] font-medium uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-semibold text-white tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-[#8a8f98] truncate pt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {Icon && (
            <div
              className={cn(
                'p-2.5 rounded-xl shrink-0 border transition-transform duration-200 group-hover:scale-105',
                accentStyles[accentColor] || accentStyles.lime
              )}
            >
              <Icon className="w-4.5 h-4.5" />
            </div>
          )}
        </div>

        {badgeText && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#8a8f98] text-[11px] font-medium">
            {badgeText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
