import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { UniversalNavbar } from '@/components/navigation';

/**
 * AppShell - Universal layout wrapper providing responsive sidebar/rail/bottom-nav
 */
export function AppShell() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('peer_club_nav_collapsed') === 'true';
    } catch (_) {
      return false;
    }
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-canvas,#fff3e7)] text-[var(--color-ink,#030302)] flex flex-col relative selection:bg-emerald-500/20 selection:text-emerald-950">
      {/* Universal Navigation System */}
      <UniversalNavbar
        isCollapsed={isCollapsed}
        onToggleCollapse={setIsCollapsed}
      />

      {/* Main Content Area with Adaptive Sidebar Margins */}
      <div
        className={`flex-1 flex flex-col w-full max-w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:pl-20' : 'md:pl-20 lg:pl-72'
        } pt-16 md:pt-0 pb-20 md:pb-0`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AppShell;
