'use client'

import { useMemo } from 'react'
import { format, eachDayOfInterval, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import type { CommitNode } from '@/types/github'

interface ActivityHeatmapProps {
  commits: CommitNode[]
  timeRange: {
    earliest: Date
    latest: Date
  }
}

export function ActivityHeatmap({ commits, timeRange }: ActivityHeatmapProps) {
  // Group commits by date
  const commitsByDate = useMemo(() => {
    const map = new Map<string, number>()
    commits.forEach(commit => {
      const dateKey = format(commit.date, 'yyyy-MM-dd')
      map.set(dateKey, (map.get(dateKey) || 0) + 1)
    })
    return map
  }, [commits])

  // Get max for intensity scaling
  const maxCommits = useMemo(() => {
    const values = Array.from(commitsByDate.values())
    return values.length > 0 ? Math.max(...values) : 1
  }, [commitsByDate])

  // Generate weeks for last 52 weeks (or full range if shorter)
  const weeks = useMemo(() => {
    const now = timeRange.latest
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    const start = timeRange.earliest > oneYearAgo ? timeRange.earliest : oneYearAgo

    const allWeeks = eachWeekOfInterval({ start, end: now })

    return allWeeks.slice(-52).map(weekStart => {
      const weekEnd = endOfWeek(weekStart)
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 7)
      return days
    })
  }, [timeRange])

  return (
    <div className="h-full border-2 border-white bg-black p-6 overflow-x-auto">
      <h2 className="font-display text-xl font-bold mb-4 border-b-2 border-white pb-2">
        Commit Activity
      </h2>

      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const count = commitsByDate.get(dateKey) || 0
              const intensity = count / maxCommits

              return (
                <div
                  key={dayIndex}
                  className="w-3 h-3 border border-gray-800 group relative cursor-pointer"
                  style={{
                    backgroundColor: count === 0
                      ? '#111'
                      : `rgba(255, 255, 255, ${0.2 + intensity * 0.8})`
                  }}
                  title={`${format(day, 'MMM d')}: ${count} commits`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black px-2 py-1 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {format(day, 'MMM d, yyyy')}
                    <br />
                    <span className="font-bold">{count}</span> commits
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs font-mono text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 border border-gray-800 bg-[#111]" />
        <div className="w-3 h-3 border border-gray-800 bg-white/30" />
        <div className="w-3 h-3 border border-gray-800 bg-white/60" />
        <div className="w-3 h-3 border border-gray-800 bg-white/90" />
        <span>More</span>
      </div>
    </div>
  )
}
