import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationIcon } from './NotificationIcon';

export function NotificationCard({ notification, onMarkRead, onAction }) {
  const navigate = useNavigate();

  const isUnread = !notification.isRead;

  const handleCardClick = () => {
    if (isUnread && onMarkRead) {
      onMarkRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - date) / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative rounded-[22px] border transition-all duration-200 p-5 md:p-6 cursor-pointer group ${
        isUnread
          ? 'bg-emerald-50/15 border-l-4 border-l-emerald-500 border-[var(--color-ash)]/70 shadow-xs'
          : 'bg-white border-[var(--color-ash)]/60 hover:border-gray-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <NotificationIcon type={notification.type} />

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-[15px] font-semibold text-[var(--color-ink)] leading-snug group-hover:text-emerald-950 transition-colors">
                {notification.title}
              </h4>
              {isUnread && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              )}
            </div>

            {/* Timestamp & Mark Read Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[var(--color-stone)] whitespace-nowrap">
                {formatTimestamp(notification.createdAt)}
              </span>
              {isUnread && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMarkRead) onMarkRead(notification.id);
                  }}
                  className="w-7 h-7 rounded-full bg-white hover:bg-[var(--color-linen)] border border-[var(--color-ash)]/70 flex items-center justify-center text-[var(--color-stone)] hover:text-emerald-700 transition-colors shadow-xs"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Message Text */}
          <p className="text-sm text-[var(--color-graphite)] leading-relaxed mb-3">
            {notification.message}
          </p>

          {/* Inline Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {notification.actionUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-semibold hover:shadow-xs transition-all"
              >
                <span>{notification.primaryActionLabel || 'View Details'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {notification.secondaryActionLabel && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAction) onAction(notification);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--color-ash)] text-xs font-medium text-[var(--color-graphite)] hover:bg-[var(--color-linen)] transition-colors shadow-xs"
              >
                <span>{notification.secondaryActionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
