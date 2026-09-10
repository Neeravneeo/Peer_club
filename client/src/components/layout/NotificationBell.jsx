import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Check,
  Flame,
  Award,
  Clock,
  Brain,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export function NotificationBell() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['notifications', 'dropdown'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=5')
      return res.data
    },
    refetchInterval: 60000, // 60s polling
  })

  const { notifications = [], unreadCount = 0 } = data || {}

  // Mark all read mutation
  const markAllMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Mark single read mutation
  const markSingleMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/notifications/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markSingleMutation.mutate(item.id)
    }
    if (item.actionUrl) {
      navigate(item.actionUrl)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-4 h-4 text-voltage-lime fill-true-black" />
      case 'streak_alert':
        return <Flame className="w-4 h-4 text-voltage-lime fill-true-black" />
      case 'quiz':
        return <Brain className="w-4 h-4 text-cyan-spark" />
      default:
        return <Clock className="w-4 h-4 text-ash" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-surface-elevated text-carbon-ink transition-colors focus:outline-none"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-carbon-ink" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-voltage-lime text-true-black text-[10px] font-extrabold shadow-sm border border-black/20">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-2">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-carbon-ink">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-voltage-lime text-true-black text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              className="text-xs text-ash hover:text-carbon-ink font-semibold flex items-center gap-1 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* List of items */}
        {notifications.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Bell className="w-6 h-6 text-ash/40 mx-auto" />
            <p className="text-xs font-semibold text-carbon-ink">All caught up!</p>
            <p className="text-[11px] text-ash">No new notifications right now.</p>
          </div>
        ) : (
          <div className="py-1 space-y-1">
            {notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`flex items-start gap-3 p-2.5 rounded-[12px] cursor-pointer transition-colors ${
                  !item.isRead ? 'bg-surface-elevated font-medium' : 'opacity-80'
                }`}
              >
                <div className="p-2 rounded-full bg-pure-white border border-border shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-carbon-ink truncate">
                      {item.title}
                    </p>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-voltage-lime shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-ash line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="p-1 text-center">
          <Link
            to="/notifications"
            className="text-xs font-bold text-carbon-ink hover:text-ash py-1.5 flex items-center justify-center gap-1.5 transition-colors"
          >
            View All Notifications <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
