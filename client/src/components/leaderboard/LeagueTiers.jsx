import React from 'react';
import { Gem, Trophy, Award, Shield } from 'lucide-react';

export function LeagueTiers() {
  const leagues = [
    {
      title: '💎 Diamond League',
      badge: 'Top 5%',
      hoursReq: '> 40 hrs/week',
      description: 'The highest tier of scholastic dedication and relentless focus.',
      border: 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/40',
      iconColor: 'text-blue-600 bg-blue-100',
      perks: [
        'Exclusive room themes',
        'Golden profile ring',
        'Priority AI generation',
      ],
    },
    {
      title: '🥇 Gold League',
      badge: 'Top 20%',
      hoursReq: '> 25 hrs/week',
      description: 'Consistently maintaining daily momentum and active recall.',
      border: 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/40',
      iconColor: 'text-amber-600 bg-amber-100',
      perks: [
        'Custom quiz limits',
        'Advanced study analytics',
        'Room host privileges',
      ],
    },
    {
      title: '🥈 Silver League',
      badge: 'Top 50%',
      hoursReq: '> 10 hrs/week',
      description: 'Dedicated scholars building strong revision habits.',
      border: 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100/40',
      iconColor: 'text-slate-600 bg-slate-100',
      perks: [
        'Standard member benefits',
        'Group flashcard decks',
        'Weekly rhythm insights',
      ],
    },
    {
      title: '🥉 Bronze League',
      badge: 'Growing',
      hoursReq: '< 10 hrs/week',
      description: 'Embarking on the journey of collaborative peer study.',
      border: 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100/40',
      iconColor: 'text-orange-600 bg-orange-100',
      perks: [
        'Basic study rooms',
        'Practice quizzes',
        'Study buddy matching',
      ],
    },
  ];

  return (
    <div className="mt-12 space-y-6">
      <div>
        <h3 className="font-serif text-[24px] font-normal text-[var(--color-ink)]">
          Study Leagues & Milestones
        </h3>
        <p className="text-xs text-[var(--color-stone)] mt-0.5">
          Progress through tiers based on verified weekly study rhythm
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {leagues.map((league, idx) => (
          <div
            key={idx}
            className={`rounded-[24px] border-2 p-6 transition-all hover:shadow-lg flex flex-col justify-between ${league.border}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-graphite)]">
                  {league.badge}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-black/5 text-[var(--color-stone)]">
                  {league.hoursReq}
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold text-[var(--color-ink)] mb-1.5">
                {league.title}
              </h4>
              <p className="text-xs text-[var(--color-graphite)] leading-relaxed mb-4">
                {league.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-black/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-stone)] block mb-1">
                Tier Perks:
              </span>
              {league.perks.map((perk, pIdx) => (
                <div key={pIdx} className="text-xs text-[var(--color-graphite)] flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
