import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  HelpCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  MOBILE_NAV_ITEMS,
} from '@/data/navigation';
import { NavLinkItem } from './NavLinkItem';
import { MoreMenu } from './MoreMenu';
import { MobileTopBar } from './MobileTopBar';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { toast } from 'sonner';

export function UniversalNavbar({
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Local collapse state with localStorage memory
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    try {
      return localStorage.getItem('peer_club_nav_collapsed') === 'true';
    } catch (_) {
      return false;
    }
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    setInternalCollapsed(next);
    try {
      localStorage.setItem('peer_club_nav_collapsed', String(next));
    } catch (_) {}
    if (onToggleCollapse) onToggleCollapse(next);
  };

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  const handleOpenHelp = () => {
    toast.info('💡 Need assistance? Check your study notes or open documents to generate AI quizzes!');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Scholar';
  const displayEmail = user?.email || 'scholar@peerclub.edu';
  const initial = displayName.charAt(0).toUpperCase();

  const isCurrentActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 1. MOBILE TOP BAR (<768px) */}
      <MobileTopBar user={user} />

      {/* 2. DESKTOP & TABLET ADAPTIVE SIDEBAR (≥768px) */}
      <aside
        aria-label="Main navigation"
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-white/95 backdrop-blur-xl border-r border-[#edd5c0]/50 z-40 transition-all duration-300 ease-in-out shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex-col justify-between select-none ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Collapse / Expand FinSet Floating Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 rounded-full bg-white border border-[#e1e1e1] shadow-md items-center justify-center text-[#41413f] hover:text-[#030302] hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Top Header & Navigation */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {/* Logo Header */}
          <div className={`p-5 pb-4 border-b border-[#e1e1e1]/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 group ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9bd8a9] to-[#b8caf5] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <svg
                  className="w-5 h-5 text-[#030302]"
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

              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-serif text-lg font-semibold text-[#030302] tracking-tight leading-none">
                    Peer Club
                  </h1>
                  <span className="text-[11px] font-mono text-[#6b7280]">
                    v2.5 · Study
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* User Profile Card (Expanded View) */}
          {!isCollapsed && (
            <div className="px-4 pt-3 pb-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7f7f7]/70 border border-[#e1e1e1]/60 hover:border-[#9bd8a9] transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9bd8a9] to-[#b8caf5] flex items-center justify-center text-[#030302] text-xs font-bold shrink-0 shadow-xs">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#030302] truncate group-hover:text-[#5e6ad2] transition-colors">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-[#6b7280] truncate font-mono">
                    {displayEmail}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Primary Navigation */}
          <nav className="p-3 space-y-1.5 flex-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider px-3 mb-1.5">
                Core Workspace
              </p>
            )}
            {PRIMARY_NAV_ITEMS.map((item) => (
              <NavLinkItem
                key={item.path}
                item={item}
                isActive={isCurrentActive(item.path)}
                isCollapsed={isCollapsed}
              />
            ))}

            {/* Community & Secondary Section */}
            <div className="pt-3 mt-3 border-t border-[#e1e1e1]/50 space-y-1.5">
              {!isCollapsed && (
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider px-3 mb-1.5">
                  Community & Stats
                </p>
              )}
              {SECONDARY_NAV_ITEMS.map((item) => (
                <NavLinkItem
                  key={item.path}
                  item={item}
                  isActive={isCurrentActive(item.path)}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom Utility Actions (Help, Settings, Logout) */}
        <div className="p-3 border-t border-[#e1e1e1]/50 space-y-1">
          {/* Help */}
          <button
            type="button"
            onClick={handleOpenHelp}
            className={`w-full flex items-center transition-all duration-200 rounded-2xl text-[#41413f] hover:bg-[#f7f7f7] hover:text-[#030302] ${
              isCollapsed
                ? 'justify-center h-10 w-10 mx-auto'
                : 'gap-3 px-4 py-2.5 text-xs font-medium'
            }`}
            title={isCollapsed ? 'Help & Guides' : undefined}
          >
            <HelpCircle className="w-4.5 h-4.5 shrink-0 text-[#6b7280]" />
            {!isCollapsed && <span>Help & Guides</span>}
          </button>

          {/* Settings */}
          <Link
            to="/profile"
            className={`w-full flex items-center transition-all duration-200 rounded-2xl text-[#41413f] hover:bg-[#f7f7f7] hover:text-[#030302] ${
              isCollapsed
                ? 'justify-center h-10 w-10 mx-auto'
                : 'gap-3 px-4 py-2.5 text-xs font-medium'
            }`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4.5 h-4.5 shrink-0 text-[#6b7280]" />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center transition-all duration-200 rounded-2xl text-[#ff4500] hover:bg-rose-50 ${
              isCollapsed
                ? 'justify-center h-10 w-10 mx-auto'
                : 'gap-3 px-4 py-2.5 text-xs font-medium'
            }`}
            title={isCollapsed ? 'Log Out' : undefined}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 text-[#ff4500]" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (<768px) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-white/95 backdrop-blur-xl border-t border-[#edd5c0]/50 z-40 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
                active
                  ? 'bg-[#5e6ad2] text-white shadow-xs scale-105'
                  : 'text-[#6b7280] hover:text-[#030302]'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#6b7280]'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Button on Mobile */}
        <button
          type="button"
          onClick={() => setShowMoreMenu((prev) => !prev)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 ${
            showMoreMenu
              ? 'bg-[#5e6ad2] text-white shadow-xs'
              : 'text-[#6b7280] hover:text-[#030302]'
          }`}
        >
          <MoreHorizontal className={`w-5 h-5 ${showMoreMenu ? 'text-white' : 'text-[#6b7280]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            More
          </span>
        </button>

        {/* More Menu Dropdown Popup */}
        <MoreMenu
          isOpen={showMoreMenu}
          onClose={() => setShowMoreMenu(false)}
          onLogout={handleLogout}
          onOpenHelp={handleOpenHelp}
          currentPath={location.pathname}
        />
      </nav>
    </>
  );
}

export default UniversalNavbar;
