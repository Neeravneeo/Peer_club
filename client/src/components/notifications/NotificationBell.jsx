import React, { useState, useRef, useEffect } from 'react';
import { Bell, ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { NotificationIcon } from './NotificationIcon';
import { SAMPLE_NOTIFICATIONS } from './sampleNotificationsData';

export function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch backend notifications
  const { data } = useQuery({
    queryKey: ['notifications', 'dropdown'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications?limit=10');
        return res.data;
      } catch (err) {
        return null;
      }
    },
    refetchInterval: 30000,
  });

  const serverNotifications = data?.notifications;
  const notificationsList = Array.isArray(serverNotifications) ? serverNotifications : [];

  const unreadCount = data?.unreadCount !== undefined
    ? data.unreadCount
    : notificationsList.filter((n) => !n.isRead).length;

  const filteredItems = activeTab === 'unread'
    ? notificationsList.filter((n) => !n.isRead)
    : notificationsList;

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (item.actionUrl) {
      navigate(item.actionUrl);
    } else {
      navigate('/notifications');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-[var(--color-linen)] hover:bg-[var(--color-cloud)] border border-[var(--color-ash)]/60 flex items-center justify-center text-[var(--color-graphite)] hover:text-[var(--color-ink)] transition-colors shadow-xs"
        title="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white ring-1 ring-rose-300 animate-pulse" />
        )}
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[var(--color-ash)]/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-ash)]/60 bg-[var(--color-linen)]/20">
            <span className="font-serif text-base font-medium text-[var(--color-ink)]">
              Notifications
            </span>

            <div className="flex items-center gap-1 bg-[var(--color-linen)] rounded-full p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white shadow-xs text-[var(--color-ink)]'
                    : 'text-[var(--color-stone)] hover:text-[var(--color-graphite)]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                  activeTab === 'unread'
                    ? 'bg-white shadow-xs text-[var(--color-ink)]'
                    : 'text-[var(--color-stone)] hover:text-[var(--color-graphite)]'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* List of last items */}
          <div className="max-h-[360px] overflow-y-auto p-3 space-y-2">
            {filteredItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-start gap-3 p-3 rounded-[16px] transition-colors cursor-pointer text-left ${
                  !item.isRead ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-[var(--color-linen)]/40'
                }`}
              >
                <NotificationIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h5 className="text-xs font-semibold text-[var(--color-ink)] truncate">
                      {item.title}
                    </h5>
                    {!item.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--color-graphite)] line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer View All Link */}
          <div className="p-3 border-t border-[var(--color-ash)]/60 bg-[var(--color-linen)]/30 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>View All Notifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
