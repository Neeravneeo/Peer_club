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
          <h3 className="font-bold text-lg text-carbon-ink tracking-tight">
            Recent Practice Quizzes
          </h3>
        </div>
        <Link
          to="/quizzes"
          className="text-xs font-semibold text-carbon-ink hover:underline flex items-center gap-1 group"
        >
          View All ({totalQuizzes}){' '}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {attempts.length === 0 ? (
        <Card className="border-border bg-pure-white p-8 text-center space-y-3 rounded-[24px]">
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-ash">
            <Brain className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-carbon-ink">
            No quiz attempts recorded yet
          </p>
          <p className="text-xs text-ash max-w-sm mx-auto">
            Test your knowledge with AI-generated quizzes created from your uploaded notes.
          </p>
          <Button asChild size="sm" className="mt-2 text-xs">
            <Link to="/upload">Create Quiz from PDF</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <Card
              key={attempt.id}
              className="border-border bg-pure-white hover:border-true-black/60 transition-all p-4 px-5 rounded-[24px] shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-carbon-ink text-sm truncate">
                      {attempt.quizTitle}
                    </p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-ash">
                      {attempt.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-ash">
                    <span>
                      {attempt.score}/{attempt.totalQuestions} questions correct
                    </span>
                    {attempt.timeTakenSeconds && (
                      <>
                        <span>•</span>
                        <span>{Math.round(attempt.timeTakenSeconds / 60)} mins</span>
                      </>
                    )}
                  </div>

                  {/* Score Progress Bar */}
                  <div className="w-full max-w-xs h-1.5 bg-surface-subtle rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${getBarColor(attempt.percentage)}`}
                      style={{ width: `${Math.min(100, attempt.percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreColor(
                      attempt.percentage
                    )}`}
                  >
                    {attempt.percentage}%
                  </span>

                  <Button asChild size="sm" variant="outline" className="text-xs gap-1">
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
