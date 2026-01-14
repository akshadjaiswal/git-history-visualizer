'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import type { CommitNode } from '@/types/github'

interface TimelineMilestonesProps {
  commits: CommitNode[]
  timeRange: {
    earliest: Date
    latest: Date
  }
}

export function TimelineMilestones({ commits, timeRange }: TimelineMilestonesProps) {
  const milestones = useMemo(() => {
    if (commits.length === 0) return []

    return [
      {
        label: 'First Commit',
        date: timeRange.earliest,
        description: commits[0].message.split('\n')[0].substring(0, 50) + '...',
        color: '#6EE7B7', // Mint green
      },
      {
        label: 'Most Active',
        date: new Date((timeRange.earliest.getTime() + timeRange.latest.getTime()) / 2),
        description: 'Peak development period',
        color: '#FDA4AF', // Coral pink
      },
      {
        label: 'Latest',
        date: timeRange.latest,
        description: commits[commits.length - 1].message.split('\n')[0].substring(0, 50) + '...',
        color: '#7DD3FC', // Sky blue
      },
    ]
  }, [commits, timeRange])

  return (
    <div className="h-full border-2 border-white bg-black p-6 overflow-auto">
      <h2 className="font-display text-xl font-bold mb-6 border-b-2 border-white pb-2">
        Timeline
      </h2>

      <div className="relative">
        {/* Vertical line with gradient */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{
          background: 'linear-gradient(180deg, #5EEAD4 0%, #C4B5FD 100%)'
        }} />

        {/* Milestones */}
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative pl-14">
              {/* Circle marker */}
              <div className="absolute left-0 w-12 h-12 border-2 bg-black flex items-center justify-center" style={{ borderColor: milestone.color }}>
                <div className="w-4 h-4" style={{ backgroundColor: milestone.color }} />
              </div>

              {/* Content */}
              <div>
                <div className="font-display text-lg font-bold" style={{ color: milestone.color }}>
                  {milestone.label}
                </div>
                <div className="font-mono text-sm text-gray-400">
                  {format(milestone.date, 'MMM d, yyyy')}
                </div>
                <div className="font-body text-sm text-gray-500 mt-2">
                  {milestone.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
