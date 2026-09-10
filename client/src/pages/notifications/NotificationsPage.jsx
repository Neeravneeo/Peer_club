import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Check,
  CheckCheck,
  Flame,
  Award,
  Clock,
  Brain,
  ChevronRight,
  Filter,
} from 'lucide-react'

export function NotificationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'full-list', filter],
    queryFn: async () => {
      const res = await api.get(`/notifications?limit=50&filter=${filter}`)
      return res.data
    },
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

  // Group notifications by date
  const groupNotifications = (items) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(today.getDate() - 7)

    const groups = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: [],
    }

    items.forEach((item) => {
      const date = new Date(item.createdAt)
      if (date >= today) {
        groups.Today.push(item)
      } else if (date >= yesterday) {
        groups.Yesterday.push(item)
      } else if (date >= oneWeekAgo) {
        groups['This Week'].push(item)
      } else {
        groups.Older.push(item)
      }
    })

    return groups
  }

  const grouped = groupNotifications(notifications)

  const getIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-5 h-5 text-voltage-lime fill-true-black" />
      case 'streak_alert':
        return <Flame className="w-5 h-5 text-voltage-lime fill-true-black" />
      case 'quiz':
        return <Brain className="w-5 h-5 text-cyan-spark" />
      default:
        return <Clock className="w-5 h-5 text-ash" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="p-8 rounded-[28px] bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-carbon-ink tracking-tight font-sans">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <Badge variant="lime" className="text-xs font-bold">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-sm text-ash">
            Track study milestones, streak alerts, badge awards, and peer updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            variant="outline"
            className="gap-2 text-xs font-bold shrink-0"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-carbon-ink text-pure-white'
              : 'bg-surface-elevated text-ash hover:text-carbon-ink'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-carbon-ink text-pure-white'
              : 'bg-surface-elevated text-ash hover:text-carbon-ink'
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-voltage-lime border-t-true-black rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-ash">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="rounded-[24px] border-border bg-pure-white p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-ash">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-carbon-ink">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </p>
          <p className="text-xs text-ash max-w-sm mx-auto">
            When you earn badges, maintain streaks, or receive study reminders, they will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([period, items]) => {
            if (items.length === 0) return null

            return (
              <div key={period} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ash px-1">
                  {period}
                </h3>

                <div className="space-y-2">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`rounded-[20px] border transition-all cursor-pointer shadow-sm hover:border-true-black/60 ${
                        !item.isRead
                          ? 'bg-gradient-to-r from-voltage-lime/10 via-pure-white to-pure-white border-voltage-lime/60'
                          : 'bg-pure-white border-border'
                      }`}
                    >
                      <CardContent className="p-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="p-2.5 rounded-[14px] bg-surface-elevated border border-border shrink-0 mt-0.5">
                            {getIcon(item.type)}
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-sm text-carbon-ink">
                                {item.title}
                              </p>
                              {!item.isRead && (
                                <span className="w-2 h-2 rounded-full bg-voltage-lime shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-ash leading-relaxed">
                              {item.message}
                            </p>
                            <p className="text-[11px] text-ash/80 pt-0.5">
                              {new Date(item.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        {item.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 text-xs text-ash hover:text-carbon-ink"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
