import React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { RotateCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function FlipCard({
  card,
  isFlipped,
  onFlip,
  onMarkKnown,
  onMarkRevisit,
  isSubmitting = false,
}) {
  // Motion values for swipe drag
  const x = useMotionValue(0)
  const rotateZ = useTransform(x, [-200, 200], [-10, 10])
  const opacityRight = useTransform(x, [20, 120], [0, 1])
  const opacityLeft = useTransform(x, [-120, -20], [1, 0])

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 90
    if (info.offset.x > swipeThreshold) {
      onMarkKnown()
    } else if (info.offset.x < -swipeThreshold) {
      onMarkRevisit()
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* 3D Perspective Wrapper */}
      <div className="w-full h-84 md:h-96 perspective-1000 relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          style={{ x, rotate: rotateZ }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
            scale: isSubmitting ? 0.97 : 1,
          }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 280,
            damping: 26,
          }}
          className="w-full h-full relative cursor-grab active:cursor-grabbing transform-style-3d cursor-pointer"
          onClick={() => {
            if (Math.abs(x.get()) < 10) {
              onFlip()
            }
          }}
        >
          {/* Swipe Indicator Badges */}
          <motion.div
            style={{ opacity: opacityRight }}
            className="absolute top-6 right-6 z-30 pointer-events-none px-4 py-1.5 rounded-full bg-voltage-lime border border-true-black text-true-black font-bold uppercase tracking-wider text-xs shadow-md"
          >
            ✓ Known
          </motion.div>

          <motion.div
            style={{ opacity: opacityLeft }}
            className="absolute top-6 left-6 z-30 pointer-events-none px-4 py-1.5 rounded-full bg-pure-white border border-true-black text-true-black font-bold uppercase tracking-wider text-xs shadow-md"
          >
            ↻ Revisit
          </motion.div>

          {/* FRONT SIDE (White Paper Canvas) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] p-7 md:p-9 bg-pure-white border border-border flex flex-col justify-between overflow-hidden">
            {/* Front Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center px-2.5 py-1 rounded-[8px] bg-voltage-lime text-true-black text-xs font-bold">
                  #{card.orderIndex}
                </span>
                <span className="text-xs font-semibold tracking-wider text-ash uppercase">
                  Concept Prompt
                </span>
              </div>

              {card.status && card.status !== 'unseen' && (
                <Badge
                  variant={card.status === 'known' ? 'lime' : 'outline'}
                  className="text-[10px] uppercase font-semibold"
                >
                  {card.status}
                </Badge>
              )}
            </div>

            {/* Front Content */}
            <div className="my-auto text-center px-3 py-4 z-10">
              <p className="text-xl md:text-2xl font-bold text-carbon-ink leading-snug tracking-[-0.02em]">
                {card.front}
              </p>
            </div>

            {/* Front Footer */}
            <div className="flex items-center justify-between text-xs text-ash border-t border-border pt-3 z-10">
              <span className="flex items-center gap-1.5 text-carbon-ink font-medium">
                <Sparkles className="w-3.5 h-3.5 text-true-black" />
                Click or Space to flip
              </span>
              <span className="hidden sm:inline-block text-[11px] text-ash">
                Swipe ➔ Known • ⬅ Revisit
              </span>
            </div>
          </div>

          {/* BACK SIDE (Mid Abyss #052326 Dark Surface) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[24px] p-7 md:p-9 bg-mid-abyss text-pure-white border border-mid-abyss flex flex-col justify-between overflow-hidden">
            {/* Back Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center px-2.5 py-1 rounded-[8px] bg-voltage-lime text-true-black text-xs font-bold">
                  #{card.orderIndex}
                </span>
                <span className="text-xs font-semibold tracking-wider text-voltage-lime uppercase">
                  Answer / Recall
                </span>
              </div>
              <span className="text-[11px] text-pure-white/70 font-medium">
                Active Recall
              </span>
            </div>

            {/* Back Content */}
            <div className="my-auto px-2 py-4 z-10 max-h-[190px] overflow-y-auto pr-1">
              <p className="text-base md:text-lg font-medium text-pure-white leading-relaxed text-left whitespace-pre-wrap">
                {card.back}
              </p>
            </div>

            {/* Back Footer */}
            <div className="flex items-center justify-between text-xs text-pure-white/70 border-t border-pure-white/10 pt-3 z-10">
              <span>Self-evaluation</span>
              <span className="text-[11px] text-voltage-lime font-semibold">
                Mark as Known or Revisit below
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-3 gap-3 w-full mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            onMarkRevisit()
          }}
          disabled={isSubmitting}
          className="h-12 border-true-black text-true-black font-semibold gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Needs</span> Revisit
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            onFlip()
          }}
          className="h-12 border-border text-carbon-ink font-semibold gap-2"
        >
          <RotateCw className={`w-4 h-4 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
          {isFlipped ? 'Show Front' : 'Flip Card'}
        </Button>

        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onMarkKnown()
          }}
          disabled={isSubmitting}
          className="h-12 bg-voltage-lime text-true-black hover:brightness-95 font-bold gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Mark</span> Known
        </Button>
      </div>
    </div>
  )
}
