import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ArrowUpRight, Crown, DoorOpen } from 'lucide-react';

export const DEFAULT_ADMIN_ROOMS = [
  {
    id: 'room-1',
    name: 'Organic Chemistry Study Cell',
    roomCode: '#OCH101',
    membersCount: 8,
    isAdmin: true,
  },
  {
    id: 'room-2',
    name: 'LeetCode Daily Peer Room',
    roomCode: '#LTC500',
    membersCount: 16,
    isAdmin: true,
  },
];

export const DEFAULT_JOINED_ROOMS = [
  {
    id: 'room-3',
    name: 'Calculus & Linear Algebra Vault',
    roomCode: '#MTH202',
    membersCount: 24,
    isAdmin: false,
  },
  {
    id: 'room-4',
    name: 'Medical Biochemistry Review',
    roomCode: '#BIO301',
    membersCount: 11,
    isAdmin: false,
  },
];

/**
 * StudyRoomsSection Component
 * Displays user's administered and joined peer study rooms.
 */
export const StudyRoomsSection = ({
  adminRooms = DEFAULT_ADMIN_ROOMS,
  joinedRooms = DEFAULT_JOINED_ROOMS,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('administered'); // 'administered' | 'joined'

  const currentRooms = activeTab === 'administered' ? adminRooms : joinedRooms;

  return (
    <div className="bg-white rounded-[24px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-6 sm:p-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-serif text-24px leading-[1.4] tracking-[-0.72px] text-[var(--color-ink)] flex items-center gap-2.5 font-normal">
          <Users className="w-6 h-6 text-indigo-700" />
          <span>Study Rooms & Community</span>
        </h2>
        <div className="w-12 h-0.5 bg-[var(--color-periwinkle)] rounded-full mt-2" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--color-ash)]/60 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('administered')}
          className={`px-4 py-2 text-sm font-medium rounded-t-[12px] cursor-pointer transition-colors ${
            activeTab === 'administered'
              ? 'bg-[var(--color-periwinkle)]/25 text-[var(--color-ink)] font-semibold border-b-2 border-indigo-600'
              : 'text-[var(--color-stone)] hover:text-[var(--color-graphite)]'
          }`}
        >
          Administered ({adminRooms.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('joined')}
          className={`px-4 py-2 text-sm font-medium rounded-t-[12px] cursor-pointer transition-colors ${
            activeTab === 'joined'
              ? 'bg-[var(--color-periwinkle)]/25 text-[var(--color-ink)] font-semibold border-b-2 border-indigo-600'
              : 'text-[var(--color-stone)] hover:text-[var(--color-graphite)]'
          }`}
        >
          Joined ({joinedRooms.length})
        </button>
      </div>

      {/* Room List */}
      <div className="space-y-3">
        {currentRooms.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--color-stone)] font-sans italic bg-[var(--color-linen)]/40 rounded-[14px]">
            No {activeTab} study rooms found.
          </div>
        ) : (
          currentRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 rounded-[14px] bg-[var(--color-linen)]/50 border border-[var(--color-ash)]/60 hover:shadow-xs hover:border-[var(--color-periwinkle)]/60 transition-all group"
            >
              <div className="flex items-center min-w-0 pr-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-periwinkle)]/30 border border-[var(--color-periwinkle)]/50 flex items-center justify-center mr-3 shrink-0">
                  <DoorOpen className="w-5 h-5 text-indigo-800" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-[var(--color-ink)] truncate font-sans group-hover:text-black">
                    {room.name}
                  </h4>
                  <p className="text-xs text-[var(--color-stone)] mt-0.5">
                    {room.roomCode} • {room.membersCount || 1} members
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {room.isAdmin && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-marigold)]/35 text-[var(--color-ink)] text-xs font-semibold border border-amber-300">
                    <Crown className="w-3 h-3 text-amber-700" />
                    <span>Admin</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                  className="px-4 py-1.5 rounded-full bg-[var(--color-ink)] text-white text-xs font-medium hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <span>Go to Room</span>
                  <ArrowUpRight className="w-3 h-3 text-[var(--color-mint)]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Room Link */}
      <div className="pt-4 border-t border-[var(--color-ash)]/50 mt-5">
        <button
          type="button"
          onClick={() => navigate('/rooms')}
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-azure)] hover:underline cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Study Room</span>
        </button>
      </div>
    </div>
  );
};

export default StudyRoomsSection;
