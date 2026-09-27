import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BookOpen,
  Flame,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Plus,
  X,
  FileText,
  HelpCircle,
  Layers
} from 'lucide-react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

import { Topbar } from '@/components/Topbar';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import {
  DotGridPattern,
  PastelBlob,
  TornPaperBackdrop,
  HandDrawnUnderline,
} from '@/components/DecorativeElements';
import { FilterBar } from '@/components/flashcards/FilterBar';
import { DeckGrid } from '@/components/flashcards/DeckGrid';
import { SAMPLE_FLASHCARD_DECKS } from '@/components/flashcards/sampleDecksData';

/**
 * FlashcardsHub Component
 * Main Flashcard Decks listing page in Craft.do scrapbook aesthetic.
 */
export function FlashcardsHub() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Decks');

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isNewDeckModalOpen, setIsNewDeckModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  // New custom deck form state
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('Computer Science');
  const [firstQuestion, setFirstQuestion] = useState('');
  const [firstAnswer, setFirstAnswer] = useState('');

  // 1. Fetch User Decks from API / Supabase
  const { data: serverDecks, isLoading } = useQuery({
    queryKey: ['flashcard-decks', user?.id],
    queryFn: async () => {
      let fetched = [];
      try {
        const res = await api.get('/flashcards');
        if (Array.isArray(res?.data?.flashcardSets) && res.data.flashcardSets.length > 0) {
          fetched = res.data.flashcardSets.map((s) => ({
            id: s.id,
            title: s.title || `${s.document?.name || 'Study'} Flashcards`,
            subject: s.subject || 'Study Resources',
            cardCount: s.stats?.totalCards || s.cards?.length || 10,
            knownCount: s.stats?.knownCount || 0,
            revisitCount: s.stats?.revisitCount || 0,
            masteryPercentage: s.stats?.masteryPercentage || 0,
            lastStudied: s.createdAt ? `Created ${new Date(s.createdAt).toLocaleDateString()}` : 'Recently',
            cards: s.cards || [],
          }));
        } else if (Array.isArray(res?.data?.sets) && res.data.sets.length > 0) {
          fetched = res.data.sets;
        }
      } catch (_) {
        // Fallback to direct Supabase query
        if (user?.id) {
          const { data, error } = await supabase
            .from('documents')
            .select('id, file_name, created_at, flashcards(*)')
            .eq('uploaded_by', user.id);

          if (data && !error && data.length > 0) {
            fetched = data
              .filter((d) => d.flashcards && d.flashcards.length > 0)
              .map((d) => {
                const known = d.flashcards.filter((c) => c.status === 'known').length;
                return {
                  id: d.id,
                  title: `${d.file_name} Flashcards`,
                  subject: 'General Studies',
                  cardCount: d.flashcards.length,
                  knownCount: known,
                  revisitCount: d.flashcards.length - known,
                  masteryPercentage: Math.round((known / d.flashcards.length) * 100),
                  lastStudied: 'Recent',
                  cards: d.flashcards.map((c) => ({
                    id: c.id,
                    front: c.question,
                    back: c.answer,
                    status: c.status || 'revisit',
                  })),
                };
              });
          }
        }
      }

      return fetched;
    },
  });

  // Local Decks state initialized to empty (only user-generated decks)
  const [localDecks, setLocalDecks] = useState([]);

  const allDecks = useMemo(() => {
    if (serverDecks && serverDecks.length > 0) {
      const serverIds = new Set(serverDecks.map((d) => d.id));
      const filteredLocal = localDecks.filter((d) => !serverIds.has(d.id));
      return [...serverDecks, ...filteredLocal];
    }
    return localDecks;
  }, [serverDecks, localDecks]);

  // Aggregate Metrics
  const totalCardsMastered = useMemo(() => {
    return allDecks.reduce((sum, d) => sum + (d.knownCount || 0), 0);
  }, [allDecks]);

  const avgRetention = useMemo(() => {
    if (allDecks.length === 0) return 0;
    const totalPercentage = allDecks.reduce((sum, d) => sum + (d.masteryPercentage || 0), 0);
    return Math.round(totalPercentage / allDecks.length);
  }, [allDecks]);

  // Filter & Search Logic
  const filteredDecks = useMemo(() => {
    let result = [...allDecks];

    // Subject Chip filter
    if (activeFilter !== 'All Decks') {
      if (activeFilter === 'Needs Review') {
        result = result.filter((d) => (d.masteryPercentage || 0) < 70);
      } else {
        result = result.filter(
          (d) => d.subject?.toLowerCase() === activeFilter.toLowerCase()
        );
      }
    }

    // Search input filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.subject.toLowerCase().includes(q) ||
          (d.cards && d.cards.some((c) => c.front?.toLowerCase().includes(q) || c.back?.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [allDecks, activeFilter, searchQuery]);

  // Handlers
  const handleStudyDeck = (deck) => {
    navigate(`/flashcards/${deck.id}/study`);
  };

  const handleDeleteDeck = (deck) => {
    setLocalDecks((prev) => prev.filter((d) => d.id !== deck.id));
    toast.success(`Deleted deck "${deck.title}"`);
    queryClient.invalidateQueries({ queryKey: ['flashcard-decks'] });
  };

  const handleEditDeck = (deck) => {
    setEditingDeck(deck);
    setEditTitleInput(deck.title);
  };

  const handleSaveRename = () => {
    if (!editingDeck || !editTitleInput.trim()) return;
    setLocalDecks((prev) =>
      prev.map((d) => (d.id === editingDeck.id ? { ...d, title: editTitleInput.trim() } : d))
    );
    toast.success('Deck renamed successfully');
    setEditingDeck(null);
  };

  const handleCreateCustomDeck = (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) {
      toast.error('Please enter a deck title');
      return;
    }

    const newDeck = {
      id: `custom-deck-${Date.now()}`,
      title: `${newDeckTitle.trim()} 📝`,
      subject: newDeckSubject,
      cardCount: 1,
      knownCount: 0,
      revisitCount: 1,
      masteryPercentage: 0,
      lastStudied: 'Just created',
      cards: [
        {
          id: `card-${Date.now()}`,
          subject: newDeckSubject,
          front: firstQuestion.trim() || 'Key Concept Question',
          back: firstAnswer.trim() || 'Comprehensive answer and definition.',
          status: 'revisit',
        },
      ],
    };

    setLocalDecks((prev) => [newDeck, ...prev]);
    setIsNewDeckModalOpen(false);
    setNewDeckTitle('');
    setFirstQuestion('');
    setFirstAnswer('');
    toast.success('New flashcard deck created!');
  };

  // Generate Deck Mutation from Doc
  const generateDeckMutation = useMutation({
    mutationFn: async () => {
      // Navigate to upload or trigger AI generation
      navigate('/upload');
    },
  });

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] relative overflow-x-clip w-full max-w-full selection:bg-[var(--color-mint)]/50 selection:text-[var(--color-ink)] flex flex-col">
      {/* Decorative Scrapbook Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-30" />
        <PastelBlob color="var(--color-mint)" className="w-96 h-96 -top-20 -left-20" opacity={0.12} />
        <PastelBlob color="var(--color-marigold)" className="w-96 h-96 top-40 -right-20" opacity={0.12} />
        <PastelBlob color="var(--color-periwinkle)" className="w-96 h-96 bottom-20 left-1/3" opacity={0.10} />
      </div>

      {/* Fixed Floating Topbar */}
      <Topbar />

      {/* Main Layout Container with Sidebar */}
      <div className="flex flex-1 min-h-screen w-full relative z-10 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        {/* Main Content Area (PART 4 to 6) */}
        <main className="flex-1 pt-24 px-4 sm:px-6 md:px-10 pb-20 max-w-6xl w-full min-w-0">
          {/* SECTION 1: HERO BANNER */}
          <section className="w-full bg-gradient-to-br from-[var(--color-periwinkle)]/25 via-[var(--color-mint)]/20 to-[var(--color-marigold)]/25 rounded-[32px] border border-[var(--color-ash)]/60 shadow-[var(--shadow-xl)] p-8 md:p-12 mb-10 relative overflow-hidden select-none">
          <TornPaperBackdrop color="bg-[var(--color-mint)]/20" className="hidden sm:block" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/90 border border-white/60 flex items-center justify-center text-indigo-900 shadow-xs">
                <BookOpen className="w-5 h-5 text-[var(--color-azure)]" />
              </div>
              <h1 className="font-serif text-[34px] sm:text-[42px] md:text-[46px] leading-[1.1] tracking-[-1.38px] text-[var(--color-ink)] font-normal">
                Flashcard Vault 📚
              </h1>
            </div>

            <div className="-mt-1 mb-2">
              <HandDrawnUnderline className="w-40 h-3 text-[var(--color-mint)]" />
            </div>

            <p className="text-sm sm:text-base text-[var(--color-graphite)] mb-6 max-w-2xl font-sans">
              Harness active recall and spaced repetition to lock study concepts into long-term memory.
            </p>

            {/* Metric Pills */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Streak */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[var(--color-marigold)] text-[var(--color-ink)] text-xs sm:text-sm font-semibold shadow-xs">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>5-Day Streak</span>
              </div>

              {/* Cards Mastered */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[var(--color-mint)] text-[var(--color-ink)] text-xs sm:text-sm font-semibold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{totalCardsMastered} Cards Mastered</span>
              </div>

              {/* Retention Rate */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[var(--color-periwinkle)] text-[var(--color-ink)] text-xs sm:text-sm font-semibold shadow-xs">
                <TrendingUp className="w-4 h-4 text-indigo-800" />
                <span>{avgRetention}% Avg Retention</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FILTER & ACTION BAR */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          onGenerateFromDoc={() => setIsGenerateModalOpen(true)}
          onNewCustomDeck={() => setIsNewDeckModalOpen(true)}
        />

        {/* SECTION 3: FLASHCARD DECKS GRID */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl sm:text-24px tracking-[-0.72px] text-[var(--color-ink)] font-normal">
              {activeFilter === 'All Decks' ? 'All Flashcard Decks' : `${activeFilter} Decks`}
            </h2>
            <span className="text-xs text-[var(--color-stone)] font-medium font-sans">
              {filteredDecks.length} deck{filteredDecks.length === 1 ? '' : 's'} available
            </span>
          </div>

          <DeckGrid
            decks={filteredDecks}
            onStudyDeck={handleStudyDeck}
            onEditDeck={handleEditDeck}
            onDeleteDeck={handleDeleteDeck}
            onCreateDeckClick={() => setIsNewDeckModalOpen(true)}
          />
        </section>
      </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: GENERATE FROM DOC MODAL                             */}
      {/* ============================================================ */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-[var(--color-ash)] shadow-craft-xl relative">
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[var(--color-stone)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-linen)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[var(--color-periwinkle)]/35 border border-[var(--color-periwinkle)] flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-indigo-900" />
            </div>

            <h3 className="font-serif text-2xl text-[var(--color-ink)] mb-2 font-normal">
              Extract Flashcards with AI
            </h3>
            <p className="text-sm text-[var(--color-graphite)] mb-6 font-sans">
              Select an existing study note or upload a PDF to extract high-yield active recall flashcard questions.
            </p>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsGenerateModalOpen(false);
                  navigate('/upload');
                }}
                className="w-full p-4 rounded-[16px] bg-[var(--color-linen)]/60 hover:bg-[var(--color-linen)] border border-[var(--color-ash)] flex items-center gap-3 text-left transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-mint)]/30 flex items-center justify-center text-emerald-950 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-black">
                    Upload Notes / PDF
                  </h4>
                  <p className="text-xs text-[var(--color-stone)]">
                    Parse lecture slides or handouts with n8n AI
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsGenerateModalOpen(false);
                  navigate('/documents');
                }}
                className="w-full p-4 rounded-[16px] bg-[var(--color-linen)]/60 hover:bg-[var(--color-linen)] border border-[var(--color-ash)] flex items-center gap-3 text-left transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-marigold)]/40 flex items-center justify-center text-amber-950 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-black">
                    Pick from Documents Vault
                  </h4>
                  <p className="text-xs text-[var(--color-stone)]">
                    Generate from your saved Craft documents
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: NEW CUSTOM DECK MODAL                               */}
      {/* ============================================================ */}
      {isNewDeckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-[var(--color-ash)] shadow-craft-xl relative">
            <button
              onClick={() => setIsNewDeckModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-[var(--color-stone)] hover:text-[var(--color-ink)] rounded-full hover:bg-[var(--color-linen)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-[var(--color-ink)] mb-2 font-normal">
              Create New Flashcard Deck
            </h3>
            <p className="text-sm text-[var(--color-graphite)] mb-6 font-sans">
              Enter a subject and draft your first flashcard question.
            </p>

            <form onSubmit={handleCreateCustomDeck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-stone)] mb-1.5">
                  Deck Title
                </label>
                <input
                  type="text"
                  required
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  placeholder="e.g. Cognitive Psychology - Memory Models"
                  className="w-full h-11 px-4 rounded-[12px] bg-[var(--color-linen)] border border-[var(--color-ash)] text-sm focus:outline-none focus:border-[var(--color-azure)] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-stone)] mb-1.5">
                  Subject Category
                </label>
                <select
                  value={newDeckSubject}
                  onChange={(e) => setNewDeckSubject(e.target.value)}
                  className="w-full h-11 px-3 rounded-[12px] bg-[var(--color-linen)] border border-[var(--color-ash)] text-sm focus:outline-none font-sans"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="History">History</option>
                  <option value="Biology">Biology</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[var(--color-ash)]/60">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-stone)] mb-1.5">
                  Card 1: Front (Question or Term)
                </label>
                <input
                  type="text"
                  value={firstQuestion}
                  onChange={(e) => setFirstQuestion(e.target.value)}
                  placeholder="e.g. What is the Multi-Store Model of Memory?"
                  className="w-full h-11 px-4 rounded-[12px] bg-[var(--color-linen)] border border-[var(--color-ash)] text-sm mb-3 focus:outline-none focus:border-[var(--color-azure)] font-sans"
                />

                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-stone)] mb-1.5">
                  Card 1: Back (Answer or Definition)
                </label>
                <textarea
                  rows={2}
                  value={firstAnswer}
                  onChange={(e) => setFirstAnswer(e.target.value)}
                  placeholder="e.g. Atkinson-Shiffrin model: Sensory Memory → Short-Term Memory → Long-Term Memory."
                  className="w-full p-3 rounded-[12px] bg-[var(--color-linen)] border border-[var(--color-ash)] text-sm focus:outline-none focus:border-[var(--color-azure)] font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-ash)]/60">
                <button
                  type="button"
                  onClick={() => setIsNewDeckModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--color-graphite)] hover:bg-[var(--color-linen)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--color-ink)] text-white rounded-full px-6 py-2.5 text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[var(--color-mint)]" />
                  <span>Create Deck</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: RENAME DECK MODAL                                   */}
      {/* ============================================================ */}
      {editingDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">
          <div className="bg-white rounded-[20px] max-w-sm w-full p-6 border border-[var(--color-ash)] shadow-craft-xl">
            <h4 className="font-serif text-lg font-semibold text-[var(--color-ink)] mb-1">
              Rename Flashcard Deck
            </h4>
            <p className="text-xs text-[var(--color-stone)] mb-4">
              Enter a new title for this deck.
            </p>
            <input
              type="text"
              value={editTitleInput}
              onChange={(e) => setEditTitleInput(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-[var(--color-linen)] border border-[var(--color-ash)] text-sm mb-4 focus:outline-none focus:border-[var(--color-azure)]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDeck(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--color-graphite)] hover:bg-[var(--color-linen)] rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRename}
                className="bg-[var(--color-ink)] text-white px-5 py-2 text-xs font-semibold rounded-full hover:shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardsHub;
