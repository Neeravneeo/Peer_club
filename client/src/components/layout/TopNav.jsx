import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, LogOut, Flame } from 'lucide-react'

import { NotificationBell } from './NotificationBell'

export function TopNav() {
  const { user, signOut } = useAuth()

  return (
    <header className="h-16 border-b border-border bg-pure-white sticky top-0 z-40 px-6 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-voltage-lime text-true-black font-bold">
          <Brain className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-carbon-ink">
          Peer Club
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Streak indicator badge */}
        <Badge variant="lime" className="gap-1.5 px-3 py-1 text-xs">
          <Flame className="w-3.5 h-3.5 fill-true-black text-true-black" />
          <span>{user?.currentStreakDays || 0}d streak</span>
        </Badge>

        {/* Notification Bell with polling & dropdown */}
        <NotificationBell />

        {/* User profile info & link */}
        <Link
          to="/profile"
          className="hidden sm:block text-right hover:opacity-80 transition-opacity"
        >
          <p className="text-sm font-semibold text-carbon-ink leading-none">
            {user?.name || user?.email?.split('@')[0]}
          </p>
          <p className="text-xs text-ash mt-0.5">{user?.email}</p>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="text-ash hover:text-true-black hover:bg-surface-elevated"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
