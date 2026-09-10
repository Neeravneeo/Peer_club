import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles, Play, Loader2, FileText } from 'lucide-react'

export function QuizListPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.get('/quiz')
      return res.data.quizzes
    },
  })

  const quizzes = data || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-carbon-ink tracking-tight">
            AI Quizzes
          </h1>
          <p className="text-sm text-ash mt-1">
            Test yourself with automatically generated practice exams from your materials.
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
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-[24px] bg-surface-elevated p-8 space-y-4 max-w-md mx-auto">
          <div className="p-4 rounded-[16px] bg-voltage-lime text-true-black w-fit mx-auto">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-carbon-ink">No quizzes generated yet</h3>
            <p className="text-xs text-ash mt-1">
              Upload study materials in Documents and click "Generate Quiz".
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/upload">Upload Document</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="border-border bg-pure-white hover:border-true-black transition-colors rounded-[24px] flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-carbon-ink text-lg leading-snug">
                      {quiz.title}
                    </h3>
                    {quiz.document && (
                      <p className="text-xs text-ash flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-true-black" />
                        {quiz.document.name}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="uppercase text-[10px] font-bold">
                    {quiz.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-ash pt-3 border-t border-border">
                  <span>{quiz.questionCount} Questions</span>
                  {quiz.lastAttempt ? (
                    <span className="font-bold text-true-black">
                      Last Score: {quiz.lastAttempt.percentage}%
                    </span>
                  ) : (
                    <span className="text-ash">Not attempted</span>
                  )}
                </div>

                <Button
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  className="w-full gap-2"
                >
                  <Play className="w-4 h-4 fill-true-black" /> Take Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
