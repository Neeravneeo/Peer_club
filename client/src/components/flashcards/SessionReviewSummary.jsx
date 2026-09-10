import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  AlertCircle,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export function SessionReviewSummary({
  setTitle,
  totalCards,
  knownCards,
  revisitCards,
  onRestartAll,
  onStudyRevisitOnly,
}) {
  const [expandedCardId, setExpandedCardId] = useState(null)

  const knownCount = knownCards.length
  const revisitCount = revisitCards.length
  const masteryPercentage =
    totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0

  const toggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id))
  }

  const getFeedbackMessage = () => {
    if (masteryPercentage === 100) return '🎉 Outstanding! You mastered every card in this set.'
    if (masteryPercentage >= 75) return '🔥 Great job! You have a solid grasp of this material.'
    if (masteryPercentage >= 50) return '💪 Good practice! Review the flagged cards to build confidence.'
    return '📚 Keep going! Active recall repetition will cement these concepts.'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Trophy Card */}
      <Card className="border-border bg-pure-white text-center rounded-[24px] overflow-hidden">
        <CardContent className="p-8 md:p-10 space-y-5">
          <div className="w-16 h-16 rounded-[16px] bg-voltage-lime text-true-black flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-carbon-ink tracking-[-0.02em]">
              Session Complete
            </h2>
            <p className="text-sm text-ash font-medium">{setTitle}</p>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-carbon-ink">
            {getFeedbackMessage()}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="p-4 rounded-[16px] bg-surface-elevated border border-border">
              <p className="text-xs text-ash uppercase tracking-wider font-semibold">
                Mastery
              </p>
              <p className="text-2xl font-bold text-carbon-ink mt-1">
                {masteryPercentage}%
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-voltage-lime/20 border border-voltage-lime/40">
              <p className="text-xs text-true-black uppercase tracking-wider font-bold">
                Known
              </p>
              <p className="text-2xl font-bold text-true-black mt-1">
                {knownCount}
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-surface-elevated border border-border">
              <p className="text-xs text-ash uppercase tracking-wider font-semibold">
                To Revisit
              </p>
              <p className="text-2xl font-bold text-carbon-ink mt-1">
                {revisitCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {revisitCount > 0 && (
          <Button
            onClick={onStudyRevisitOnly}
            variant="outline"
            className="w-full sm:flex-1 h-12 border-true-black text-true-black font-semibold gap-2"
          >
            <AlertCircle className="w-4 h-4 text-true-black" />
            Study Revisit ({revisitCount})
          </Button>
        )}

        <Button
          onClick={onRestartAll}
          className="w-full sm:flex-1 h-12 bg-voltage-lime text-true-black hover:brightness-95 font-bold gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Deck
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full sm:w-auto h-12 text-ash hover:text-carbon-ink"
        >
          <Link to="/flashcards" className="gap-2">
            <Layers className="w-4 h-4" />
            All Decks
          </Link>
        </Button>
      </div>

      {/* Revisit Cards Review Accordion */}
      {revisitCount > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-carbon-ink uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-true-black" />
              Cards To Practice ({revisitCount})
            </h3>
            <span className="text-xs text-ash">Click to reveal answer</span>
          </div>

          <div className="space-y-2">
            {revisitCards.map((card) => {
              const isExpanded = expandedCardId === card.id
              return (
                <div
                  key={card.id}
                  onClick={() => toggleExpand(card.id)}
                  className="p-4 rounded-[16px] bg-pure-white border border-border hover:border-true-black transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-[6px] bg-voltage-lime text-true-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        #{card.orderIndex}
                      </span>
                      <p className="text-sm font-semibold text-carbon-ink leading-snug">
                        {card.front}
                      </p>
                    </div>
                    <div className="text-ash hover:text-carbon-ink shrink-0 mt-0.5">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-[12px] bg-surface-elevated border border-border text-xs text-carbon-ink leading-relaxed">
                      <span className="font-bold text-true-black block mb-1">
                        Answer / Explanation:
                      </span>
                      {card.back}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
