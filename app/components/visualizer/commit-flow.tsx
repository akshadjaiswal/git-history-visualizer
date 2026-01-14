'use client'

import { useMemo } from 'react'
import type { CommitNode } from '@/types/github'

interface CommitFlowProps {
  commits: CommitNode[]
}

export function CommitFlow({ commits }: CommitFlowProps) {
  // Generate color for each contributor
  const contributorColors = useMemo(() => {
    const colors = new Map<number, string>()
    const contributorIds = Array.from(new Set(commits.map(c => c.contributorId)))

    contributorIds.forEach((id, index) => {
      const hue = (index / contributorIds.length) * 360
      colors.set(id, `hsl(${hue}, 80%, 70%)`)
    })

    return colors
  }, [commits])

  // Group commits by month for timeline bars
  const monthlyData = useMemo(() => {
    const groups = new Map<string, { count: number; contributors: Set<number> }>()

    commits.forEach(commit => {
      const month = commit.date.toISOString().substring(0, 7) // YYYY-MM
      if (!groups.has(month)) {
        groups.set(month, { count: 0, contributors: new Set() })
      }
      const group = groups.get(month)!
      group.count++
      group.contributors.add(commit.contributorId)
    })

    return Array.from(groups.entries()).map(([month, data]) => ({
      month,
      count: data.count,
      contributorCount: data.contributors.size,
    }))
  }, [commits])

  const maxCount = Math.max(...monthlyData.map(d => d.count), 1)

  return (
    <div className="h-full border-2 border-white bg-black relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b-2 border-white">
        <h2 className="font-display text-2xl font-bold">Commit Activity</h2>
        <p className="font-mono text-sm text-gray-400 mt-1">
          {commits.length.toLocaleString()} total commits
        </p>
      </div>

      {/* Timeline visualization */}
      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex items-end gap-1 h-full">
          {monthlyData.map((data, index) => {
            const height = (data.count / maxCount) * 100

            return (
              <div
                key={data.month}
                className="flex-1 min-w-[20px] group relative cursor-pointer"
              >
                <div
                  className="w-full bg-white transition-all duration-300 group-hover:bg-gray-300"
                  style={{ height: `${height}%` }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black px-3 py-2 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border-2 border-black">
                  <div className="font-bold">{data.month}</div>
                  <div>{data.count} commits</div>
                  <div className="text-gray-600">{data.contributorCount} contributors</div>
                </div>

                {/* Month label */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-500 -rotate-45 origin-top-left whitespace-nowrap">
                  {data.month}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent commits stream */}
      <div className="p-6 border-t-2 border-white bg-gradient-to-b from-black to-gray-900 max-h-48 overflow-y-auto">
        <h3 className="font-display text-lg font-bold mb-3">Recent Commits</h3>
        <div className="space-y-2">
          {commits.slice(-10).reverse().map((commit, index) => (
            <div key={commit.sha} className="flex items-start gap-3 group">
              <div
                className="w-3 h-3 rounded-full border border-white mt-1 flex-shrink-0"
                style={{ backgroundColor: contributorColors.get(commit.contributorId) }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-white truncate group-hover:text-clip group-hover:whitespace-normal">
                  {commit.message.split('\n')[0]}
                </div>
                <div className="font-mono text-xs text-gray-500">
                  {commit.author} • {commit.date.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
