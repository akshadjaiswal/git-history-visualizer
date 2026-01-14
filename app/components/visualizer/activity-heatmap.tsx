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
    <div className="h-auto min-h-[280px] max-h-[350px] border-2 border-white bg-black p-4 overflow-x-auto">
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

              const getColor = () => {
                if (count === 0) return '#111'
                if (intensity < 0.25) return '#134E4A' // dark teal
                if (intensity < 0.5) return '#14B8A6' // medium teal
                if (intensity < 0.75) return '#5EEAD4' // bright teal
                return '#6EE7B7' // mint green
              }

              return (
                <div
                  key={dayIndex}
                  className="w-3 h-3 border border-gray-800 group relative cursor-pointer transition-all hover:scale-125"
                  style={{
                    backgroundColor: getColor()
                  }}
                  title={`${format(day, 'MMM d')}: ${count} commits`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 rounded text-black font-bold" style={{ backgroundColor: '#5EEAD4' }}>
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
        <div className="w-3 h-3 border border-gray-800" style={{ backgroundColor: '#111' }} />
        <div className="w-3 h-3 border border-gray-800" style={{ backgroundColor: '#134E4A' }} />
        <div className="w-3 h-3 border border-gray-800" style={{ backgroundColor: '#14B8A6' }} />
        <div className="w-3 h-3 border border-gray-800" style={{ backgroundColor: '#5EEAD4' }} />
        <div className="w-3 h-3 border border-gray-800" style={{ backgroundColor: '#6EE7B7' }} />
        <span>More</span>
      </div>
    </div>
  )
}
