import React, { useState } from 'react'
import {
  Clock,
  ExternalLink,
  Share2,
  Link as LinkIcon,
  Pause,
  Sliders,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react'

export function StudyRhythmCard({
  title = "Stake Avalance (AVAX)",
  lastUpdated = "45 minutes ago",
  balance = "31.39686",
  onUpgrade,
  onUnstake
}) {
  const [selectedMonth, setSelectedMonth] = useState(4)

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#12131a]/90 p-6 md:p-7 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      {/* Background subtle grid dots */}
      <div className="absolute inset-0 bg-linear-dots opacity-20 pointer-events-none" />

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-white/[0.08] relative z-10">
        {/* Left Col: Title, Big Value & Buttons */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#8a8f98] font-medium">
              <span>Last Update — {lastUpdated}</span>
              <Clock className="w-3 h-3 text-[#8a8f98]" />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {title}
              </h2>
              <div className="w-6 h-6 rounded-full bg-[#e84142] flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                ▲
              </div>

              <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
                <button className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-[#8a8f98] hover:text-white transition-colors">
                  <LinkIcon className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-[#8a8f98] hover:text-white transition-colors">
                  <Share2 className="w-3 h-3" />
                </button>
                <button className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-medium text-white flex items-center gap-1 transition-colors">
                  <span>View Profile</span>
                  <ExternalLink className="w-3 h-3 text-[#8a8f98]" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#8a8f98] font-medium block mb-1">
              Current Reward Balance, AVAX
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
                {balance}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onUpgrade}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7952f5] to-[#8c65f7] hover:from-[#855ff8] hover:to-[#9974fa] text-white text-xs font-semibold shadow-[0_0_18px_rgba(121,82,245,0.4)] transition-all"
                >
                  Upgrade
                </button>
                <button
                  onClick={onUnstake}
                  className="px-5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold transition-all"
                >
                  Unstake
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Investment Period & Waveform visualizer */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3 bg-[#0d0e14]/70 p-4 rounded-xl border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Investment Period</h4>
              <p className="text-[10px] text-[#8a8f98]">Contribution Period (Month)</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-[#8a8f98] border border-white/[0.08]">
              6 Month
            </span>
          </div>

          {/* Waveform timeline slider mockup */}
          <div className="relative py-2">
            <div className="flex items-center justify-center gap-[3px] h-10 px-2">
              {[4, 8, 12, 16, 22, 14, 28, 36, 18, 30, 24, 38, 26, 18, 12, 28, 34, 20, 15, 8, 12, 20, 14, 6].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-white/[0.15]"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            {/* Slider track line */}
            <div className="w-full h-[1px] bg-white/[0.1] absolute top-1/2 -translate-y-1/2 left-0" />

            {/* Center Slider Knob */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#8a8f98] mb-1 bg-[#1a1b24] px-1.5 py-0.5 rounded border border-white/[0.1]">
                4 Month
              </span>
              <div className="w-6 h-6 rounded-full bg-[#7952f5] border-2 border-white shadow-[0_0_12px_rgba(121,82,245,0.8)] flex items-center justify-center text-white text-[9px]">
                <Pause className="w-2.5 h-2.5 fill-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 relative z-10">
        {/* Col 1: Momentum */}
        <div className="space-y-2 lg:border-r border-white/[0.08] lg:pr-4">
          <div className="flex items-center justify-between text-[#8a8f98] text-[11px]">
            <div>
              <span className="font-semibold text-white block">Momentum</span>
              <span className="text-[10px]">Growth dynamics</span>
            </div>
            <button className="text-[#8a8f98] hover:text-white">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8a8f98]">Staked Tokens Trend</span>
              <span className="px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-[#8a8f98]">
                24H
              </span>
            </div>
            <p className="text-lg font-bold text-white font-sans">
              -0.82%
            </p>
          </div>
        </div>

        {/* Col 2: General */}
        <div className="space-y-2 lg:border-r border-white/[0.08] lg:pr-4">
          <div className="flex items-center justify-between text-[#8a8f98] text-[11px]">
            <div>
              <span className="font-semibold text-white block">General</span>
              <span className="text-[10px]">Overview</span>
            </div>
            <button className="text-[#8a8f98] hover:text-white">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8a8f98]">Price</span>
              <span className="px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-[#8a8f98]">
                24H
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white font-sans">$41.99</span>
              <span className="text-[11px] text-[#ef4444] font-semibold flex items-center">
                -1.09% ↘
              </span>
            </div>
          </div>
        </div>

        {/* Col 3: Risk */}
        <div className="space-y-2 lg:border-r border-white/[0.08] lg:pr-4">
          <div className="flex items-center justify-between text-[#8a8f98] text-[11px]">
            <div>
              <span className="font-semibold text-white block">Risk</span>
              <span className="text-[10px]">Risk assessment</span>
            </div>
            <button className="text-[#8a8f98] hover:text-white">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8a8f98]">Staking Ratio</span>
              <span className="px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-[#8a8f98]">
                24H
              </span>
            </div>
            <p className="text-lg font-bold text-white font-sans">
              60.6%
            </p>
          </div>
        </div>

        {/* Col 4: Reward */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[#8a8f98] text-[11px]">
            <div>
              <span className="font-semibold text-white block">Reward</span>
              <span className="text-[10px]">Expected profit</span>
            </div>
            <button className="text-[#8a8f98] hover:text-white">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-[#8a8f98]">
              <span>Reward Rate</span>
              <span className="font-mono text-white text-[10px]">2.23% 24H Ago</span>
            </div>

            {/* Slider track with dot */}
            <div className="relative w-full h-1.5 bg-white/[0.1] rounded-full mt-2">
              <div className="absolute left-0 top-0 h-full w-[70%] bg-gradient-to-r from-[#7952f5] to-[#8c65f7] rounded-full" />
              <div className="absolute left-[70%] -top-[3px] w-3 h-3 rounded-full bg-white shadow-md border border-[#7952f5]" />
            </div>
            <div className="flex justify-end text-[10px] font-mono text-[#8a8f98] pt-1">
              <span>1.46% 46H Ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
