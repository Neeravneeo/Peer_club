import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Layers,
  Sparkles,
  Play,
  Loader2,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export function FlashcardListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const res = await api.get('/flashcards')
      return res.data.flashcardSets
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/flashcards/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Flashcard set deleted')
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete set')
    },
  })

  const sets = data || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-carbon-ink tracking-tight">
            AI Flashcards
          </h1>
          <p className="text-sm text-ash mt-1">
            Active recall flashcards with 3D flip interaction and mastery tracking.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link to="/upload">
            <Sparkles className="w-4 h-4" /> Create from Document
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-true-black animate-spin" />
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-[24px] bg-surface-elevated p-8 space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-[16px] bg-voltage-lime text-true-black w-fit mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-carbon-ink">
              No flashcard decks yet
            </h3>
            <p className="text-xs text-ash mt-1">
              Upload study notes or PDFs in Documents to extract active recall cards.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/upload">Upload Document</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((set) => {
            const mastery = set.stats?.masteryPercentage ?? 0
            const known = set.stats?.knownCount ?? 0
            const revisit = set.stats?.revisitCount ?? 0

            return (
              <Card
                key={set.id}
                className="border-border bg-pure-white hover:border-true-black transition-all rounded-[24px] flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-bold text-carbon-ink text-base leading-snug truncate">
                          {set.title}
                        </h3>
                        {set.document && (
                          <p className="text-xs text-ash flex items-center gap-1 truncate">
                            <FileText className="w-3.5 h-3.5 text-true-black shrink-0" />
                            <span className="truncate">{set.document.name}</span>
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[11px] shrink-0 font-semibold">
                        {set.cardCount} cards
                      </Badge>
                    </div>

                    {/* Progress Bar & Stats */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-ash font-medium">Mastery</span>
                        <span className="font-bold text-carbon-ink">{mastery}%</span>
                      </div>
                      <Progress value={mastery} className="h-1.5" />

                      <div className="flex items-center justify-between text-[11px] text-ash pt-1 font-medium">
                        <span className="flex items-center gap-1 text-true-black font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {known} Known
                        </span>
                        <span className="flex items-center gap-1 text-ash">
                          <AlertCircle className="w-3.5 h-3.5" /> {revisit} Revisit
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={() => navigate(`/flashcards/${set.id}`)}
                      className="flex-1 gap-2"
                    >
                      <Play className="w-4 h-4 fill-true-black" /> Study Deck
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(set.id)}
                      className="text-ash hover:text-accent-red"
                      title="Delete deck"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
