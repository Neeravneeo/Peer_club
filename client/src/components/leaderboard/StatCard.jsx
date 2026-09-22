import React from 'react';

export function StatCard({ label, value, icon: Icon, iconColor = 'text-emerald-600', subtext }) {
  return (
    <div className="bg-white rounded-[20px] border border-[var(--color-ash)]/70 shadow-xs p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold font-sans text-[var(--color-ink)] tracking-tight">
          {value}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-[var(--color-linen)] flex items-center justify-center">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>
      <div className="text-xs font-semibold text-[var(--color-graphite)] mt-1.5 uppercase tracking-wider">
        {label}
      </div>
      {subtext && (
        <div className="text-[11px] text-[var(--color-stone)] mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
}
