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
import { Brain, Sparkles, Loader2, Hash } from 'lucide-react'

export function GenerateQuizModal({
  document,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('5') // '5' | '10' | '20' | 'custom'
  const [customCount, setCustomCount] = useState(15)
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [questionType, setQuestionType] = useState('mcq')
  const [isGenerating, setIsGenerating] = useState(false)

  if (!document) return null

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset)
    if (preset === 'custom') {
      const current = Number(customCount) || 15
      setQuestionCount(current)
    } else {
      const num = Number(preset)
      setQuestionCount(num)
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
      setQuestionCount(clamped)
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      setIsGenerating(true)
      const countToSend = Math.max(1, Math.min(50, Number(questionCount) || Number(customCount) || 5))

      const { data } = await api.post('/quiz/generate', {
        documentId: document.id,
        title: title || `${document.name.replace(/\.[^/.]+$/, '')} Quiz`,
        questionCount: countToSend,
        difficulty,
        questionType,
      })

      toast.success('AI Quiz created successfully!')
      onClose()
      navigate(`/quiz/${data.quizId}`)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to generate quiz. Try again.'
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
            <div className="p-2 rounded-[8px] bg-voltage-lime text-true-black font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <DialogTitle>Generate AI Quiz</DialogTitle>
          </div>
          <DialogDescription>
            AI analyzes{' '}
            <strong className="text-carbon-ink font-semibold">{document.name}</strong> and drafts
            targeted practice questions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4 mt-2">
          {/* Quiz Title */}
          <div className="space-y-2">
            <Label htmlFor="quiz-title" className="text-xs font-semibold text-ash uppercase tracking-wider">
              Quiz Title
            </Label>
            <Input
              id="quiz-title"
              placeholder={`${document.name.replace(/\.[^/.]+$/, '')} Quiz`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Question Quantity Selector: 5, 10, 20, Custom */}
          <div className="space-y-2.5 bg-surface-elevated/60 p-3.5 rounded-xl border border-border">
            <div className="flex justify-between items-center text-sm">
              <Label className="text-xs font-semibold text-ash uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-carbon-ink" />
                Question Count
              </Label>
              <span className="font-bold text-true-black bg-voltage-lime px-2.5 py-0.5 rounded-full text-xs shadow-sm">
                {questionCount || customCount || 5} {Number(questionCount || customCount) === 1 ? 'Question' : 'Questions'}
              </span>
            </div>

            {/* Preset Buttons: 5, 10, 20, and Custom */}
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

            {/* Custom Input Field (shown when 'Custom' is selected) */}
            {selectedPreset === 'custom' && (
              <div className="pt-2 mt-1 border-t border-border/80 flex flex-col gap-1.5 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between text-xs text-ash">
                  <span>Enter quantity (1 – 50):</span>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="custom-question-count"
                    type="number"
                    min={1}
                    max={50}
                    value={customCount}
                    onChange={handleCustomCountChange}
                    onBlur={() => {
                      if (!customCount || customCount < 1) {
                        setCustomCount(5)
                        setQuestionCount(5)
                      }
                    }}
                    placeholder="e.g. 15"
                    disabled={isGenerating}
                    className="h-10 pr-24 font-bold text-sm text-carbon-ink bg-white border-border focus:border-true-black"
                  />
                  <span className="absolute right-3 text-xs font-medium text-ash pointer-events-none">
                    questions
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ash uppercase tracking-wider">
              Difficulty
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setDifficulty(level)}
                  disabled={isGenerating}
                  className={`py-2 px-3 rounded-[8px] text-xs font-bold uppercase tracking-wider border transition-all ${
                    difficulty === level
                      ? 'bg-voltage-lime border-true-black text-true-black'
                      : 'bg-surface-elevated border-border text-carbon-ink hover:border-ash'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-ash uppercase tracking-wider">
              Format
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mcq', label: 'MCQ' },
                { id: 'short_answer', label: 'Short' },
                { id: 'mixed', label: 'Mixed' },
              ].map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setQuestionType(type.id)}
                  disabled={isGenerating}
                  className={`py-2 px-2 rounded-[8px] text-xs font-semibold border text-center transition-all ${
                    questionType === type.id
                      ? 'bg-voltage-lime border-true-black text-true-black'
                      : 'bg-surface-elevated border-border text-carbon-ink hover:border-ash'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            className="w-full gap-2 mt-4"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-true-black" />
                <span>Crafting {questionCount} questions (5-15s)...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 text-true-black" />
                <span>Generate {questionCount} Questions</span>
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
