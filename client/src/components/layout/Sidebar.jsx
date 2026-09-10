import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  UploadCloud,
  Brain,
  Layers,
  Sparkles,
  Bell,
  User,
  Users,
  Trophy,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Study Rooms', path: '/rooms', icon: Users },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Documents', path: '/upload', icon: UploadCloud },
  { label: 'AI Quizzes', path: '/quizzes', icon: Brain },
  { label: 'Flashcards', path: '/flashcards', icon: Layers },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Profile', path: '/profile', icon: User },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-pure-white hidden md:flex flex-col justify-between p-4 h-[calc(100vh-64px)] sticky top-16">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-ash uppercase tracking-wider mb-3">
          Study Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-sm font-medium transition-all',
                  isActive
                    ? 'bg-voltage-lime text-true-black font-semibold'
                    : 'text-carbon-ink hover:bg-surface-elevated'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          )
        })}
      </div>

      <div className="p-4 rounded-[24px] bg-surface-elevated border border-border text-xs text-ash space-y-1.5">
        <div className="flex items-center gap-1.5 text-true-black font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-true-black" />
          <span>AI Study Suite</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Active recall flashcards & targeted revision quizzes powered by Gemini.
        </p>
      </div>
    </aside>
  )
}
