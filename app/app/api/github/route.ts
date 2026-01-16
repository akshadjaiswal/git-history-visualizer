import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

// Server-side Octokit instance with token from environment
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'git-history-visualizer',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing owner or repo parameter' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'repo':
        return await getRepo(owner, repo)

      case 'commits':
        return await getCommits(owner, repo, searchParams)

      case 'branches':
        return await getBranches(owner, repo)

      case 'contributors':
        return await getContributors(owner, repo)

      case 'rateLimit':
        return await getRateLimit()

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('[GitHub API Error]', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    )
  }
}

async function getRepo(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.get({ owner, repo })
    return NextResponse.json({
      name: data.name,
      owner: data.owner.login,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      defaultBranch: data.default_branch,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      language: data.language,
      topics: data.topics || [],
      size: data.size,
      openIssues: data.open_issues_count,
      watchers: data.watchers_count,
      license: data.license?.name || null,
      isArchived: data.archived,
    })
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error('Repository not found. Please check the owner and repository name.')
    } else if (error.status === 403) {
      throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
    }
    throw error
  }
}

async function getCommits(owner: string, repo: string, searchParams: URLSearchParams) {
  const branch = searchParams.get('branch') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '100')
  const since = searchParams.get('since') || undefined
  const until = searchParams.get('until') || undefined

  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: perPage,
      page,
      since,
      until,
    })

    const commits = data.map(commit => ({
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

    return NextResponse.json(commits)
  } catch (error: any) {
    if (error.status === 403) {
      throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
    } else if (error.status === 404) {
      throw new Error('Repository or branch not found.')
    }
    throw error
  }
}

async function getBranches(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    })

    const branches = data.map(branch => ({
      name: branch.name,
      commitSha: branch.commit.sha,
      protected: branch.protected,
    }))

    return NextResponse.json(branches)
  } catch (error: any) {
    if (error.status === 403) {
      throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
    }
    throw error
  }
}

async function getContributors(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    })

    const contributors = data.map(contributor => ({
      login: contributor.login || 'Unknown',
      contributions: contributor.contributions,
      avatarUrl: contributor.avatar_url || '',
      id: contributor.id || 0,
    }))

    return NextResponse.json(contributors)
  } catch (error: any) {
    if (error.status === 403) {
      throw new Error('Rate limit exceeded. Please authenticate with GitHub for higher limits.')
    }
    throw error
  }
}

async function getRateLimit() {
  try {
    const { data } = await octokit.rateLimit.get()
    return NextResponse.json({
      limit: data.resources.core.limit,
      remaining: data.resources.core.remaining,
      reset: new Date(data.resources.core.reset * 1000),
    })
  } catch (error: any) {
    throw new Error(`Failed to fetch rate limit: ${error.message}`)
  }
}
