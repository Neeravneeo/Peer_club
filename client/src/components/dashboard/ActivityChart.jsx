import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, TrendingUp, Sparkles } from 'lucide-react'

function CustomTooltip({ active, payload, label, mode }) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-carbon-ink text-pure-white p-3 rounded-[14px] shadow-xl border border-white/10 text-xs space-y-1 z-50 pointer-events-none">
      <p className="font-bold text-voltage-lime">
        {data.day} • {data.date}
      </p>
      <div className="flex items-center justify-between gap-4 text-ash">
        <span>Study Time:</span>
        <span className="font-bold text-pure-white">{data.studyMinutes} mins</span>
      </div>
      <div className="flex items-center justify-between gap-4 text-ash">
        <span>Quizzes Taken:</span>
        <span className="font-bold text-pure-white">{data.quizzesTaken}</span>
      </div>
      {data.avgScore > 0 && (
        <div className="flex items-center justify-between gap-4 text-ash">
          <span>Avg Quiz Score:</span>
          <span className="font-bold text-cyan-spark">{data.avgScore}%</span>
        </div>
      )}
    </div>
  )
}

export function ActivityChart({ weekData = [] }) {
  const [metric, setMetric] = useState('minutes') // 'minutes' | 'scores'

  const totalMinutes = weekData.reduce((acc, d) => acc + (d.studyMinutes || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  const dataKey = metric === 'minutes' ? 'studyMinutes' : 'avgScore'
  const barColor = metric === 'minutes' ? '#d3fb52' : '#7af3ff'

  return (
    <Card className="border-border bg-pure-white rounded-[24px] shadow-sm hover:border-true-black/60 transition-colors">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ash font-bold uppercase tracking-wider">
                7-Day Activity
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-subtle text-[11px] font-bold text-carbon-ink">
                <Clock className="w-3 h-3 text-ash" /> {totalHours} hrs this week
              </span>
            </div>
            <h3 className="text-lg font-bold text-carbon-ink tracking-tight">
              Study Rhythm & Consistency
            </h3>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center p-1 bg-surface-elevated border border-border rounded-full self-start sm:self-auto">
            <button
              onClick={() => setMetric('minutes')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                metric === 'minutes'
                  ? 'bg-voltage-lime text-true-black font-bold shadow-sm'
                  : 'text-ash hover:text-carbon-ink'
              }`}
            >
              Minutes
            </button>
            <button
              onClick={() => setMetric('scores')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                metric === 'scores'
                  ? 'bg-cyan-spark text-true-black font-bold shadow-sm'
                  : 'text-ash hover:text-carbon-ink'
              }`}
            >
              Quiz Score
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[220px] w-full pt-2">
          {weekData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-ash">
              No activity recorded yet for the past 7 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  stroke="#8e8e93"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e5e5' }}
                />
                <YAxis
                  stroke="#8e8e93"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  unit={metric === 'minutes' ? 'm' : '%'}
                />
                <Tooltip
                  content={<CustomTooltip mode={metric} />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.04)', radius: 8 }}
                />
                <Bar
                  dataKey={dataKey}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={44}
                  fill={barColor}
                >
                  {weekData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry[dataKey] > 0
                          ? barColor
                          : 'rgba(0, 0, 0, 0.05)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
