import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Brain,
  Layers,
  Users,
  Trophy,
  User,
  Upload,
  Flame,
} from 'lucide-react';
import { api } from '@/lib/api';

export const Sidebar = ({ streakDays = null, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [liveStreak, setLiveStreak] = React.useState(streakDays ?? 0);

  React.useEffect(() => {
    if (streakDays !== null && streakDays !== undefined) {
      setLiveStreak(streakDays);
      return;
    }

    let isMounted = true;
    async function loadStreak() {
      try {
        const res = await api.get('/streak');
        if (res?.data && isMounted) {
          setLiveStreak(res.data.currentStreak ?? 0);
        }
      } catch (_) {}
    }
    loadStreak();

    const handleUpdate = (e) => {
      if (e.detail && isMounted) {
        setLiveStreak(e.detail.currentStreak ?? 0);
      }
    };
    window.addEventListener('peerclub:streak-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('peerclub:streak-updated', handleUpdate);
    };
  }, [streakDays]);

  const displayStreak = liveStreak ?? streakDays ?? 0;

  const navItems = [
    { label: 'Home', to: '/dashboard', icon: Home },
    { label: 'Documents', to: '/documents', icon: FileText },
    { label: 'AI Quizzes', to: '/quizzes', icon: Brain },
    { label: 'Flashcards', to: '/flashcards', icon: Layers },
    { label: 'Study Rooms', to: '/rooms', icon: Users },
    { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <aside
      className={`w-72 shrink-0 bg-[#faf7f2] border-r border-[#e1e1e1]/60 px-5 py-6 flex flex-col justify-between h-screen sticky top-0 overflow-hidden select-none box-border z-30 ${className}`}
    >
      {/* Top Action Area */}
      <div className="shrink-0 mb-4">
        <button
          onClick={() => navigate('/upload')}
          className="w-full bg-[#030302] text-white rounded-full px-5 py-3 text-sm font-semibold hover:bg-[#1a1a1a] hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#9bd8a9] focus-visible:outline-offset-2"
        >
          <Upload className="w-4 h-4 mr-2 text-[#9bd8a9] transition-transform group-hover:-translate-y-0.5" strokeWidth={2} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Navigation Items (Inner scrollable area if height overflows) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1 craft-sidebar">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer font-sans tracking-tight text-[15px] ${
                    isActive
                      ? 'bg-[#9bd8a9]/25 text-[#030302] font-semibold border-l-4 border-[#9bd8a9] pl-3 shadow-xs'
                      : 'text-[#41413f] hover:bg-[#f0ebe3] hover:translate-x-0.5 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive ? 'text-[#030302]' : 'text-[#6b7280]'
                      }`}
                      strokeWidth={2}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Streak Card (Bottom Section - Stays pinned at bottom) */}
      <div className="shrink-0 pt-4 mt-auto">
        <div className="relative bg-gradient-to-br from-[#fde99b]/30 to-[#fde99b]/10 border border-[#fde99b]/40 rounded-2xl p-4">
          <span className="absolute top-2.5 right-3 text-base opacity-60 pointer-events-none select-none">
            ✨
          </span>
          <div className="w-10 h-10 rounded-full bg-[#fde99b]/40 flex items-center justify-center mb-2.5">
            <Flame className="w-5 h-5 text-[#f59e0b]" strokeWidth={2} />
          </div>
          <h3 className="font-serif text-[17px] font-semibold text-[#030302] mb-0.5">
            {displayStreak} Day Streak!
          </h3>
          <p className="text-xs text-[#41413f]">
            Keep it burning today
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
