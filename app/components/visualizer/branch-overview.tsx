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
    const gradients = [
      { from: '#C4B5FD', to: '#FDA4AF' }, // Lavender to pink (main/highest)
      { from: '#7DD3FC', to: '#5EEAD4' }, // Sky to teal
      { from: '#FED7AA', to: '#FDA4AF' }, // Peach to coral
      { from: '#6EE7B7', to: '#7DD3FC' }, // Mint to sky
    ]

    return branches.map((branch, index) => {
      const branchCommits = commits.filter(c => c.branch === branch.name)
      const lastCommit = branchCommits[branchCommits.length - 1]

      return {
        name: branch.name,
        commitCount: branchCommits.length,
        lastActivity: lastCommit?.date,
        percentage: (branchCommits.length / commits.length) * 100,
        gradient: gradients[index % gradients.length],
      }
    }).sort((a, b) => b.commitCount - a.commitCount)
  }, [branches, commits])

  return (
    <div className="h-auto min-h-[200px] max-h-[310px] border-2 border-white bg-black p-4 overflow-y-auto">
      <h2 className="font-display text-xl font-bold mb-4 border-b-2 border-white pb-2">
        Branches
      </h2>

      <div className="space-y-3">
        {branchStats.map(branch => (
          <div key={branch.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold truncate">
                {branch.name}
              </span>
              <span className="font-mono text-xs" style={{ color: branch.gradient.from }}>
                {branch.commitCount}
              </span>
            </div>

            {/* Activity bar */}
            <div className="h-6 border-2 relative overflow-hidden transition-all hover:brightness-125" style={{ borderColor: branch.gradient.from }}>
              <div
                className="h-full transition-all"
                style={{
                  width: `${branch.percentage}%`,
                  background: `linear-gradient(90deg, ${branch.gradient.from} 0%, ${branch.gradient.to} 100%)`
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">
                <span className="bg-black text-white px-2 py-0.5 rounded-sm">
                  {branch.percentage.toFixed(0)}%
                </span>
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
