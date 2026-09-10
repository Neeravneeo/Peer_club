import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FlipCard } from '@/components/flashcards/FlipCard'
import { SessionReviewSummary } from '@/components/flashcards/SessionReviewSummary'
import {
  ArrowLeft,
  RotateCcw,
  Shuffle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

export function FlashcardStudyPage() {
  const { setId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch set
  const { data, isLoading } = useQuery({
    queryKey: ['flashcardSet', setId],
    queryFn: async () => {
      const res = await api.get(`/flashcards/${setId}`)
      return res.data.flashcardSet
    },
  })

  // Local study session state
  const [sessionCards, setSessionCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownSessionCards, setKnownSessionCards] = useState([])
  const [revisitSessionCards, setRevisitSessionCards] = useState([])
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)

  // Initialize cards on data load
  useEffect(() => {
    if (data?.flashcards) {
      setSessionCards(data.flashcards)
      setCurrentIndex(0)
      setIsFlipped(false)
      setKnownSessionCards([])
      setRevisitSessionCards([])
      setIsSessionComplete(false)
    }
  }, [data])

  // Progress update mutation
  const progressMutation = useMutation({
    mutationFn: async ({ cardId, status }) => {
      const res = await api.patch(`/flashcards/${cardId}/progress`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
      queryClient.invalidateQueries({ queryKey: ['flashcardSet', setId] })
    },
  })

  // Handle Mark status
  const handleMarkStatus = useCallback(
    (status) => {
      if (sessionCards.length === 0 || currentIndex >= sessionCards.length) return

      const currentCard = sessionCards[currentIndex]
      const updatedCard = { ...currentCard, status }

      // Update session tracking
      if (status === 'known') {
        setKnownSessionCards((prev) => [...prev.filter((c) => c.id !== currentCard.id), updatedCard])
        setRevisitSessionCards((prev) => prev.filter((c) => c.id !== currentCard.id))
      } else {
        setRevisitSessionCards((prev) => [...prev.filter((c) => c.id !== currentCard.id), updatedCard])
        setKnownSessionCards((prev) => prev.filter((c) => c.id !== currentCard.id))
      }

      // Persist in backend
      progressMutation.mutate({ cardId: currentCard.id, status })

      // Next card or finish
      if (currentIndex + 1 < sessionCards.length) {
        setIsFlipped(false)
        setCurrentIndex((prev) => prev + 1)
      } else {
        setIsSessionComplete(true)
      }
    },
    [sessionCards, currentIndex, progressMutation]
  )

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSessionComplete) return

      if (e.code === 'Space') {
        e.preventDefault()
        handleFlip()
      } else if (e.code === 'ArrowRight' || e.key === '2') {
        e.preventDefault()
        handleMarkStatus('known')
      } else if (e.code === 'ArrowLeft' || e.key === '1') {
        e.preventDefault()
        handleMarkStatus('revisit')
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault()
        handleFlip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSessionComplete, handleFlip, handleMarkStatus])

  // Restart all
  const handleRestartAll = () => {
    if (data?.flashcards) {
      const cards = isShuffled
        ? [...data.flashcards].sort(() => Math.random() - 0.5)
        : data.flashcards
      setSessionCards(cards)
      setCurrentIndex(0)
      setIsFlipped(false)
      setKnownSessionCards([])
      setRevisitSessionCards([])
      setIsSessionComplete(false)
    }
  }

  // Study revisit only
  const handleStudyRevisitOnly = () => {
    if (revisitSessionCards.length > 0) {
      setSessionCards([...revisitSessionCards])
      setCurrentIndex(0)
      setIsFlipped(false)
      setKnownSessionCards([])
      setRevisitSessionCards([])
      setIsSessionComplete(false)
    }
  }

  // Toggle shuffle
  const handleToggleShuffle = () => {
    const newShuffled = !isShuffled
    setIsShuffled(newShuffled)
    const shuffledCards = newShuffled
      ? [...sessionCards].sort(() => Math.random() - 0.5)
      : (data?.flashcards || sessionCards)
    setSessionCards(shuffledCards)
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.info(newShuffled ? 'Deck shuffled' : 'Deck sorted in original order')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-true-black animate-spin" />
      </div>
    )
  }

  if (!data || !sessionCards.length) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-ash">Flashcard deck not found or is empty.</p>
        <Button onClick={() => navigate('/flashcards')}>Back to Decks</Button>
      </div>
    )
  }

  const currentCard = sessionCards[currentIndex]
  const progressPercent = ((currentIndex) / sessionCards.length) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/flashcards')}
          className="gap-2 text-ash hover:text-carbon-ink"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Session
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleShuffle}
            className={`gap-1.5 text-xs ${
              isShuffled ? 'bg-voltage-lime text-true-black font-bold' : 'text-ash hover:text-carbon-ink'
            }`}
            title="Toggle shuffle order"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestartAll}
            className="gap-1.5 text-xs text-ash hover:text-carbon-ink"
            title="Restart session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </Button>
        </div>
      </div>

      {isSessionComplete ? (
        <SessionReviewSummary
          setTitle={data.title}
          totalCards={sessionCards.length}
          knownCards={knownSessionCards}
          revisitCards={revisitSessionCards}
          onRestartAll={handleRestartAll}
          onStudyRevisitOnly={handleStudyRevisitOnly}
        />
      ) : (
        <div className="space-y-6">
          {/* Deck Info & Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <h2 className="font-bold text-carbon-ink text-lg tracking-tight truncate max-w-sm sm:max-w-md">
                  {data.title}
                </h2>
                {data.document && (
                  <p className="text-ash text-xs truncate max-w-xs">
                    Source: {data.document.name}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="font-bold text-true-black text-sm">
                  {currentIndex + 1}
                </span>
                <span className="text-ash text-xs"> / {sessionCards.length}</span>
              </div>
            </div>

            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* 3D Flip Card */}
          {currentCard && (
            <FlipCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              onMarkKnown={() => handleMarkStatus('known')}
              onMarkRevisit={() => handleMarkStatus('revisit')}
              isSubmitting={progressMutation.isPending}
            />
          )}

          {/* Quick Keyboard shortcuts hint */}
          <div className="hidden sm:flex items-center justify-center gap-4 text-xs text-ash pt-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded-[6px] bg-surface-elevated border border-border text-[10px] font-mono text-carbon-ink">
                Space
              </kbd>
              Flip
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded-[6px] bg-surface-elevated border border-border text-[10px] font-mono text-carbon-ink">
                ← / 1
              </kbd>
              Revisit
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded-[6px] bg-surface-elevated border border-border text-[10px] font-mono text-carbon-ink">
                → / 2
              </kbd>
              Known
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
