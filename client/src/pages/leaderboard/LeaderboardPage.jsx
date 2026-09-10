import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Flame, CheckCircle2, Clock, Medal } from 'lucide-react'

export function LeaderboardPage() {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', 'global'],
    queryFn: async () => {
      const res = await api.get('/leaderboard/global')
      return res.data.leaderboard || []
    },
  })

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-carbon-ink flex items-center gap-2.5">
          <Trophy className="w-6 h-6 text-amber-500" />
          Study Leaderboard
        </h1>
        <p className="text-sm text-ash mt-1">
          Top peers ranked by dedicated study hours, quizzes completed, and active streaks.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <Card key={n} className="animate-pulse h-16 bg-surface-elevated/50" />
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-carbon-ink">Leaderboard is Fresh!</h3>
            <p className="text-sm text-ash max-w-sm">
              Complete study sessions and quizzes to earn your spot at the top of the leaderboard!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Cards if available */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 2nd Place */}
              <Card className="p-5 border-border flex flex-col items-center text-center order-2 md:order-1 bg-surface-elevated/40">
                <Medal className="w-8 h-8 text-slate-400 mb-2" />
                <Avatar className="w-14 h-14 border-2 border-slate-300">
                  <AvatarImage src={leaderboard[1].avatar} />
                  <AvatarFallback className="font-bold">
                    {leaderboard[1].name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-bold text-carbon-ink mt-2">{leaderboard[1].name}</h4>
                <p className="text-xs text-ash">{leaderboard[1].roomName}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-carbon-ink">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-ash" />
                    {leaderboard[1].studyHours}h
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ash" />
                    {leaderboard[1].quizzesCompleted}
                  </span>
                </div>
              </Card>

              {/* 1st Place */}
              <Card className="p-6 border-2 border-voltage-lime flex flex-col items-center text-center order-1 md:order-2 bg-voltage-lime/5 shadow-md -translate-y-2">
                <Trophy className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
                <Avatar className="w-16 h-16 border-2 border-amber-400">
                  <AvatarImage src={leaderboard[0].avatar} />
                  <AvatarFallback className="font-bold text-lg">
                    {leaderboard[0].name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge className="mt-2 bg-amber-500 text-white font-bold text-xs">#1 Champion</Badge>
                <h4 className="font-bold text-lg text-carbon-ink mt-1">{leaderboard[0].name}</h4>
                <p className="text-xs text-ash">{leaderboard[0].roomName}</p>
                <div className="mt-4 flex items-center gap-3 text-sm font-bold text-carbon-ink">
                  <span className="flex items-center gap-1 text-true-black">
                    <Clock className="w-4 h-4 text-true-black" />
                    {leaderboard[0].studyHours}h
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-true-black">
                    <Flame className="w-4 h-4 text-orange-500" />
                    {leaderboard[0].streak}d
                  </span>
                </div>
              </Card>

              {/* 3rd Place */}
              <Card className="p-5 border-border flex flex-col items-center text-center order-3 bg-surface-elevated/40">
                <Medal className="w-8 h-8 text-amber-700 mb-2" />
                <Avatar className="w-14 h-14 border-2 border-amber-600/50">
                  <AvatarImage src={leaderboard[2].avatar} />
                  <AvatarFallback className="font-bold">
                    {leaderboard[2].name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-bold text-carbon-ink mt-2">{leaderboard[2].name}</h4>
                <p className="text-xs text-ash">{leaderboard[2].roomName}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-carbon-ink">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-ash" />
                    {leaderboard[2].studyHours}h
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ash" />
                    {leaderboard[2].quizzesCompleted}
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* Rankings Table */}
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-carbon-ink">
                All Ranks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 hover:bg-surface-elevated/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center font-bold text-sm text-ash">
                        #{entry.rank}
                      </span>
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback className="font-semibold text-xs">
                          {entry.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm text-carbon-ink">{entry.name}</h4>
                        <p className="text-xs text-ash">{entry.roomName || 'General Room'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <span className="text-sm font-bold text-carbon-ink block">
                          {entry.studyHours} hrs
                        </span>
                        <span className="text-[11px] text-ash">Study Time</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-carbon-ink block">
                          {entry.quizzesCompleted}
                        </span>
                        <span className="text-[11px] text-ash">Quizzes</span>
                      </div>
                      <div className="min-w-16">
                        <span className="text-sm font-bold text-orange-600 flex items-center justify-end gap-1">
                          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                          {entry.streak}d
                        </span>
                        <span className="text-[11px] text-ash">Streak</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
