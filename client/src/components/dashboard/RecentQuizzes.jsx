import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'

export function RecentQuizzes({ attempts = [], totalQuizzes = 0 }) {
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (percentage >= 60) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-rose-600 bg-rose-50 border-rose-200'
  }

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base text-white tracking-tight">
            Recent Practice Quizzes
          </h3>
        </div>
        <Link
          to="/quizzes"
          className="text-xs font-medium text-[#8a8f98] hover:text-white flex items-center gap-1 group transition-colors"
        >
          View All ({totalQuizzes}){' '}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {attempts.length === 0 ? (
        <Card className="border border-white/[0.08] bg-[#0d0e11]/80 p-8 text-center space-y-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <Brain className="w-5 h-5 text-[#8f9bff]" />
          </div>
          <p className="text-sm font-medium text-white">
            No quiz attempts recorded yet
          </p>
          <p className="text-xs text-[#8a8f98] max-w-sm mx-auto">
            Test your knowledge with AI-generated quizzes created from your uploaded notes.
          </p>
          <Button asChild size="sm" className="mt-2 text-xs">
            <Link to="/upload">Create Quiz from PDF</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {attempts.map((attempt) => (
            <Card
              key={attempt.id}
              className="border border-white/[0.08] bg-[#0d0e11]/80 hover:border-white/[0.16] hover:bg-[#121318]/90 transition-all p-4 px-5 rounded-xl shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-white text-sm truncate">
                      {attempt.quizTitle}
                    </p>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#8a8f98]">
                      {attempt.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#8a8f98]">
                    <span>
                      {attempt.score}/{attempt.totalQuestions} correct
                    </span>
                    {attempt.timeTakenSeconds && (
                      <>
                        <span>•</span>
                        <span>{Math.round(attempt.timeTakenSeconds / 60)} mins</span>
                      </>
                    )}
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full max-w-xs h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${getBarColor(attempt.percentage)}`}
                      style={{ width: `${Math.min(100, attempt.percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getScoreColor(
                      attempt.percentage
                    )}`}
                  >
                    {attempt.percentage}%
                  </span>

                  <Button asChild size="sm" variant="secondary" className="text-xs gap-1">
                    <Link to={`/quiz/${attempt.quizId}`}>
                      Retake <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
