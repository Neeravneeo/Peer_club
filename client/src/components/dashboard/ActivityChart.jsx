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
    <div className="bg-[#121318]/95 text-white p-3 rounded-xl shadow-2xl border border-white/[0.1] text-xs space-y-1 z-50 pointer-events-none backdrop-blur-md">
      <p className="font-semibold text-[#8f9bff]">
        {data.day} • {data.date}
      </p>
      <div className="flex items-center justify-between gap-4 text-[#8a8f98]">
        <span>Study Time:</span>
        <span className="font-medium text-white">{data.studyMinutes} mins</span>
      </div>
      <div className="flex items-center justify-between gap-4 text-[#8a8f98]">
        <span>Quizzes Taken:</span>
        <span className="font-medium text-white">{data.quizzesTaken}</span>
      </div>
      {data.avgScore > 0 && (
        <div className="flex items-center justify-between gap-4 text-[#8a8f98]">
          <span>Avg Quiz Score:</span>
          <span className="font-medium text-cyan-spark">{data.avgScore}%</span>
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
  const barColor = metric === 'minutes' ? '#5e6ad2' : '#7af3ff'

  return (
    <Card className="border border-white/[0.08] bg-[#0d0e11]/80 hover:border-white/[0.16] hover:bg-[#121318]/90 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.5)] transition-all">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8a8f98] font-medium uppercase tracking-wider">
                7-Day Activity
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-white">
                <Clock className="w-3 h-3 text-[#8a8f98]" /> {totalHours}h this week
              </span>
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Study Rhythm & Consistency
            </h3>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center p-0.5 bg-white/[0.04] border border-white/[0.08] rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setMetric('minutes')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                metric === 'minutes'
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-[#8a8f98] hover:text-white'
              }`}
            >
              Minutes
            </button>
            <button
              onClick={() => setMetric('scores')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                metric === 'scores'
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-[#8a8f98] hover:text-white'
              }`}
            >
              Quiz Score
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[220px] w-full pt-2">
          {weekData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#8a8f98]">
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
                  stroke="#62666d"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
                />
                <YAxis
                  stroke="#62666d"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  unit={metric === 'minutes' ? 'm' : '%'}
                />
                <Tooltip
                  content={<CustomTooltip mode={metric} />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: 6 }}
                />
                <Bar
                  dataKey={dataKey}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                  fill={barColor}
                >
                  {weekData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry[dataKey] > 0
                          ? barColor
                          : 'rgba(255, 255, 255, 0.04)'
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
