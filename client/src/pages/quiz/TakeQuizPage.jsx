import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react'

export function TakeQuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch quiz
  const { data, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const res = await api.get(`/quiz/${quizId}`)
      return res.data.quiz
    },
  })

  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const formattedAnswers = Object.entries(answers).map(([questionId, ans]) => ({
        questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        answerText: ans.answerText,
      }))

      const res = await api.post(`/quiz/${quizId}/attempts`, {
        answers: formattedAnswers,
        timeTakenSeconds: secondsElapsed,
      })
      return res.data
    },
    onSuccess: (data) => {
      toast.success('Quiz submitted!')
      navigate(`/quiz/${quizId}/results`, { state: { result: data } })
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to submit quiz')
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-true-black animate-spin" />
      </div>
    )
  }

  if (!data || !data.questions || !data.questions.length) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-ash">Quiz not found or has no questions.</p>
        <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
      </div>
    )
  }

  const questions = data.questions
  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentQuestion.id]
  const progressPercent = ((currentIndex + 1) / questions.length) * 100

  const handleSelectOption = (index) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selectedOptionIndex: index },
    }))
  }

  const handleTextAnswer = (text) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { answerText: text },
    }))
  }

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/quizzes')}
          className="gap-2 text-ash hover:text-carbon-ink"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Quiz
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-surface-elevated border border-border text-xs text-carbon-ink font-mono">
            <Clock className="w-3.5 h-3.5 text-true-black" />
            {formatTimer(secondsElapsed)}
          </div>
          <Badge variant="outline" className="uppercase font-bold">
            {data.difficulty}
          </Badge>
        </div>
      </div>

      {/* Progress & Question Info */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-ash font-medium">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{answeredCount} of {questions.length} answered</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-border bg-pure-white rounded-[24px]">
        <CardContent className="p-7 md:p-9 space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-carbon-ink leading-tight tracking-[-0.02em]">
            {currentQuestion.questionText}
          </h2>

          {/* Options */}
          {currentQuestion.questionType === 'mcq' && currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentAnswer?.selectedOptionIndex === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 px-5 rounded-[16px] text-left text-sm font-semibold border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-true-black bg-voltage-lime text-true-black'
                        : 'border-border bg-surface-elevated text-carbon-ink hover:border-ash'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-true-black text-voltage-lime' : 'bg-pure-white border border-border text-carbon-ink'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-true-black shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Type your answer here..."
                value={currentAnswer?.answerText || ''}
                onChange={(e) => handleTextAnswer(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
                className="gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="gap-2 bg-voltage-lime text-true-black hover:brightness-95 font-bold"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-true-black" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Quiz
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
