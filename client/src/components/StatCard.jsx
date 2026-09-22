import React from 'react';

/**
 * Reusable Stat Card in Craft Docs Scrapbook Style
 */
export const StatCardComponent = ({
  icon,
  label,
  value,
  variant = 'mint', // 'marigold', 'periwinkle', 'mint', 'papaya'
  subtext,
  badge,
  loading = false,
}) => {
  const variantStyles = {
    marigold: {
      iconBg: 'bg-marigold/30 text-amber-900',
      tagBg: 'bg-marigold/20 text-amber-900',
      accentBorder: 'group-hover:border-marigold/60',
    },
    periwinkle: {
      iconBg: 'bg-periwinkle/30 text-indigo-950',
      tagBg: 'bg-periwinkle/20 text-indigo-950',
      accentBorder: 'group-hover:border-periwinkle/60',
    },
    mint: {
      iconBg: 'bg-mint/35 text-emerald-950',
      tagBg: 'bg-mint/20 text-emerald-950',
      accentBorder: 'group-hover:border-mint/60',
    },
    papaya: {
      iconBg: 'bg-papaya/15 text-orange-950',
      tagBg: 'bg-papaya/10 text-orange-900',
      accentBorder: 'group-hover:border-papaya/50',
    },
  };

  const style = variantStyles[variant] || variantStyles.mint;

  if (loading) {
    return (
      <div
        className="relative bg-white rounded-craft-card p-6 shadow-craft-xl border border-ash/40 animate-pulse flex flex-col justify-between overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-full bg-linen" />
          {badge ? <div className="w-14 h-5 rounded-craft-pill bg-linen" /> : null}
        </div>
        <div className="w-20 h-9 rounded bg-linen mb-2" />
        <div className="w-24 h-4 rounded bg-linen mt-1.5" />
        <div className="w-28 h-3.5 rounded bg-linen mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-craft-card p-6 shadow-craft-xl border border-ash/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-craft-md ${style.accentBorder} group overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Pastel Icon Circle */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${style.iconBg} transition-transform group-hover:scale-105`}>
          {icon}
        </div>

        {badge && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-craft-pill ${style.tagBg}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Serif Large Stat Number */}
      <div className="font-serif text-[36px] leading-[1.2] tracking-craft-heading-sm text-ink font-normal">
        {value}
      </div>

      {/* Label & Subtext */}
      <div className="text-[12px] text-stone font-medium uppercase tracking-wider mt-1.5 font-sans">
        {label}
      </div>

      {subtext && (
        <div className="text-[13px] text-graphite font-sans mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
};

export const StatCard = React.memo(StatCardComponent);
export default StatCard;
