import type { GitHubRepo, GitHubCommit, GitHubBranch, GitHubContributor, FetchProgress } from '@/types/github'

export class GitHubClient {
  private baseUrl: string

  constructor() {
    // Use server-side API route for all GitHub requests
    this.baseUrl = '/api/github'

    // Log that we're using server-side API (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[GitHub Client] Using server-side API with authentication')
    }
  }

  /**
   * Fetch repository metadata
   */
  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    try {
      const url = `${this.baseUrl}?action=repo&owner=${owner}&repo=${repo}`
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch repository')
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch repository: ${error.message}`)
    }
  }

  /**
   * Fetch paginated commits from a repository
   */
  async getCommits(
    owner: string,
    repo: string,
    options: {
      branch?: string
      perPage?: number
      page?: number
      since?: string
      until?: string
    } = {}
  ): Promise<GitHubCommit[]> {
    try {
      const params = new URLSearchParams({
        action: 'commits',
        owner,
        repo,
        page: String(options.page || 1),
        perPage: String(options.perPage || 100),
      })

      if (options.branch) params.append('branch', options.branch)
      if (options.since) params.append('since', options.since)
      if (options.until) params.append('until', options.until)

      const url = `${this.baseUrl}?${params.toString()}`
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch commits')
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch commits: ${error.message}`)
    }
  }

  /**
   * Fetch all commits from a repository with progress tracking
   * @param owner Repository owner
   * @param repo Repository name
   * @param branch Optional branch name
   * @param onProgress Optional callback for progress updates
   * @param maxCommits Maximum number of commits to fetch (default: 10000 for performance)
   */
  async getAllCommits(
    owner: string,
    repo: string,
    branch?: string,
    onProgress?: (progress: FetchProgress) => void,
    maxCommits: number = 10000
  ): Promise<GitHubCommit[]> {
    const allCommits: GitHubCommit[] = []
    let page = 1
    let hasMore = true

    try {
      while (hasMore && allCommits.length < maxCommits) {
        const commits = await this.getCommits(owner, repo, { branch, page, perPage: 100 })
        allCommits.push(...commits)

        // Report progress
        if (onProgress) {
          const percentage = Math.min((allCommits.length / maxCommits) * 100, 100)
          onProgress({
            stage: 'fetching_commits',
            current: allCommits.length,
            total: maxCommits,
            percentage,
          })
        }

        if (commits.length < 100) {
          hasMore = false
        } else {
          page++
        }

        // Safety limit reached
        if (allCommits.length >= maxCommits) {
          console.warn(`Reached ${maxCommits} commit limit`)
          hasMore = false
        }
      }

      return allCommits
    } catch (error: any) {
      throw new Error(`Failed to fetch all commits: ${error.message}`)
    }
  }

  /**
   * Fetch all branches from a repository
   */
  async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    try {
      const url = `${this.baseUrl}?action=branches&owner=${owner}&repo=${repo}`
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch branches')
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch branches: ${error.message}`)
    }
  }

  /**
   * Fetch contributors from a repository
   */
  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    try {
      const url = `${this.baseUrl}?action=contributors&owner=${owner}&repo=${repo}`
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch contributors')
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch contributors: ${error.message}`)
    }
  }

  /**
   * Check the current rate limit status
   */
  async getRateLimit(): Promise<{
    limit: number
    remaining: number
    reset: Date
  }> {
    try {
      const url = `${this.baseUrl}?action=rateLimit`
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch rate limit')
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch rate limit: ${error.message}`)
    }
  }
}

/**
 * Create a GitHub client instance
 * Uses server-side API route which handles authentication securely
 */
export function createGitHubClient(): GitHubClient {
  return new GitHubClient()
}
