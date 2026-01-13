import type { GitHubCommit, GitHubBranch, GitHubContributor, CommitNode, BranchLine, VisualizationData } from '@/types/github'

/**
 * Process GitHub API data into 3D visualization data
 * Implements the positioning algorithm:
 * - X-axis: Time (older = negative, newer = positive)
 * - Y-axis: Branch separation
 * - Z-axis: Contributor constellation effect (circular distribution)
 */
export function processGitData(
  commits: GitHubCommit[],
  branches: GitHubBranch[],
  contributors: GitHubContributor[]
): VisualizationData {
  // 1. Create contributor map (email -> ID)
  const contributorMap = new Map<string, number>()
  contributors.forEach((contributor, index) => {
    // Use login as fallback identifier
    const email = contributor.email || `${contributor.login}@github.com`
    contributorMap.set(email, index)
  })

  // Also map contributors found in commits
  commits.forEach(commit => {
    if (!contributorMap.has(commit.author.email)) {
      contributorMap.set(commit.author.email, contributorMap.size)
    }
  })

  // 2. Sort commits by date (oldest to newest)
  const sortedCommits = [...commits].sort(
    (a, b) => new Date(a.author.date).getTime() - new Date(b.author.date).getTime()
  )

  // 3. Calculate time range
  if (sortedCommits.length === 0) {
    return {
      commits: [],
      branches: [],
      contributors: contributorMap,
      timeRange: {
        earliest: new Date(),
        latest: new Date(),
      },
      stats: {
        totalCommits: 0,
        totalContributors: 0,
        totalBranches: 0,
      },
    }
  }

  const timestamps = sortedCommits.map(c => new Date(c.author.date).getTime())
  const minTime = Math.min(...timestamps)
  const maxTime = Math.max(...timestamps)
  const timeRange = maxTime - minTime

  // 4. Build commit-to-branch map
  // Simple approach: assign commits to branches based on branch tips
  // For production: would need full git graph traversal
  const commitBranchMap = new Map<string, string>()

  // Assign branch tips
  branches.forEach(branch => {
    commitBranchMap.set(branch.commitSha, branch.name)
  })

  // For commits not explicitly on branch tips, use a simplified approach
  // In a real implementation, you'd walk the parent chain
  const defaultBranch = branches.find(b => b.name === 'main' || b.name === 'master')?.name || branches[0]?.name || 'main'

  // 5. Calculate positions for each commit
  const commitNodes: CommitNode[] = sortedCommits.map((commit, index) => {
    const timestamp = new Date(commit.author.date).getTime()
    const contributorId = contributorMap.get(commit.author.email) ?? 0

    // POSITIONING ALGORITHM:

    // X-axis: Time (normalized to -50 to +50)
    const normalizedTime = timeRange > 0
      ? ((timestamp - minTime) / timeRange) * 100 - 50
      : 0

    // Y-axis: Branch separation
    const branchName = commitBranchMap.get(commit.sha) || defaultBranch
    const branchIndex = branches.findIndex(b => b.name === branchName)
    const yPosition = branchIndex >= 0 ? branchIndex * 5 : 0 // 5 units apart

    // Z-axis: Contributor constellation effect
    // Spread contributors in a circle (radius: 10 units for moderate separation)
    const contributorCount = Math.max(contributorMap.size, 1)
    const angle = (contributorId / contributorCount) * Math.PI * 2
    const radius = 10
    const zPosition = Math.sin(angle) * radius
    const zOffset = Math.cos(angle) * radius

    return {
      sha: commit.sha,
      message: commit.message,
      author: commit.author.name,
      authorEmail: commit.author.email,
      date: new Date(commit.author.date),
      timestamp,
      parents: commit.parents,
      branch: branchName,
      position: [normalizedTime, yPosition, zPosition] as [number, number, number],
      contributorId,
      stats: commit.stats,
    }
  })

  // 6. Build branch lines
  const branchLines: BranchLine[] = branches.map((branch, index) => {
    // Find all commits on this branch
    const branchCommits = commitNodes.filter(c => c.branch === branch.name)

    // Sort by timestamp
    branchCommits.sort((a, b) => a.timestamp - b.timestamp)

    // Grayscale color based on branch index
    const grayValue = Math.floor((index / Math.max(branches.length - 1, 1)) * 128) + 64 // Range: #404040 to #C0C0C0
    const color = `#${grayValue.toString(16).padStart(2, '0').repeat(3)}`

    return {
      name: branch.name,
      commits: branchCommits.map(c => c.sha),
      color,
    }
  })

  return {
    commits: commitNodes,
    branches: branchLines,
    contributors: contributorMap,
    timeRange: {
      earliest: new Date(minTime),
      latest: new Date(maxTime),
    },
    stats: {
      totalCommits: commitNodes.length,
      totalContributors: contributorMap.size,
      totalBranches: branches.length,
    },
  }
}

/**
 * Calculate bounding box for the visualization
 * Useful for camera positioning
 */
export function calculateBoundingBox(commits: CommitNode[]): {
  min: [number, number, number]
  max: [number, number, number]
  center: [number, number, number]
} {
  if (commits.length === 0) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0],
      center: [0, 0, 0],
    }
  }

  const positions = commits.map(c => c.position)

  const min: [number, number, number] = [
    Math.min(...positions.map(p => p[0])),
    Math.min(...positions.map(p => p[1])),
    Math.min(...positions.map(p => p[2])),
  ]

  const max: [number, number, number] = [
    Math.max(...positions.map(p => p[0])),
    Math.max(...positions.map(p => p[1])),
    Math.max(...positions.map(p => p[2])),
  ]

  const center: [number, number, number] = [
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  ]

  return { min, max, center }
}
