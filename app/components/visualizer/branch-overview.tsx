'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import type { CommitNode, BranchLine } from '@/types/github'

interface BranchOverviewProps {
  branches: BranchLine[]
  commits: CommitNode[]
}

export function BranchOverview({ branches, commits }: BranchOverviewProps) {
  const branchStats = useMemo(() => {
    return branches.map(branch => {
      const branchCommits = commits.filter(c => c.branch === branch.name)
      const lastCommit = branchCommits[branchCommits.length - 1]

      return {
        name: branch.name,
        commitCount: branchCommits.length,
        lastActivity: lastCommit?.date,
        percentage: (branchCommits.length / commits.length) * 100,
      }
    }).sort((a, b) => b.commitCount - a.commitCount)
  }, [branches, commits])

  return (
    <div className="h-full border-2 border-white bg-black p-6 overflow-auto">
      <h2 className="font-display text-xl font-bold mb-6 border-b-2 border-white pb-2">
        Branches
      </h2>

      <div className="space-y-4">
        {branchStats.map(branch => (
          <div key={branch.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold truncate">
                {branch.name}
              </span>
              <span className="font-mono text-xs text-gray-400">
                {branch.commitCount}
              </span>
            </div>

            {/* Activity bar */}
            <div className="h-6 border border-white relative overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${branch.percentage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-black mix-blend-difference">
                {branch.percentage.toFixed(0)}%
              </span>
            </div>

            {branch.lastActivity && (
              <div className="font-mono text-xs text-gray-500 mt-1">
                Last: {format(branch.lastActivity, 'MMM d')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
