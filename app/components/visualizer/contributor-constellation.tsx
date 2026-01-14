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

  // Circular positioning
  const positions = useMemo(() => {
    return topContributors.map((_, index) => {
      const angle = (index / topContributors.length) * Math.PI * 2
      const radius = 40
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
      }
    })
  }, [topContributors])

  return (
    <div className="h-full border-2 border-white bg-black p-6 overflow-hidden">
      <h2 className="font-display text-xl font-bold mb-4 border-b-2 border-white pb-2">
        Top Contributors
      </h2>

      <div className="relative h-[calc(100%-4rem)]">
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="font-mono text-4xl font-bold">
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
            <div className="w-full h-full rounded-full border-2 border-white bg-gray-800 flex items-center justify-center font-mono text-xs overflow-hidden transition-transform group-hover:scale-125">
              {contributor.email.charAt(0).toUpperCase()}
            </div>

            {/* Tooltip on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black px-2 py-1 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {contributor.email.split('@')[0]}
              <br />
              <span className="text-gray-600">{contributor.contributionCount} commits</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
