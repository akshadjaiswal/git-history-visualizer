export interface GitHubRepo {
  name: string
  owner: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  defaultBranch: string
  createdAt: string
  updatedAt: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  committer: {
    name: string
    email: string
    date: string
  }
  parents: string[] // Array of parent SHAs
  stats?: {
    additions: number
    deletions: number
    total: number
  }
}

export interface GitHubBranch {
  name: string
  commitSha: string
  protected: boolean
}

export interface GitHubContributor {
  login: string
  contributions: number
  avatarUrl: string
  id: number
  email?: string
}

// 3D Visualization Data Structures
export interface CommitNode {
  sha: string
  message: string
  author: string
  authorEmail: string
  date: Date
  timestamp: number // Unix timestamp for easier sorting
  parents: string[]
  branch: string
  position: [number, number, number] // [x, y, z] coordinates
  contributorId: number
  stats?: {
    additions: number
    deletions: number
    total: number
  }
}

export interface BranchLine {
  name: string
  commits: string[] // Array of commit SHAs in order
  color: string // Grayscale value for differentiation
}

export interface VisualizationData {
  commits: CommitNode[]
  branches: BranchLine[]
  contributors: Map<string, number> // email -> unique ID
  timeRange: {
    earliest: Date
    latest: Date
  }
  stats: {
    totalCommits: number
    totalContributors: number
    totalBranches: number
  }
}

// Progress tracking for data fetching
export interface FetchProgress {
  stage: string
  current: number
  total: number
  percentage: number
}

export type FetchStage =
  | 'fetching_commits'
  | 'fetching_branches'
  | 'fetching_contributors'
  | 'processing_data'
  | 'rendering'
  | 'complete'
