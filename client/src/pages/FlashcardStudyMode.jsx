import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Shuffle, RotateCcw, BookOpen, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { triggerStreakActivity } from '@/components/StreakCard';

// Visual & Subcomponents
import { DotGridPattern, PastelBlob } from '@/components/DecorativeElements';
import { FlipCard3D } from '@/components/flashcards/FlipCard3D';
import { RatingControls } from '@/components/flashcards/RatingControls';
import { ProgressBar } from '@/components/flashcards/ProgressBar';
import { SessionCompleteModal } from '@/components/flashcards/SessionCompleteModal';
import { SAMPLE_FLASHCARD_DECKS } from '@/components/flashcards/sampleDecksData';

/**
 * FlashcardStudyMode Component
 * Active recall study interface with 3D flip card, keyboard controls, and session scorecard.
 */
export function FlashcardStudyMode() {
  const { id: deckId, setId } = useParams();
  const effectiveDeckId = deckId || setId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Deck Details & Cards
  const { data: deckData, isLoading } = useQuery({
    queryKey: ['flashcard-deck', effectiveDeckId],
    queryFn: async () => {
      // 1. Fetch from backend API
      try {
        const res = await api.get(`/flashcards/${effectiveDeckId}`);
        if (res?.data?.flashcardSet) return res.data.flashcardSet;
        if (res?.data?.set) return res.data.set;
      } catch (_) {
        // 2. Fallback to Supabase
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('document_id', effectiveDeckId);

        if (data && !error && data.length > 0) {
          return {
            id: effectiveDeckId,
            title: 'Study Document Flashcards',
            subject: 'General Studies',
            cards: data.map((c) => ({
              id: c.id,
              front: c.question,
              back: c.answer,
              status: c.status || 'revisit',
            })),
          };
        }
      }

      return null;
    },
  });

  // Study Session States
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [masteredCards, setMasteredCards] = useState([]);
  const [revisitCards, setRevisitCards] = useState([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Initialize cards when deck data loads
  useEffect(() => {
    if (deckData?.cards && deckData.cards.length > 0) {
      setCards(deckData.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setMasteredCards([]);
      setRevisitCards([]);
      setIsSessionComplete(false);
    }
  }, [deckData]);

  // Update card progress mutation
  const progressMutation = useMutation({
    mutationFn: async ({ cardId, status }) => {
      try {
        await api.patch(`/flashcards/${cardId}/progress`, { status });
      } catch (_) {
        await supabase
          .from('flashcards')
          .update({ status: status === 'known' ? 'known' : 'revisit' })
          .eq('id', cardId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-deck', effectiveDeckId] });
    },
  });

  // Handle Mark Mastered (Got It)
  const handleMarkMastered = useCallback(() => {
    if (cards.length === 0 || currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    const updated = { ...currentCard, status: 'known' };

    setMasteredCards((prev) => [...prev.filter((c) => c.id !== currentCard.id), updated]);
    setRevisitCards((prev) => prev.filter((c) => c.id !== currentCard.id));

    if (currentCard.id) {
      progressMutation.mutate({ cardId: currentCard.id, status: 'known' });
    }

    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex((p) => p + 1);
    } else {
      setIsSessionComplete(true);
      triggerStreakActivity('flashcard');
    }
  }, [cards, currentIndex, progressMutation]);

  // Handle Mark Revisit (Still Learning)
  const handleMarkRevisit = useCallback(() => {
    if (cards.length === 0 || currentIndex >= cards.length) return;

    const currentCard = cards[currentIndex];
    const updated = { ...currentCard, status: 'revisit' };

    setRevisitCards((prev) => [...prev.filter((c) => c.id !== currentCard.id), updated]);
    setMasteredCards((prev) => prev.filter((c) => c.id !== currentCard.id));

    if (currentCard.id) {
      progressMutation.mutate({ cardId: currentCard.id, status: 'revisit' });
    }

    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex((p) => p + 1);
    } else {
      setIsSessionComplete(true);
      triggerStreakActivity('flashcard');
    }
  }, [cards, currentIndex, progressMutation]);

  // Handle Flip
  const handleFlip = useCallback(() => {
    setIsFlipped((p) => !p);
  }, []);

  // Handle Shuffle
  const handleToggleShuffle = () => {
    setIsShuffled((prev) => {
      const next = !prev;
      if (next) {
        setCards((current) => [...current].sort(() => Math.random() - 0.5));
        toast.info('Deck shuffled!');
      } else if (deckData?.cards) {
        setCards(deckData.cards);
      }
      setCurrentIndex(0);
      setIsFlipped(false);
      return next;
    });
  };

  // Keyboard Shortcuts (Space to flip, Left for Revisit, Right for Mastered)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleMarkRevisit();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleMarkMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleMarkRevisit, handleMarkMastered]);

  // Actions for Session Completion
  const handleReviewMissed = () => {
    if (revisitCards.length === 0) return;
    setCards(revisitCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setRevisitCards([]);
    setIsSessionComplete(false);
    toast.info(`Reviewing ${revisitCards.length} missed cards`);
  };

  const handleRestartDeck = () => {
    if (deckData?.cards) {
      setCards(deckData.cards);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setRevisitCards([]);
    setIsSessionComplete(false);
  };

  if (!isLoading && (!deckData || cards.length === 0)) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center p-6">
        <div className="bg-white rounded-[28px] border border-[var(--color-ash)] p-8 max-w-md text-center space-y-4 shadow-craft-sm">
          <Layers className="w-10 h-10 text-amber-600 mx-auto opacity-75" />
          <h3 className="font-serif text-lg font-bold text-[var(--color-ink)]">Deck Unavailable</h3>
          <p className="text-xs text-[var(--color-stone)]">
            This flashcard deck could not be found or contains no cards.
          </p>
          <button
            onClick={() => navigate('/flashcards')}
            className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
          >
            Back to Flashcard Decks
          </button>
        </div>
      </div>
    );
  }

  const activeCard = cards[currentIndex] || cards[0] || {};
  const currentCardNumber = Math.min(currentIndex + 1, cards.length);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] p-4 sm:p-6 md:p-10 relative overflow-x-hidden w-full max-w-full select-none flex flex-col justify-between">
      {/* Decorative Scrapbook Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0" aria-hidden="true">
        <DotGridPattern opacity="opacity-30" />
        <PastelBlob color="var(--color-mint)" className="w-96 h-96 -top-20 -left-20" opacity={0.12} />
        <PastelBlob color="var(--color-periwinkle)" className="w-96 h-96 top-40 -right-20" opacity={0.12} />
      </div>

      {/* Main Study Container */}
      <div className="max-w-4xl w-full mx-auto relative z-10 flex-1 flex flex-col justify-between pb-24">
        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Back button */}
          <Link
            to="/flashcards"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-graphite)] hover:text-[var(--color-ink)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Decks</span>
          </Link>

          {/* Deck Title */}
          <h1 className="font-serif text-xl sm:text-24px tracking-[-0.72px] text-[var(--color-ink)] font-normal text-center truncate max-w-md">
            {deckData?.title || 'Flashcard Study Mode'}
          </h1>

          {/* Shuffle Toggle */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <span className="text-xs font-medium text-[var(--color-graphite)]">
              Shuffle
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isShuffled}
                onChange={handleToggleShuffle}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-[var(--color-cloud)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[var(--color-mint)]" />
            </label>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          current={currentCardNumber}
          total={cards.length}
          className="mb-6 sm:mb-8"
        />

        {/* 3D Flip Flashcard */}
        {isLoading ? (
          <div className="h-[400px] md:h-[480px] rounded-[24px] bg-white border border-[var(--color-ash)] shadow-[var(--shadow-xl)] flex items-center justify-center animate-pulse">
            <p className="text-sm text-[var(--color-stone)] font-medium">
              Loading flashcards...
            </p>
          </div>
        ) : cards.length === 0 ? (
          <div className="h-[400px] md:h-[480px] rounded-[24px] bg-white border border-[var(--color-ash)] shadow-[var(--shadow-xl)] flex flex-col items-center justify-center p-8 text-center">
            <Layers className="w-12 h-12 text-[var(--color-stone)] mb-3" />
            <h3 className="font-serif text-xl text-[var(--color-ink)] mb-1">
              No cards found in this deck
            </h3>
            <p className="text-xs text-[var(--color-stone)] mb-4">
              Return to the deck hub to create or generate cards.
            </p>
            <button
              onClick={() => navigate('/flashcards')}
              className="bg-[var(--color-ink)] text-white px-6 py-2 rounded-full text-xs font-semibold"
            >
              Back to Decks
            </button>
          </div>
        ) : (
          <FlipCard3D
            card={activeCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onMarkMastered={handleMarkMastered}
            onMarkRevisit={handleMarkRevisit}
          />
        )}
      </div>

      {/* Rating Controls (Fixed Bottom) */}
      {!isSessionComplete && cards.length > 0 && (
        <RatingControls
          onMarkRevisit={handleMarkRevisit}
          onMarkMastered={handleMarkMastered}
          onFlip={handleFlip}
          isFlipped={isFlipped}
          disabled={cards.length === 0}
        />
      )}

      {/* Session Complete Modal */}
      <SessionCompleteModal
        isOpen={isSessionComplete}
        deckTitle={deckData?.title || 'Flashcard Deck'}
        masteredCount={masteredCards.length}
        revisitCount={revisitCards.length}
        totalCount={cards.length}
        onReviewMissed={handleReviewMissed}
        onRestartDeck={handleRestartDeck}
        onGenerateQuiz={() => navigate('/quizzes')}
        onBackToDecks={() => navigate('/flashcards')}
      />
    </div>
  );
}

export default FlashcardStudyMode;
