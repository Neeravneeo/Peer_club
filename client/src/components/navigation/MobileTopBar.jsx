import React from 'react';
import { Link } from 'react-router-dom';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function MobileTopBar({ user }) {
  const displayName = user?.name || user?.email?.split('@')[0] || 'Scholar';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="md:hidden fixed top-3 left-4 right-4 z-40">
      <div className="bg-white/90 backdrop-blur-xl rounded-full border border-[#edd5c0]/50 px-4 py-2.5 flex items-center justify-between shadow-sm">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9bd8a9] to-[#b8caf5] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <svg
              className="w-4.5 h-4.5 text-[#030302]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
          </div>
          <span className="font-serif text-base font-semibold text-[#030302] tracking-tight">
            Peer Club
          </span>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <NotificationBell />

          <Link
            to="/profile"
            aria-label="View user profile"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9bd8a9] to-[#b8caf5] flex items-center justify-center text-[#030302] text-xs font-bold shadow-xs hover:ring-2 hover:ring-[#9bd8a9] transition-all"
          >
            {initial}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default MobileTopBar;
