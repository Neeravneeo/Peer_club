import React from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react'

export function QuizResultsPage() {
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result

  if (!result) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-ash">No results available to display.</p>
        <Button onClick={() => navigate('/quizzes')}>Go to Quizzes</Button>
      </div>
    )
  }

  const { score, totalQuestions, percentage, timeTakenSeconds, review } = result

  const isPass = percentage >= 60

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Score Summary Card */}
      <Card className="border-border bg-pure-white text-center p-8 md:p-10 rounded-[24px]">
        <CardContent className="space-y-5 pt-0">
          <div className="inline-flex p-4 rounded-[16px] bg-voltage-lime text-true-black mb-2 font-bold">
            <Trophy className="w-9 h-9" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-carbon-ink tracking-[-0.02em]">
            Quiz Completed!
          </h1>
          <p className="text-sm text-ash">
            Your results and personalized answer review.
          </p>

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="text-center">
              <p className="text-4xl font-black text-carbon-ink">{score} / {totalQuestions}</p>
              <p className="text-xs text-ash uppercase tracking-wider font-semibold mt-1">Score</p>
            </div>
            <div className="h-10 border-r border-border" />
            <div className="text-center">
              <p className="text-4xl font-black text-true-black">
                {percentage}%
              </p>
              <p className="text-xs text-ash uppercase tracking-wider font-semibold mt-1">Accuracy</p>
            </div>
            {timeTakenSeconds && (
              <>
                <div className="h-10 border-r border-border" />
                <div className="text-center">
                  <p className="text-4xl font-black text-carbon-ink">{timeTakenSeconds}s</p>
                  <p className="text-xs text-ash uppercase tracking-wider font-semibold mt-1">Time</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </Button>
            <Button asChild className="gap-2">
              <Link to="/quizzes">
                All Quizzes <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-carbon-ink flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-true-black" />
          Question Breakdown
        </h2>

        <div className="space-y-4">
          {review?.map((item, idx) => {
            return (
              <Card
                key={idx}
                className="border-border bg-pure-white rounded-[24px]"
              >
                <CardContent className="p-6 md:p-8 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-[6px] bg-surface-elevated text-xs font-bold flex items-center justify-center text-carbon-ink border border-border">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-carbon-ink text-base">
                        {item.questionText}
                      </h4>
                    </div>
                    {item.isCorrect ? (
                      <Badge variant="lime" className="gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </Badge>
                    )}
                  </div>

                  {item.options && (
                    <div className="text-sm space-y-2 pl-8 text-ash">
                      {item.options.map((opt, optIdx) => {
                        const isChosen = item.selectedOptionIndex === optIdx
                        const isCorrectOption = item.correctIndex === optIdx
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-[12px] border text-xs font-medium flex items-center justify-between ${
                              isCorrectOption
                                ? 'border-true-black bg-voltage-lime text-true-black font-semibold'
                                : isChosen && !isCorrectOption
                                ? 'border-accent-red bg-accent-red/10 text-accent-red'
                                : 'border-border bg-surface-elevated text-carbon-ink'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isCorrectOption && (
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                (Correct Answer)
                              </span>
                            )}
                            {isChosen && !isCorrectOption && (
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                (Your Choice)
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {item.explanation && (
                    <div className="p-4 rounded-[16px] bg-surface-elevated border border-border text-xs text-carbon-ink mt-2">
                      <span className="font-bold text-true-black mr-1">
                        💡 Explanation:
                      </span>
                      {item.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
