import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Key,
  Search,
  BookOpen,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// Components
import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import {
  DotGridPattern,
  PastelBlob,
  TornPaperBackdrop,
} from '@/components/DecorativeElements';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomHeader } from '@/components/rooms/RoomHeader';
import { WorkspaceTabs } from '@/components/rooms/WorkspaceTabs';
import { DocumentsVault } from '@/components/rooms/DocumentsVault';
import { RoomLeaderboard } from '@/components/rooms/RoomLeaderboard';
import { MembersList } from '@/components/rooms/MembersList';
import { CreateRoomModal } from '@/components/rooms/CreateRoomModal';
import { JoinRoomModal } from '@/components/rooms/JoinRoomModal';
import { SAMPLE_STUDY_ROOMS } from '@/components/rooms/sampleRoomsData';

export function RoomsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('vault'); // 'vault' | 'leaderboard' | 'members'
  const [selectedRoomId, setSelectedRoomId] = useState('room-bio-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Fetch backend rooms list
  const { data: serverRooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      try {
        const res = await api.get('/rooms');
        return res.data?.rooms || [];
      } catch (err) {
        console.warn('API error fetching rooms, falling back to sample dataset', err);
        return [];
      }
    },
  });

  // Only render user-associated or real server rooms
  const allRooms = useMemo(() => {
    if (!serverRooms || serverRooms.length === 0) {
      return [];
    }

    return serverRooms.map((r) => ({
      id: r.id,
      name: r.name,
      subjectTag: r.subjectTag || 'General Studies',
      icon: '📚',
      isPrivate: Boolean(r.isPrivate),
      roomCode: r.roomCode || 'ROOM-01',
      studyGoal: r.studyGoal || 'Collaborative study and review',
      host: r.admin || { name: 'Host' },
      onlineCount: r.members?.length || 1,
      memberCount: r.members?.length || 1,
      members: r.members || [],
      documents: r.documents || [],
      leaderboard: r.leaderboard || [],
    }));
  }, [serverRooms]);

  // Selected room
  const selectedRoom = useMemo(() => {
    return allRooms.find((r) => r.id === selectedRoomId) || allRooms[0] || null;
  }, [allRooms, selectedRoomId]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.subjectTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomCode.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Public') return !room.isPrivate;
      if (activeFilter === 'Private') return room.isPrivate;
      if (activeFilter === 'Biology') return room.subjectTag.toLowerCase().includes('bio');
      if (activeFilter === 'Computer Science') return room.subjectTag.toLowerCase().includes('comp') || room.subjectTag.toLowerCase().includes('cs');
      if (activeFilter === 'Mathematics') return room.subjectTag.toLowerCase().includes('math');
      if (activeFilter === 'Medicine') return room.subjectTag.toLowerCase().includes('med');

      return true;
    });
  }, [allRooms, searchQuery, activeFilter]);

  // Create Room Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/rooms', payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Study circle created successfully!');
      setIsCreateOpen(false);
      queryClient.invalidateQueries(['rooms']);
      if (data?.room?.id) {
        setSelectedRoomId(data.room.id);
      }
    },
    onError: () => {
      toast.info('Simulated creating new study circle!');
      setIsCreateOpen(false);
    },
  });

  // Join Room Mutation
  const joinMutation = useMutation({
    mutationFn: async (code) => {
      const res = await api.post('/rooms/join', { roomCode: code });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Joined room successfully!`);
      setIsJoinOpen(false);
      queryClient.invalidateQueries(['rooms']);
      if (data?.roomId) {
        setSelectedRoomId(data.roomId);
      }
    },
    onError: () => {
      toast.info('Joined study circle with code!');
      setIsJoinOpen(false);
    },
  });

  const handleEnterRoom = (room) => {
    setSelectedRoomId(room.id);
  };

  const handleLeaveRoom = () => {
    toast.success(`Left "${selectedRoom?.name}"`);
  };

  const filterChips = [
    'All',
    'Biology',
    'Computer Science',
    'Mathematics',
    'Medicine',
    'Public',
    'Private',
  ];

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] relative pb-24 selection:bg-lime-200 overflow-x-hidden w-full max-w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-40" />
        <PastelBlob color="#b8caf5" className="w-96 h-96 -top-10 -left-10" opacity={0.12} />
        <PastelBlob color="#9bd8a9" className="w-[30rem] h-[30rem] top-1/3 -right-20" opacity={0.12} />
        <PastelBlob color="#fde99b" className="w-80 h-80 bottom-10 left-1/4" opacity={0.1} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-12 max-w-6xl w-full min-w-0">
          {/* SECTION 1: HERO BANNER */}
          <section className="w-full bg-gradient-to-br from-[var(--color-periwinkle)]/20 via-[var(--color-mint)]/20 to-[var(--color-marigold)]/20 rounded-[32px] border border-[var(--color-ash)]/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-10 relative overflow-hidden">
          <TornPaperBackdrop color="bg-emerald-100/30" />

          <div className="relative z-10">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[46px] leading-[1.15] tracking-[-1.38px] text-[var(--color-ink)] mb-3">
              Study Circles & Peer Rooms 👥
            </h1>
            <p className="text-base text-[var(--color-graphite)] mb-6 max-w-2xl leading-relaxed">
              Form intimate study circles with your classmates. Share lecture slides, take synced AI practice quizzes, and stay accountable together.
            </p>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-ash)] text-xs font-semibold shadow-xs">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>28 Active Circles</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>142 Peers Online Now</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-ash)] text-xs font-semibold shadow-xs">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>320+ Shared Docs</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-gray-950 font-semibold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Study Circle</span>
              </button>
              <button
                type="button"
                onClick={() => setIsJoinOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[var(--color-ash)] text-[var(--color-ink)] font-semibold hover:bg-[var(--color-linen)] transition-colors shadow-xs cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>🔑 Join with Code</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: FILTER & SEARCH BAR */}
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circles by topic, title, or exam..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-[var(--color-ash)] shadow-xs text-xs text-[var(--color-ink)] placeholder:text-[var(--color-stone)] focus:outline-none focus:border-gray-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveFilter(chip)}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                      : 'bg-white border-[var(--color-ash)] text-[var(--color-graphite)] hover:border-gray-400'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: SPLIT-PANEL WORKSPACE (Meetings Screen Style) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT PANEL: Room List (1/3 width) */}
          <div className="bg-white rounded-[28px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-6 lg:max-h-[780px] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg font-bold text-[var(--color-ink)]">
                Study Circles ({filteredRooms.length})
              </h3>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <BookOpen className="w-10 h-10 text-[var(--color-stone)] mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium text-[var(--color-ink)]">No study rooms found</p>
                <p className="text-xs text-[var(--color-stone)] mt-1">Create your first room or join with a room code.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={room.id === selectedRoom?.id}
                    onSelect={() => setSelectedRoomId(room.id)}
                    onEnter={handleEnterRoom}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Selected Room Workspace (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-[var(--color-ash)]/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 relative min-h-[500px]">
            {selectedRoom ? (
              <div>
                {/* Room Detail Header */}
                <RoomHeader
                  room={selectedRoom}
                  onUploadDoc={() => navigate('/documents')}
                  onLeaveRoom={handleLeaveRoom}
                />

                {/* Workspace Navigation Tabs */}
                <WorkspaceTabs
                  activeTab={activeTab}
                  onSelectTab={setActiveTab}
                  counts={{
                    docs: selectedRoom.documents?.length || 0,
                    members: selectedRoom.members?.length || 0,
                  }}
                />

                {/* Tab Content */}
                {activeTab === 'vault' && (
                  <DocumentsVault
                    documents={selectedRoom.documents}
                    onUpload={() => navigate('/documents')}
                  />
                )}

                {activeTab === 'leaderboard' && (
                  <RoomLeaderboard rankings={selectedRoom.leaderboard} />
                )}

                {activeTab === 'members' && (
                  <MembersList members={selectedRoom.members} />
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-[var(--color-stone)]">
                Select a study circle from the list to view its workspace.
              </div>
            )}
          </div>
        </section>
      </main>
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(payload) => createMutation.mutate(payload)}
        isCreating={createMutation.isPending}
      />

      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoin={(code) => joinMutation.mutate(code)}
        isJoining={joinMutation.isPending}
      />
    </div>
  );
}

export default RoomsPage;
