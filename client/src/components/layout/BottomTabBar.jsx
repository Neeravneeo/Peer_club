import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  UploadCloud,
  Brain,
  Layers,
  User,
} from 'lucide-react'

// ponytail: Section 2.4 Mobile Bottom Tab Bar (< 768px)
const tabs = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Docs', path: '/upload', icon: UploadCloud },
  { label: 'Quizzes', path: '/quizzes', icon: Brain },
  { label: 'Cards', path: '/flashcards', icon: Layers },
  { label: 'Profile', path: '/profile', icon: User },
]

export function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#08090a]/90 backdrop-blur-xl border-t border-white/[0.08] flex items-center justify-around h-16 md:hidden px-2 shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-white font-semibold'
                  : 'text-[#8a8f98] hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-1 rounded-md transition-all',
                    isActive ? 'bg-white/[0.1] text-white border border-white/[0.1]' : 'text-[#8a8f98]'
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
