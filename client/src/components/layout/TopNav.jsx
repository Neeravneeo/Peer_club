import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  LogOut,
  Flame,
  Search,
  Settings,
  Lock,
  ChevronDown,
  ChevronsUpDown,
  Bell
} from 'lucide-react'
import { NotificationBell } from './NotificationBell'
import { LogStudyModal } from '@/components/dashboard/LogStudyModal'

export function TopNav() {
  const { user, signOut } = useAuth()
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  const displayName = user?.name || 'Ryan Crawford'
  const username = user?.email ? `@${user.email.split('@')[0]}` : '@ryan991'

  return (
    <>
      <header className="h-16 border-b border-white/[0.08] bg-[#0c0d12] sticky top-0 z-40 px-0 flex items-center justify-between">
        {/* Left: Brand + Workspace Dropdown (aligned with sidebar width 240px) */}
        <div className="w-[240px] shrink-0 h-full border-r border-white/[0.08] flex items-center px-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 group w-full">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-extrabold shadow-sm shrink-0">
              <span className="text-base font-black tracking-tighter">S</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white tracking-tight">
                    Stakent
                  </span>
                  <span className="text-[10px] text-[#8a8f98]">®</span>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-[#8a8f98]" />
              </div>
              <p className="text-[10px] text-[#8a8f98] leading-none truncate">
                Top Staking Assets
              </p>
            </div>
          </Link>
        </div>

        {/* Header Right Content (spans the rest of the bar) */}
        <div className="flex-1 px-5 flex items-center justify-between gap-4">

        {/* Center: User Profile Pill + Deposit/Log Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#161722] border border-white/[0.08] hover:border-white/[0.16] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black border border-white/20 overflow-hidden">
              <span className="text-[11px]">👤</span>
            </div>
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#8a8f98] font-mono">{username}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/[0.1] text-white">
                  PRO
                </span>
              </div>
              <p className="text-xs font-semibold text-white tracking-tight">
                {displayName}
              </p>
            </div>
          </Link>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#b197fc] to-[#d0bfff] hover:from-[#9775fa] hover:to-[#b197fc] text-[#1a1532] text-xs font-bold shadow-[0_0_20px_rgba(177,151,252,0.4)] transition-all"
          >
            <span>Deposit</span>
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Controls: Notification Bell, Search, Settings, Logout */}
        <div className="flex items-center gap-2.5">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Search Input Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161722] border border-white/[0.08] text-xs text-[#8a8f98] w-40 lg:w-48 focus-within:border-white/[0.2] transition-colors">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white placeholder:text-[#8a8f98] focus:outline-none w-full text-xs"
            />
            <Search className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
          </div>

          {/* Settings button */}
          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161722] border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-white transition-colors"
          >
            <span>Settings</span>
            <Settings className="w-3.5 h-3.5 text-[#8a8f98]" />
          </Link>

          {/* Sign out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-[#8a8f98] hover:text-white hover:bg-white/[0.06] h-8 w-8 p-0 rounded-full"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
        </div>
      </header>

      {/* Log Study Session Modal */}
      <LogStudyModal
        open={isLogModalOpen}
        onOpenChange={setIsLogModalOpen}
      />
    </>
  )
}
