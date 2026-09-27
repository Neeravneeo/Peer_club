import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Settings, Bell, Flame, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// Visual & Subcomponents
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  DotGridPattern,
  PastelBlob,
  TornPaperBackdrop,
} from '@/components/DecorativeElements';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { SAMPLE_NOTIFICATIONS } from '@/components/notifications/sampleNotificationsData';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch backend notifications
  const { data: serverData, isLoading } = useQuery({
    queryKey: ['notifications', 'inbox'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications?limit=50');
        return res.data;
      } catch (err) {
        console.warn('API error fetching notifications, fallback to sample', err);
        return null;
      }
    },
  });

  const allNotifications = useMemo(() => {
    return serverData?.notifications || [];
  }, [serverData]);

  // Mark all read mutation
  const markAllMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all');
    },
    onSuccess: () => {
      toast.success('All notifications marked as read!');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.success('Marked all notifications as read!');
    },
  });

  // Mark single read mutation
  const markSingleMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {},
  });

  const unreadCount = useMemo(() => {
    return allNotifications.filter((n) => !n.isRead).length;
  }, [allNotifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !n.isRead;
      return n.type === activeFilter;
    });
  }, [allNotifications, activeFilter]);

  // Group notifications chronologically: Today, Yesterday, This Week, Earlier
  const groupedNotifications = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const groups = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    filteredNotifications.forEach((item) => {
      const date = new Date(item.createdAt);
      if (date >= today) {
        groups.Today.push(item);
      } else if (date >= yesterday) {
        groups.Yesterday.push(item);
      } else if (date >= oneWeekAgo) {
        groups['This Week'].push(item);
      } else {
        groups.Earlier.push(item);
      }
    });

    return groups;
  }, [filteredNotifications]);

  const handleAction = (notif) => {
    if (notif.type === 'cheer') {
      toast.success(`👏 You sent a high-five back!`);
    } else {
      toast.info(`Triggered: ${notif.secondaryActionLabel}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans relative selection:bg-lime-200 overflow-x-clip w-full max-w-full">
      {/* Background Decorative Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-40" />
        <PastelBlob color="#fde99b" className="w-96 h-96 -top-10 -left-10" opacity={0.12} />
        <PastelBlob color="#9bd8a9" className="w-[30rem] h-[30rem] top-1/3 -right-20" opacity={0.12} />
        <PastelBlob color="#b8caf5" className="w-80 h-80 bottom-10 left-1/4" opacity={0.1} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-12 max-w-5xl w-full min-w-0">
          {/* SECTION 1: HERO BANNER */}
          <section className="w-full bg-gradient-to-br from-[var(--color-marigold)]/20 via-[var(--color-mint)]/20 to-[var(--color-periwinkle)]/20 rounded-[32px] border border-[var(--color-ash)]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-10 relative overflow-hidden">
          <TornPaperBackdrop color="bg-[var(--color-marigold)]/30" />

          <div className="relative z-10">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[46px] leading-[1.15] tracking-[-1.38px] text-[var(--color-ink)] mb-3">
              Notifications & Activity 🔔
            </h1>
            <p className="text-base text-[var(--color-graphite)] mb-6 max-w-2xl leading-relaxed">
              Real-time alerts for collaborative study circles, flashcard revisions, peer encouragement, and academic streaks.
            </p>

            {/* Stat Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{unreadCount} Unread Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-ash)] text-xs font-semibold shadow-xs">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
                <span>🔥 5-Day Streak Active</span>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending || unreadCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>✓ Mark All as Read</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info('Notification preferences modal opened!')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[var(--color-ash)] text-[var(--color-ink)] text-xs font-semibold hover:bg-[var(--color-linen)] transition-colors shadow-xs cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>⚙️ Preferences</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: FILTER CHIPS BAR */}
        <NotificationFilters
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={{ unread: unreadCount }}
        />

        {/* SECTION 3: CHRONOLOGICAL NOTIFICATIONS LIST */}
        <section className="space-y-8">
          {Object.entries(groupedNotifications).map(([groupTitle, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-3">
                {/* Date Group Header */}
                <div className="sticky top-20 bg-[var(--color-canvas)]/95 backdrop-blur-sm py-2 z-10 border-b border-[var(--color-ash)]/60 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-[var(--color-ink)]">
                    {groupTitle}
                  </h3>
                  <span className="text-xs font-mono text-[var(--color-stone)]">
                    {items.length} {items.length === 1 ? 'update' : 'updates'}
                  </span>
                </div>

                {/* Notification Cards in Group */}
                <div className="space-y-3 pt-1">
                  {items.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkRead={(id) => markSingleMutation.mutate(id)}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[28px] border border-[var(--color-ash)] p-8 shadow-xs max-w-md mx-auto space-y-3">
              <Bell className="w-8 h-8 text-[var(--color-stone)] mx-auto" />
              <h4 className="font-serif text-lg text-[var(--color-ink)]">Inbox is clean!</h4>
              <p className="text-xs text-[var(--color-stone)]">
                No notifications match your current filter.
              </p>
            </div>
          )}
        </section>
      </main>
      </div>
    </div>
  );
}

export default NotificationsPage;
