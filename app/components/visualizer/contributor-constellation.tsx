'use client'

import { useMemo } from 'react'
import type { CommitNode } from '@/types/github'

interface ContributorConstellationProps {
  contributors: [string, number][]
  commits: CommitNode[]
}

export function ContributorConstellation({ contributors, commits }: ContributorConstellationProps) {
  // Calculate contribution counts
  const topContributors = useMemo(() => {
    const counts = new Map<number, number>()
    commits.forEach(commit => {
      counts.set(commit.contributorId, (counts.get(commit.contributorId) || 0) + 1)
    })

    return contributors
      .map(([email, id]) => ({
        email,
        id,
        contributionCount: counts.get(id) || 0,
      }))
      .sort((a, b) => b.contributionCount - a.contributionCount)
      .slice(0, 10) // Top 10
  }, [contributors, commits])

  // Circular positioning and colors
  const positions = useMemo(() => {
    const colors = ['#7DD3FC', '#6EE7B7', '#C4B5FD', '#FDA4AF', '#5EEAD4', '#FED7AA']
    return topContributors.map((_, index) => {
      const angle = (index / topContributors.length) * Math.PI * 2
      const radius = 40
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        color: colors[index % colors.length],
      }
    })
  }, [topContributors])

  return (
    <div className="h-auto min-h-[280px] border-2 border-white bg-black p-4 overflow-hidden">
      <h2 className="font-display text-xl font-bold mb-4 border-b-2 border-white pb-2">
        Top Contributors
      </h2>

      <div className="relative h-[220px]">
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="font-mono text-4xl font-bold" style={{
              background: 'linear-gradient(135deg, #7DD3FC 0%, #C4B5FD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {topContributors.length}
            </div>
            <div className="font-body text-sm text-gray-400">
              contributors
            </div>
          </div>
        </div>

        {/* Contributor circles */}
        {topContributors.map((contributor, index) => (
          <div
            key={contributor.id}
            className="absolute w-12 h-12 -ml-6 -mt-6 group cursor-pointer"
            style={{
              left: `${positions[index].x}%`,
              top: `${positions[index].y}%`,
            }}
          >
            {/* Circle */}
            <div
              className="w-full h-full rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold overflow-hidden transition-all group-hover:scale-125 text-black"
              style={{
                backgroundColor: positions[index].color,
                borderColor: positions[index].color,
              }}
            >
              {contributor.email.charAt(0).toUpperCase()}
            </div>

            {/* Tooltip on hover */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-black px-3 py-2 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 rounded"
              style={{ backgroundColor: positions[index].color }}
            >
              <div className="font-bold">{contributor.email.split('@')[0]}</div>
              <div className="text-xs opacity-80">{contributor.contributionCount} commits</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
