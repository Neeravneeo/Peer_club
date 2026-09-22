import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * NavLinkItem - Adaptive navigation item with FinSet pill active state and Craft.do styling
 */
export function NavLinkItem({
  item,
  isActive,
  isCollapsed,
  onClick,
  unreadCount = 0,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = item.icon;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <NavLink
        to={item.path}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        className={`group flex items-center w-full transition-all duration-200 select-none ${
          isCollapsed
            ? 'justify-center h-12 w-12 mx-auto rounded-2xl'
            : 'gap-3 px-4 py-3 rounded-2xl'
        } ${
          isActive
            ? 'bg-[#5e6ad2] text-white shadow-[0_4px_16px_rgba(94,106,210,0.35)] scale-[1.01]'
            : 'text-[#41413f] hover:bg-[#f7f7f7] hover:text-[#030302]'
        }`}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <Icon
            className={`transition-transform duration-200 group-hover:scale-110 ${
              isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
            } ${isActive ? 'text-white' : 'text-[#6b7280] group-hover:text-[#030302]'}`}
          />
          {item.hasBadge && unreadCount > 0 && isCollapsed && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ff4500] ring-2 ring-white animate-pulse" />
          )}
        </div>

        {!isCollapsed && (
          <span className="text-sm font-medium tracking-tight truncate flex-1">
            {item.label}
          </span>
        )}

        {!isCollapsed && item.hasBadge && unreadCount > 0 && (
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
              isActive
                ? 'bg-white text-[#5e6ad2]'
                : 'bg-[#ff4500] text-white'
            }`}
          >
            {unreadCount}
          </span>
        )}
      </NavLink>

      {/* Hover Tooltip (Only for Collapsed / Tablet Rail) */}
      {isCollapsed && showTooltip && (
        <div
          role="tooltip"
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-3 py-1.5 rounded-xl bg-[#030302] text-white text-xs font-medium shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          {item.label}
          {item.hasBadge && unreadCount > 0 && ` (${unreadCount})`}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#030302]" />
        </div>
      )}
    </div>
  );
}

export default NavLinkItem;
