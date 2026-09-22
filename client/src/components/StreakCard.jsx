import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Flame } from 'lucide-react';
import { getStreakMotivationalText } from '@/utils/dateUtils';
import { toast } from 'sonner';

/**
 * Global helper to record streak activity across Peer Club
 * Can be called from any component (Quiz, Flashcard, Upload, Session)
 * @param {'quiz'|'flashcard'|'document'|'session'|string} activityType
 */
export async function triggerStreakActivity(activityType = 'study') {
  try {
    const res = await api.post('/streak/update', { activityType });
    const data = res?.data;

    // Dispatch global event for instant UI sync
    window.dispatchEvent(
      new CustomEvent('peerclub:streak-updated', {
        detail: { ...data, activityType },
      })
    );

    if (data?.incremented) {
      toast.success(data.message || `🔥 Streak updated to ${data.currentStreak} days!`, {
        description: `Great job completing your ${activityType} activity today.`,
      });
    }

    return data;
  } catch (err) {
    console.warn('[StreakCard] streak update notice:', err?.message || err);
    return null;
  }
}

/**
 * StreakCard Component
 * Seamlessly matches the styling of other StatCards:
 * - Pure white background: bg-white rounded-craft-card p-6 shadow-craft-xl border border-ash/40
 * - Amber flame circle icon when active, muted stone circle when inactive
 * - "Best: Xd" pill badge (dynamic per user)
 * - Large serif stat number (font-serif text-[36px])
 * - Subtitle: "STUDY STREAK"
 * - Dynamic active state & motivational subtext
 */
export function StreakCardComponent({
  className = '',
  loading: externalLoading,
  streakData: externalStreakData,
  initialData = null,
}) {
  const [internalStreakData, setInternalStreakData] = useState(
    externalStreakData || initialData || {
      currentStreak: 0,
      bestStreak: 0,
      lastVisit: null,
      isActive: false,
    }
  );
  const [internalLoading, setInternalLoading] = useState(
    externalLoading !== undefined ? externalLoading : !externalStreakData && !initialData
  );

  // Sync externalStreakData when provided by parent
  useEffect(() => {
    if (externalStreakData) {
      setInternalStreakData({
        currentStreak: Number(externalStreakData.currentStreak) || 0,
        bestStreak: Number(externalStreakData.bestStreak) || 0,
        lastVisit: externalStreakData.lastVisit || null,
        isActive: Boolean(externalStreakData.isActive),
      });
    }
  }, [externalStreakData]);

  const fetchStreak = useCallback(async () => {
    try {
      const res = await api.get('/streak');
      if (res?.data) {
        setInternalStreakData({
          currentStreak: Number(res.data.currentStreak) || 0,
          bestStreak: Number(res.data.bestStreak) || 0,
          lastVisit: res.data.lastVisit || null,
          isActive: Boolean(res.data.isActive),
        });
      }
    } catch (err) {
      console.warn('[StreakCard] GET /api/streak notice:', err?.message || err);
    } finally {
      setInternalLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch internally if parent did NOT supply streakData
    if (!externalStreakData && !initialData) {
      fetchStreak();
    }

    // Listen for streak updates triggered anywhere in the app
    const handleStreakUpdated = (e) => {
      if (e.detail) {
        setInternalStreakData((prev) => ({
          ...prev,
          currentStreak: Number(e.detail.currentStreak) || 0,
          bestStreak: Number(e.detail.bestStreak) || 0,
          isActive: Boolean(e.detail.isActive),
          lastVisit: e.detail.lastVisit || prev.lastVisit,
        }));
      } else {
        fetchStreak();
      }
    };

    window.addEventListener('peerclub:streak-updated', handleStreakUpdated);
    return () => {
      window.removeEventListener('peerclub:streak-updated', handleStreakUpdated);
    };
  }, [fetchStreak, externalStreakData, initialData]);

  const isLoading = typeof externalLoading === 'boolean' ? externalLoading : internalLoading;
  const streakData = externalStreakData || internalStreakData;

  const current = Number(streakData.currentStreak) || 0;
  const best = Number(streakData.bestStreak) || 0;
  // A streak is genuinely active only when current streak is > 0 and isActive is true
  const active = current > 0 && Boolean(streakData.isActive);
  const motivational = getStreakMotivationalText(current);

  if (isLoading) {
    return (
      <div
        className={`relative bg-white rounded-craft-card p-6 shadow-craft-xl border border-ash/40 animate-pulse flex flex-col justify-between ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-full bg-linen" />
          <div className="w-16 h-5 rounded-craft-pill bg-linen" />
        </div>
        <div className="w-16 h-9 rounded bg-linen mb-2" />
        <div className="w-24 h-4 rounded bg-linen mt-1.5" />
        <div className="w-32 h-3.5 rounded bg-linen mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-craft-card p-6 shadow-craft-xl border border-ash/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-craft-md ${
        active ? 'group-hover:border-marigold/60' : 'group-hover:border-ash/60'
      } group overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Amber Fire Icon Circle (active) or subtle muted circle (inactive) */}
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
            active
              ? 'bg-marigold/30 text-amber-900 shadow-xs'
              : 'bg-linen text-stone/60 border border-ash/30'
          }`}
        >
          <Flame
            className={`w-5 h-5 ${
              active
                ? 'text-[#d97706] fill-[#f59e0b]/25'
                : 'text-stone/50'
            }`}
            strokeWidth={2}
          />
        </div>

        {/* Dynamic Best Streak Pill Badge */}
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-craft-pill transition-colors ${
            active
              ? 'bg-marigold/20 text-amber-900'
              : 'bg-linen text-stone border border-ash/30'
          }`}
        >
          Best: {best}d
        </span>
      </div>

      {/* Serif Large Stat Number */}
      <div className="font-serif text-[36px] leading-[1.2] tracking-craft-heading-sm text-ink font-normal">
        {current}d
      </div>

      {/* Label */}
      <div className="text-[12px] text-stone font-medium uppercase tracking-wider mt-1.5 font-sans">
        Study Streak
      </div>

      {/* Subtext / Active state */}
      <div className="text-[13px] text-graphite font-sans mt-1">
        {active ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-700 font-semibold text-[12px]">Active</span>
            <span className="text-stone font-normal text-[12px]">• {motivational}</span>
          </span>
        ) : (
          <span className="text-stone">Start your streak today!</span>
        )}
      </div>
    </div>
  );
}

export const StreakCard = React.memo(StreakCardComponent);
export default StreakCard;
