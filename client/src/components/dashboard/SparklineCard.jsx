import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SparklineCard({
  icon: Icon,
  tokenSymbol = 'ETH',
  iconBg = 'bg-[#627eea]',
  tokenName = 'Etherium [ETH]',
  badgeText = 'Proof of Stake',
  rate = '13.62%',
  trend = '+6.26%',
  isPositive = true,
  statAmount = '+$2,956',
  color = '#7952f5',
  pathData = 'M 0 35 Q 25 32 40 45 T 75 25 T 110 38 T 145 15 T 175 32 T 205 18 T 235 28 T 260 22',
}) {
  const gradientId = `grad-${tokenName.replace(/[^a-zA-Z0-9]/g, '')}`

  const renderTokenIcon = () => {
    if (tokenSymbol === 'ETH') {
      return (
        <div className="w-8 h-8 rounded-xl bg-[#627eea] flex items-center justify-center text-white shrink-0 shadow-md">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2L5.5 12.8 12 16.7l6.5-3.9L12 2zm0 16.2l-6.5-3.8L12 22l6.5-7.6-6.5 3.8z" />
          </svg>
        </div>
      )
    }
    if (tokenSymbol === 'BNB') {
      return (
        <div className="w-8 h-8 rounded-xl bg-[#f0b90b] flex items-center justify-center shrink-0 shadow-md">
          <svg className="w-4 h-4 fill-[#12131a]" viewBox="0 0 24 24">
            <path d="M12 3l3 3-3 3-3-3 3-3zm-6 6l3 3-3 3-3-3 3-3zm12 0l3 3-3 3-3-3 3-3zM12 9l3 3-3 3-3-3 3-3zm-6 6l3 3-3 3-3-3 3-3zm12 0l3 3-3 3-3-3 3-3zm-6 3l3 3-3 3-3-3 3-3z" />
          </svg>
        </div>
      )
    }
    if (tokenSymbol === 'POLYGON') {
      return (
        <div className="w-8 h-8 rounded-xl bg-[#8247e5] flex items-center justify-center text-white shrink-0 shadow-md">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M16.5 7.5L12 5 7.5 7.5 12 10l4.5-2.5zm4.5 2.5l-4.5-2.5v5L21 15v-5zm-18 0v5l4.5 2.5v-5L3 10zm9 5l4.5-2.5v-5L12 10v5z" />
          </svg>
        </div>
      )
    }
    return (
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md", iconBg)}>
        {Icon && <Icon className="w-4 h-4" />}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] hover:border-white/[0.16] transition-all p-5 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)] group h-full">
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {renderTokenIcon()}
          <div>
            <span className="text-[10px] text-[#8a8f98] font-medium block leading-none mb-1">
              {badgeText}
            </span>
            <span className="text-xs font-bold text-white tracking-tight">
              {tokenName}
            </span>
          </div>
        </div>

        <button className="w-7 h-7 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-[#8a8f98] hover:text-white transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metric & Trend */}
      <div className="mt-5 mb-2">
        <span className="text-[11px] text-[#8a8f98] font-medium block leading-none mb-1.5">
          Reward Rate
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight font-sans">
            {rate}
          </span>
          <div className={cn(
            "inline-flex items-center gap-0.5 text-[11px] font-semibold",
            isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
          )}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{trend}</span>
          </div>
        </div>
      </div>

      {/* SVG Sparkline Area Chart */}
      <div className="relative w-full h-16 mt-2">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 260 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fill Area */}
          <path
            d={`${pathData} L 260 50 L 0 50 Z`}
            fill={`url(#${gradientId})`}
          />

          {/* Stroke Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Glowing Endpoint Dot */}
          <circle cx="260" cy="22" r="3" fill="#ffffff" stroke={color} strokeWidth="2" />
        </svg>

        {/* Floating pill stat on curve */}
        <div className="absolute right-4 top-2 px-2 py-0.5 rounded-full bg-[#1c1d27] border border-white/[0.1] text-[10px] font-mono text-[#8a8f98] shadow-sm">
          {statAmount}
        </div>
      </div>
    </div>
  )
}
