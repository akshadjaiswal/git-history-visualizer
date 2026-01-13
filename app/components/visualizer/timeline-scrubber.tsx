'use client'

import { useVisualizerStore } from '@/lib/visualizer-store'
import type { CommitNode } from '@/types/github'
import { format } from 'date-fns'
import { useMemo } from 'react'

interface TimelineScrubberProps {
  timeRange: {
    earliest: Date
    latest: Date
  }
  commits: CommitNode[]
}

export function TimelineScrubber({ timeRange, commits }: TimelineScrubberProps) {
  const timelinePosition = useVisualizerStore(state => state.timelinePosition)
  const setTimelinePosition = useVisualizerStore(state => state.setTimelinePosition)

  const currentDate = useMemo(() => {
    const timeSpan = timeRange.latest.getTime() - timeRange.earliest.getTime()
    const currentTime = timeRange.earliest.getTime() + (timeSpan * timelinePosition)
    return new Date(currentTime)
  }, [timelinePosition, timeRange])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t-2 border-white">
      <div className="px-6 py-4">
        {/* Date Display */}
        <div className="text-center mb-4 font-mono text-sm">
          {format(currentDate, 'MMM dd, yyyy')}
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={timelinePosition}
            onChange={(e) => setTimelinePosition(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-800 appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, white ${timelinePosition * 100}%, #1f1f1f ${timelinePosition * 100}%)`,
            }}
            aria-label="Timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={timelinePosition}
            aria-valuetext={format(currentDate, 'MMMM dd, yyyy')}
          />

          {/* Commit ticks */}
          <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none">
            {commits.map((commit, index) => {
              const timeSpan = timeRange.latest.getTime() - timeRange.earliest.getTime()
              const position = timeSpan > 0
                ? ((commit.timestamp - timeRange.earliest.getTime()) / timeSpan) * 100
                : 0

              // Only show every Nth commit for performance
              const showInterval = Math.ceil(commits.length / 100)
              if (index % showInterval !== 0) return null

              return (
                <div
                  key={commit.sha}
                  className="absolute w-[2px] h-2 bg-gray-500"
                  style={{ left: `${position}%` }}
                />
              )
            })}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
          <span>{format(timeRange.earliest, 'MMM yyyy')}</span>
          <span>{format(timeRange.latest, 'MMM yyyy')}</span>
        </div>
      </div>
    </div>
  )
}
