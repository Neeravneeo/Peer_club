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
    lime: 'bg-voltage-lime text-true-black border-transparent',
    cyan: 'bg-cyan-spark text-true-black border-transparent',
    surface: 'bg-surface-elevated text-carbon-ink border-border',
    dark: 'bg-mid-abyss text-voltage-lime border-transparent',
  }

  return (
    <Card
      className={cn(
        'border-border bg-pure-white hover:border-true-black/60 transition-all duration-200 rounded-[24px] shadow-sm group relative overflow-hidden',
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-ash font-semibold uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl lg:text-3xl font-extrabold text-carbon-ink tracking-tight font-sans">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-ash/90 font-medium truncate pt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {Icon && (
            <div
              className={cn(
                'p-3 rounded-[16px] shrink-0 border transition-transform duration-200 group-hover:scale-105',
                accentStyles[accentColor] || accentStyles.lime
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        {badgeText && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-subtle text-carbon-ink text-[11px] font-semibold">
            {badgeText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
