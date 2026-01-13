import { Octokit } from '@octokit/rest'
import type { GitHubRepo, GitHubCommit, GitHubBranch, GitHubContributor, FetchProgress } from '@/types/github'

export class GitHubClient {
  private octokit: Octokit

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token, // Optional: for higher rate limits and private repos
    })
  }

  /**
   * Fetch repository metadata
   */
  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    try {
      const { data } = await this.octokit.repos.get({ owner, repo })
      return {
        name: data.name,
        owner: data.owner.login,
        fullName: data.full_name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        defaultBranch: data.default_branch,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error('Repository not found. Please check the owner and repository name.')
      } else if (error.status === 403) {
        throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
      }
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
      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        sha: options.branch,
        per_page: options.perPage || 100,
        page: options.page || 1,
        since: options.since,
        until: options.until,
      })

      return data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || 'Unknown',
          email: commit.commit.author?.email || 'unknown@example.com',
          date: commit.commit.author?.date || new Date().toISOString(),
        },
        committer: {
          name: commit.commit.committer?.name || 'Unknown',
          email: commit.commit.committer?.email || 'unknown@example.com',
          date: commit.commit.committer?.date || new Date().toISOString(),
        },
        parents: commit.parents.map(p => p.sha),
      }))
    } catch (error: any) {
      if (error.status === 403) {
        throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
      } else if (error.status === 404) {
        throw new Error('Repository or branch not found.')
      }
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
      const { data } = await this.octokit.repos.listBranches({
        owner,
        repo,
        per_page: 100,
      })

      return data.map(branch => ({
        name: branch.name,
        commitSha: branch.commit.sha,
        protected: branch.protected,
      }))
    } catch (error: any) {
      if (error.status === 403) {
        throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
      }
      throw new Error(`Failed to fetch branches: ${error.message}`)
    }
  }

  /**
   * Fetch contributors from a repository
   */
  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    try {
      const { data } = await this.octokit.repos.listContributors({
        owner,
        repo,
        per_page: 100,
      })

      return data.map(contributor => ({
        login: contributor.login || 'Unknown',
        contributions: contributor.contributions,
        avatarUrl: contributor.avatar_url || '',
        id: contributor.id || 0,
      }))
    } catch (error: any) {
      if (error.status === 403) {
        throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
      }
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
      const { data } = await this.octokit.rateLimit.get()
      return {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000),
      }
    } catch (error: any) {
      throw new Error(`Failed to fetch rate limit: ${error.message}`)
    }
  }
}

/**
 * Create a GitHub client instance
 * Checks for auth token in localStorage
 */
export function createGitHubClient(): GitHubClient {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('github_token')
    return new GitHubClient(token || undefined)
  }
  return new GitHubClient()
}
