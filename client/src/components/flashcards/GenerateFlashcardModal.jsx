import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Layers, Sparkles, Loader2, Hash } from 'lucide-react'

export function GenerateFlashcardModal({
  document,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('10') // '5' | '10' | '20' | 'custom'
  const [customCount, setCustomCount] = useState(15)
  const [cardCount, setCardCount] = useState(10)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!document) return null

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset)
    if (preset === 'custom') {
      const current = Number(customCount) || 15
      setCardCount(current)
    } else {
      const num = Number(preset)
      setCardCount(num)
    }
  }

  const handleCustomCountChange = (e) => {
    const rawVal = e.target.value
    if (rawVal === '') {
      setCustomCount('')
      return
    }
    const val = parseInt(rawVal, 10)
    if (!isNaN(val)) {
      const clamped = Math.max(1, Math.min(50, val))
      setCustomCount(clamped)
      setCardCount(clamped)
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      setIsGenerating(true)
      const countToSend = Math.max(1, Math.min(50, Number(cardCount) || Number(customCount) || 10))

      const { data } = await api.post('/flashcards/generate', {
        documentId: document.id,
        title: title || `${document.name.replace(/\.[^/.]+$/, '')} Flashcards`,
        cardCount: countToSend,
      })

      toast.success('AI Flashcards generated successfully!')
      onClose()
      navigate(`/flashcards/${data.setId}`)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to generate flashcards. Try again.'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-carbon-ink">
            <div className="p-2 rounded-[8px] bg-voltage-lime text-true-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <DialogTitle>Generate AI Flashcards</DialogTitle>
          </div>
          <DialogDescription>
            AI extracts high-yield definitions and concepts from{' '}
            <strong className="text-carbon-ink font-semibold">{document.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="flashcard-title" className="text-xs font-semibold text-ash uppercase tracking-wider">
              Flashcard Deck Title
            </Label>
            <Input
              id="flashcard-title"
              placeholder={`${document.name.replace(/\.[^/.]+$/, '')} Flashcards`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Card Quantity Selector: 5, 10, 20, Custom */}
          <div className="space-y-2.5 bg-surface-elevated/60 p-3.5 rounded-xl border border-border">
            <div className="flex justify-between items-center text-sm">
              <Label className="text-xs font-semibold text-ash uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-carbon-ink" />
                Number of Cards
              </Label>
              <span className="font-bold text-true-black bg-voltage-lime px-2.5 py-0.5 rounded-full text-xs shadow-sm">
                {cardCount || customCount || 10} {Number(cardCount || customCount) === 1 ? 'Card' : 'Cards'}
              </span>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '5', label: '5' },
                { id: '10', label: '10' },
                { id: '20', label: '20' },
                { id: 'custom', label: 'Custom' },
              ].map((item) => {
                const isActive = selectedPreset === item.id
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSelectPreset(item.id)}
                    disabled={isGenerating}
                    className={`py-2 px-3 rounded-[8px] text-xs font-bold uppercase tracking-wider border transition-all duration-150 ${
                      isActive
                        ? 'bg-voltage-lime border-true-black text-true-black shadow-sm scale-[1.02]'
                        : 'bg-surface-elevated border-border text-carbon-ink hover:border-ash hover:bg-surface-elevated/80'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Custom Input Field */}
            {selectedPreset === 'custom' && (
              <div className="pt-2 mt-1 border-t border-border/80 flex flex-col gap-1.5 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between text-xs text-ash">
                  <span>Enter card quantity (1 – 50):</span>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="custom-card-count"
                    type="number"
                    min={1}
                    max={50}
                    value={customCount}
                    onChange={handleCustomCountChange}
                    onBlur={() => {
                      if (!customCount || customCount < 1) {
                        setCustomCount(10)
                        setCardCount(10)
                      }
                    }}
                    placeholder="e.g. 15"
                    disabled={isGenerating}
                    className="h-10 pr-20 font-bold text-sm text-carbon-ink bg-white border-border focus:border-true-black"
                  />
                  <span className="absolute right-3 text-xs font-medium text-ash pointer-events-none">
                    cards
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-[12px] bg-surface-elevated border border-border text-xs text-ash">
            💡 Active recall flashcards are crafted with prompt cues on the front and concise explanations on the back.
          </div>

          <Button
            type="submit"
            className="w-full gap-2 mt-4"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-true-black" />
                <span>Crafting {cardCount} flashcards (5-15s)...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-true-black" />
                <span>Generate {cardCount} Cards</span>
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
