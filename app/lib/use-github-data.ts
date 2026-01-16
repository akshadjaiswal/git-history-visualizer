'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { createGitHubClient } from './github-client'
import { processGitData } from './process-git-data'
import type { FetchProgress, VisualizationData } from '@/types/github'

/**
 * Hook to fetch repository metadata
 */
export function useGitHubRepo(owner: string, repo: string) {
  return useQuery({
    queryKey: ['repo', owner, repo],
    queryFn: async () => {
      const client = createGitHubClient()
      return client.getRepo(owner, repo)
    },
    enabled: !!owner && !!repo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to fetch and process all visualization data with progress tracking
 */
export function useGitHubVisualization(
  owner: string,
  repo: string,
  branch?: string,
  maxCommits?: number
) {
  const [progress, setProgress] = useState<FetchProgress>({
    stage: 'fetching_commits',
    current: 0,
    total: 100,
    percentage: 0,
  })

  const query = useQuery({
    queryKey: ['visualization', owner, repo, branch, maxCommits],
    queryFn: async (): Promise<VisualizationData> => {
      const client = createGitHubClient()

      // Determine max commits based on device
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const commitLimit = maxCommits || (isMobile ? 2500 : 5000)

      try {
        // Stage 0: Fetch repository metadata
        setProgress({
          stage: 'fetching_commits',
          current: 0,
          total: commitLimit,
          percentage: 0,
        })

        const repoMetadata = await client.getRepo(owner, repo)

        // Stage 1: Fetch commits with progress
        setProgress({
          stage: 'fetching_commits',
          current: 0,
          total: commitLimit,
          percentage: 5,
        })

        const commits = await client.getAllCommits(
          owner,
          repo,
          branch,
          (commitProgress) => {
            setProgress({
              stage: 'fetching_commits',
              current: commitProgress.current,
              total: commitProgress.total,
              percentage: 5 + (commitProgress.percentage * 0.55), // 5-60% of total progress
            })
          },
          commitLimit
        )

        // Stage 2: Fetch branches
        setProgress({
          stage: 'fetching_branches',
          current: 0,
          total: 1,
          percentage: 60,
        })

        const branches = await client.getBranches(owner, repo)

        setProgress({
          stage: 'fetching_branches',
          current: 1,
          total: 1,
          percentage: 70,
        })

        // Stage 3: Fetch contributors
        setProgress({
          stage: 'fetching_contributors',
          current: 0,
          total: 1,
          percentage: 70,
        })

        const contributors = await client.getContributors(owner, repo)

        setProgress({
          stage: 'fetching_contributors',
          current: 1,
          total: 1,
          percentage: 80,
        })

        // Stage 4: Process data
        setProgress({
          stage: 'processing_data',
          current: 0,
          total: 1,
          percentage: 80,
        })

        const visualizationData = processGitData(commits, branches, contributors, repoMetadata)

        setProgress({
          stage: 'processing_data',
          current: 1,
          total: 1,
          percentage: 95,
        })

        // Stage 5: Rendering (will be updated by visualizer component)
        setProgress({
          stage: 'rendering',
          current: 0,
          total: 1,
          percentage: 95,
        })

        // Return visualization data (already includes repoMetadata)
        return visualizationData
      } catch (error) {
        console.error('Error fetching visualization data:', error)
        throw error
      }
    },
    enabled: !!owner && !!repo,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  })

  return {
    ...query,
    progress,
    setProgress,
  }
}

/**
 * Hook for GitHub authentication state
 */
export function useGitHubAuth() {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('github_token')
    }
    return null
  })

  const setToken = (newToken: string | null) => {
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('github_token', newToken)
      } else {
        localStorage.removeItem('github_token')
      }
      setTokenState(newToken)
    }
  }

  const login = (authToken: string) => {
    setToken(authToken)
  }

  const logout = () => {
    setToken(null)
  }

  const isAuthenticated = !!token

  return {
    token,
    isAuthenticated,
    login,
    logout,
  }
}
