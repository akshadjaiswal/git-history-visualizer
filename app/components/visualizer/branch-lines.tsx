'use client'

import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { CommitNode, BranchLine } from '@/types/github'

interface BranchLinesProps {
  branches: BranchLine[]
  commits: CommitNode[]
  isMobile?: boolean
}

export function BranchLines({ branches, commits, isMobile = false }: BranchLinesProps) {
  // Build commit lookup map
  const commitMap = useMemo(() => {
    const map = new Map<string, CommitNode>()
    commits.forEach(commit => map.set(commit.sha, commit))
    return map
  }, [commits])

  // Generate line points for each branch
  const branchPaths = useMemo(() => {
    return branches.map(branch => {
      const points = branch.commits
        .map(sha => commitMap.get(sha))
        .filter((commit): commit is CommitNode => commit !== undefined)
        .map(commit => commit.position)

      return {
        name: branch.name,
        points,
        color: branch.color,
      }
    })
  }, [branches, commitMap])

  return (
    <>
      {branchPaths.map((branch, index) => {
        if (branch.points.length < 2) return null

        return (
          <Line
            key={branch.name}
            points={branch.points}
            color={branch.color}  // Use calculated branch color instead of gray
            lineWidth={isMobile ? 1.5 : 2.5}  // Thicker for visibility
            opacity={isMobile ? 0.5 : 0.7}  // More opaque
            transparent
            dashed={false}
          />
        )
      })}
    </>
  )
}
