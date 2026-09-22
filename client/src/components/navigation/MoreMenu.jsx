import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { SECONDARY_NAV_ITEMS, UTILITY_NAV_ITEMS } from '@/data/navigation';

export function MoreMenu({
  isOpen,
  onClose,
  onLogout,
  onOpenHelp,
  unreadCount = 0,
  currentPath = '',
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="More navigation options"
      className="absolute bottom-[calc(100%+12px)] left-4 right-4 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-[#edd5c0]/40 p-4 space-y-1.5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="px-3 py-1.5 mb-1 border-b border-[#e1e1e1]/60 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
          More Services
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[#6b7280] hover:text-[#030302] p-1"
        >
          ✕
        </button>
      </div>

      {SECONDARY_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#5e6ad2] text-white shadow-xs'
                : 'text-[#41413f] hover:bg-[#f7f7f7] hover:text-[#030302]'
            }`}
          >
            <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#6b7280]'}`} />
            <span className="flex-1">{item.label}</span>
            {item.hasBadge && unreadCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white text-[#5e6ad2]' : 'bg-[#ff4500] text-white'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>
        );
      })}

      <div className="pt-2 mt-2 border-t border-[#e1e1e1]/60 space-y-1">
        {UTILITY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          if (item.isAction && item.id === 'logout') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#ff4500] hover:bg-rose-50 transition-colors"
              >
                <Icon className="w-4.5 h-4.5 text-[#ff4500]" />
                <span>{item.label}</span>
              </button>
            );
          }

          if (item.id === 'help') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenHelp) onOpenHelp();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#41413f] hover:bg-[#f7f7f7] transition-colors"
              >
                <Icon className="w-4.5 h-4.5 text-[#6b7280]" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#41413f] hover:bg-[#f7f7f7] transition-colors"
            >
              <Icon className="w-4.5 h-4.5 text-[#6b7280]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default MoreMenu;
