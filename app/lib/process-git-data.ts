import type { GitHubCommit, GitHubBranch, GitHubContributor, GitHubRepo, CommitNode, BranchLine, VisualizationData, CommitInsights } from '@/types/github'

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
  contributors: GitHubContributor[],
  repoMetadata: GitHubRepo
): VisualizationData {
  // 1. Create contributor map (email -> ID)
  // Use commit author emails as the source of truth since GitHub API
  // contributors don't reliably return email addresses
  const contributorMap = new Map<string, number>()

  // Build map from actual commit authors
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
      repoMetadata,
      insights: calculateCommitInsights([]),
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
    repoMetadata,
    insights: calculateCommitInsights(commitNodes),
  }
}

/**
 * Calculate commit insights for analytics dashboard
 */
export function calculateCommitInsights(commits: CommitNode[]): CommitInsights {
  if (commits.length === 0) {
    return {
      sizeDistribution: { small: 0, medium: 0, large: 0, huge: 0 },
      peakHours: [],
      messageQuality: {
        score: 0,
        conventionalCount: 0,
        shortCount: 0,
        averageLength: 0,
      },
      velocityTrend: [],
    }
  }

  // 1. Size distribution
  const sizeDistribution = { small: 0, medium: 0, large: 0, huge: 0 }
  commits.forEach(commit => {
    const total = commit.stats?.total || 0
    if (total <= 50) sizeDistribution.small++
    else if (total <= 200) sizeDistribution.medium++
    else if (total <= 500) sizeDistribution.large++
    else sizeDistribution.huge++
  })

  // 2. Peak hours
  const hourCounts = new Map<number, number>()
  commits.forEach(commit => {
    const hour = commit.date.getHours()
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
  })
  const peakHours = Array.from(hourCounts.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)

  // 3. Message quality
  const conventionalPatterns = /^(feat|fix|docs|style|refactor|test|chore|perf)(\(.*\))?:/
  let conventionalCount = 0
  let shortCount = 0
  let totalLength = 0

  commits.forEach(commit => {
    const message = commit.message.split('\n')[0]
    if (conventionalPatterns.test(message)) conventionalCount++
    if (message.length < 10) shortCount++
    totalLength += message.length
  })

  const conventionalPercent = (conventionalCount / commits.length) * 100
  const shortPercent = (shortCount / commits.length) * 100
  const score = Math.min(100, Math.max(0,
    conventionalPercent * 0.8 + (100 - shortPercent) * 0.2
  ))

  // 4. Velocity trend (last 12 weeks)
  const now = commits[commits.length - 1]?.date || new Date()
  const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000)

  const weeklyCommits = new Map<string, number>()
  commits.forEach(commit => {
    if (commit.date >= twelveWeeksAgo) {
      const weekStart = new Date(commit.date)
      weekStart.setDate(commit.date.getDate() - commit.date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      weeklyCommits.set(weekKey, (weeklyCommits.get(weekKey) || 0) + 1)
    }
  })

  const velocityTrend = Array.from(weeklyCommits.entries())
    .map(([week, count]) => ({ week: new Date(week), count }))
    .sort((a, b) => a.week.getTime() - b.week.getTime())

  return {
    sizeDistribution,
    peakHours,
    messageQuality: {
      score,
      conventionalCount,
      shortCount,
      averageLength: totalLength / commits.length,
    },
    velocityTrend,
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
