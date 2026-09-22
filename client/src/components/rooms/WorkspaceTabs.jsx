import React from 'react';
import { Folder, Trophy, Users } from 'lucide-react';

export function WorkspaceTabs({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    {
      id: 'vault',
      label: `Shared Vault (${counts.docs || 0})`,
      icon: Folder,
    },
    {
      id: 'leaderboard',
      label: 'Room Leaderboard',
      icon: Trophy,
    },
    {
      id: 'members',
      label: `Members (${counts.members || 0})`,
      icon: Users,
    },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-ash)]/60 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-[14px] text-xs font-bold tracking-wide transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-50 text-emerald-900 border-b-2 border-emerald-600 font-extrabold'
                : 'text-[var(--color-stone)] hover:text-[var(--color-graphite)] hover:bg-[var(--color-linen)]/40'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
