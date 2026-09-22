import React from 'react';
import { UserRow } from './UserRow';

export function RankingTable({ scholars = [] }) {
  if (!scholars || scholars.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center space-y-2">
        <p className="font-serif text-lg text-[var(--color-ink)]">No Leaderboard Activity Yet</p>
        <p className="text-xs text-[var(--color-stone)]">
          Complete study sessions and quizzes to climb the global leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-[24px] font-normal text-[var(--color-ink)]">
            Global Ranking
          </h3>
          <p className="text-xs text-[var(--color-stone)] mt-0.5">
            Verified focus hours and active recall assessments
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-[var(--color-ash)]/70">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-linen)] border-b border-[var(--color-ash)] text-[11px] font-bold text-[var(--color-graphite)] uppercase tracking-wider">
              <th scope="col" className="px-6 py-4">
                Rank
              </th>
              <th scope="col" className="px-6 py-4">
                Scholar
              </th>
              <th scope="col" className="px-6 py-4">
                Study Hours
              </th>
              <th scope="col" className="px-6 py-4">
                Quizzes
              </th>
              <th scope="col" className="px-6 py-4">
                Active Streak
              </th>
              <th scope="col" className="px-6 py-4">
                Study Points
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Cheers
              </th>
            </tr>
          </thead>
          <tbody>
            {scholars.map((scholar, idx) => (
              <UserRow key={scholar.id || idx} user={scholar} index={idx} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
