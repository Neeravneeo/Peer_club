import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  BookOpen,
  Menu,
  X,
  Home,
  FileText,
  Brain,
  Layers,
  Users,
  Trophy,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export const Topbar = ({ className = '' }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown and mobile menu on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Scholar';
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (_) {
      navigate('/login');
    }
  };

  const navLinks = [
    { label: 'Home', to: '/dashboard', icon: Home },
    { label: 'Documents', to: '/documents', icon: FileText },
    { label: 'AI Quizzes', to: '/quizzes', icon: Brain },
    { label: 'Flashcards', to: '/flashcards', icon: Layers },
    { label: 'Study Rooms', to: '/rooms', icon: Users },
    { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <>
      <header
        className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 md:left-[calc(50%+4.5rem)] lg:left-[calc(50%+6.5rem)] xl:left-[calc(50%+7.5rem)] z-50 w-[94%] max-w-6xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/90 backdrop-blur-xl border border-[var(--color-ash,#e1e1e1)] shadow-craft-subtle flex items-center justify-between transition-all ${className}`}
      >
        {/* Brand Logo (Left) */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-mint/30 border border-mint/60 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg className="w-4.5 h-4.5 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
          </div>
          <span className="font-serif text-[17px] sm:text-[18px] font-semibold text-ink tracking-tight">
            Peer Club
          </span>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell Dropdown Widget */}
          <NotificationBell />

          {/* User Profile Dropdown (Desktop & Tablet) */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-linen transition-colors border border-transparent hover:border-ash/50 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-mint flex items-center justify-center text-ink text-xs font-bold font-sans">
                {initial}
              </div>
              <span className="text-[13px] font-medium text-ink font-sans max-w-[120px] truncate hidden sm:inline-block">
                {displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone" />
            </button>

            {/* User Popover Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-craft-lg border border-ash/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-ash/50 mb-1">
                  <p className="text-[13px] font-semibold text-ink truncate">{displayName}</p>
                  <p className="text-[11px] text-stone truncate">{user?.email || 'Scholar'}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-graphite hover:text-ink hover:bg-linen transition-colors"
                >
                  <User className="w-4 h-4 text-stone" />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-papaya hover:bg-papaya/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-papaya" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle (< 768px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-linen border border-ash/80 flex items-center justify-center text-ink hover:bg-cloud active:scale-95 transition-all cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-start pt-20 px-4 pb-6 animate-in fade-in duration-150">
          <div className="bg-white/95 backdrop-blur-xl border border-ash rounded-3xl p-5 shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto">
            {/* User Info Header */}
            <div className="flex items-center justify-between pb-3 border-b border-ash/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center text-ink text-xs font-bold">
                  {initial}
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink truncate max-w-[180px]">{displayName}</p>
                  <p className="text-[10px] text-stone truncate max-w-[180px]">{user?.email || 'Scholar'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/upload');
                }}
                className="inline-flex items-center gap-1.5 bg-ink text-white px-3.5 py-1.5 rounded-full text-xs font-medium"
              >
                <Upload className="w-3.5 h-3.5 text-mint" />
                <span>Upload</span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-mint/30 text-ink font-semibold border border-mint/60'
                        : 'text-graphite hover:text-ink hover:bg-linen'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-emerald-800' : 'text-stone'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Sign Out */}
            <div className="pt-2 border-t border-ash/60">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-papaya hover:bg-papaya/10 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-papaya" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
