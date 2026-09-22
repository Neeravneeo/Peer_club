import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Coins,
  ShieldCheck,
  Calculator,
  Database,
  Layers,
  Sparkles,
  Zap,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react'

export function Sidebar() {
  const [activeTab, setActiveTab] = useState('staking') // 'staking' | 'stablecoin'

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assets', path: '/upload', icon: Coins },
    { label: 'Staking Providers', path: '/quizzes', icon: ShieldCheck },
    { label: 'Staking Calculator', path: '/flashcards', icon: Calculator },
    { label: 'Data API', path: '/dashboard', icon: Database, isExternal: true },
    { label: 'Liquid Staking', path: '/upload', icon: Layers, badge: 'Beta' },
  ]

  const activeStakings = [
    {
      name: 'Asset Ethereum',
      amount: '$7,699.00',
      iconBg: 'bg-[#627eea]',
      svg: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2L5.5 12.8 12 16.7l6.5-3.9L12 2zm0 16.2l-6.5-3.8L12 22l6.5-7.6-6.5 3.8z" />
        </svg>
      )
    },
    {
      name: 'Asset Avalanche',
      amount: '$1,340.00',
      iconBg: 'bg-[#e84142]',
      svg: (
        <span className="text-[11px] font-bold text-white">▲</span>
      )
    },
    {
      name: 'Asset Polygon (Matic)',
      amount: '$540.00',
      iconBg: 'bg-[#8247e5]',
      svg: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M16.5 7.5L12 5 7.5 7.5 12 10l4.5-2.5zm4.5 2.5l-4.5-2.5v5L21 15v-5zm-18 0v5l4.5 2.5v-5L3 10zm9 5l4.5-2.5v-5L12 10v5z" />
        </svg>
      )
    },
    {
      name: 'Asset Solana',
      amount: '$980.00',
      iconBg: 'bg-[#14f195]',
      svg: (
        <svg className="w-3.5 h-3.5 fill-[#0c0d12]" viewBox="0 0 24 24">
          <path d="M4 17.5h13l3 3H7l-3-3zm0-7h13l3 3H7l-3-3zm3-7h13l-3 3H4l3-3z" />
        </svg>
      )
    }
  ]

  return (
    <aside className="w-[240px] shrink-0 border-r border-white/[0.08] bg-[#0c0d12] hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-64px)] select-none">
      <div className="space-y-4">
        {/* Top Dual Pill Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#161722] border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('staking')}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-all text-center",
              activeTab === 'staking'
                ? "bg-[#252736] text-white shadow-sm"
                : "text-[#8a8f98] hover:text-white"
            )}
          >
            Staking
          </button>
          <button
            onClick={() => setActiveTab('stablecoin')}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-all text-center",
              activeTab === 'stablecoin'
                ? "bg-[#252736] text-white shadow-sm"
                : "text-[#8a8f98] hover:text-white"
            )}
          >
            Stablecoin
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all',
                    isActive && item.label === 'Dashboard'
                      ? 'bg-[#181926] text-white font-semibold border border-white/[0.08] shadow-sm'
                      : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.04]'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#8a8f98]" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#7952f5]/20 border border-[#7952f5]/40 text-[#b197fc] text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
                {item.isExternal && (
                  <ArrowUpRight className="w-3 h-3 text-[#8a8f98]" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Active Stakings Section */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-[#8a8f98] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Active Staking
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#7952f5] text-white text-[9px] font-bold flex items-center justify-center">
              6
            </span>
          </div>

          <div className="space-y-1.5">
            {activeStakings.map((staking, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
              >
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm", staking.iconBg)}>
                  {staking.svg}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium text-white group-hover:text-white truncate">
                    {staking.name}
                  </p>
                  <p className="text-[10px] text-[#8a8f98] font-mono">
                    Amount <span className="text-white/90 font-semibold">{staking.amount}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Card: Activate Super */}
      <div className="p-3 rounded-xl bg-[#161722] border border-white/[0.08] flex items-center gap-3 relative overflow-hidden mt-4 cursor-pointer hover:border-white/[0.16] transition-all">
        <div className="w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white shrink-0">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
        <div className="min-w-0 text-left">
          <p className="text-xs font-semibold text-white tracking-tight leading-tight">
            Activate Super
          </p>
          <p className="text-[10px] text-[#8a8f98] truncate">
            Unlock all features on Stakent
          </p>
        </div>
      </div>
    </aside>
  )
}
