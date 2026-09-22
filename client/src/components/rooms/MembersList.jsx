import React from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export function MembersList({ members = [] }) {
  const handleHighFive = (name) => {
    toast.success(`👏 High-five sent to ${name}!`);
  };

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-10 text-xs text-[var(--color-stone)]">
        No other members in this circle yet. Invite your study buddies!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {members.map((member, idx) => {
        const isHost = member.role === 'host' || idx === 0;

        return (
          <div
            key={member.id || idx}
            className="p-5 rounded-[22px] bg-[var(--color-linen)]/40 border border-[var(--color-ash)]/70 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs">
                  <img
                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isHost
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white text-[var(--color-graphite)] border border-[var(--color-ash)]'
                  }`}
                >
                  {isHost ? '👑 Host' : 'Scholar'}
                </span>
              </div>

              <h4 className="font-serif text-base font-bold text-[var(--color-ink)]">
                {member.name}
              </h4>
              <p className="text-xs text-[var(--color-stone)] mt-0.5 mb-3">
                {member.joinedDate || 'Scholar Member'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleHighFive(member.name)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-white hover:bg-rose-50 border border-[var(--color-ash)] text-xs font-semibold text-[var(--color-graphite)] hover:text-rose-600 transition-colors shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>👏 Send High-Five</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
