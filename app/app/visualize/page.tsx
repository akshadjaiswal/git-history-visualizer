'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGitHubVisualization } from '@/lib/use-github-data'
import { TopBar } from '@/components/visualizer/top-bar'
import { StatsCard } from '@/components/visualizer/stats-card'
import { ContributorConstellation } from '@/components/visualizer/contributor-constellation'
import { ActivityHeatmap } from '@/components/visualizer/activity-heatmap'
import { CommitFlow } from '@/components/visualizer/commit-flow'
import { TimelineMilestones } from '@/components/visualizer/timeline-milestones'
import { BranchOverview } from '@/components/visualizer/branch-overview'
import { ErrorBoundary } from '@/components/error-boundary'

function VisualizerContent() {
  const searchParams = useSearchParams()
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data, isLoading, error, progress } = useGitHubVisualization(
    owner || '',
    repo || ''
  )

  if (!owner || !repo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-8">
          <h1 className="font-display text-4xl font-semibold mb-4">Invalid URL</h1>
          <p className="font-body text-gray-600 mb-6">
            Please provide a valid GitHub repository URL with owner and repository name.
          </p>
          <a
            href="/"
            className="inline-block border-2 border-black px-6 py-3 font-body hover:bg-black hover:text-white transition-colors duration-fast"
          >
            Go Back
          </a>
        </div>
      </div>
    )
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    const isRateLimit = errorMessage.includes('Rate limit')
    const isNotFound = errorMessage.includes('not found')

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-lg px-8">
          <h1 className="font-display text-4xl font-semibold mb-4">Error</h1>
          <p className="font-body text-gray-600 mb-6">{errorMessage}</p>

          {isRateLimit && (
            <p className="font-body text-sm text-gray-500 mb-6">
              Try authenticating with GitHub for higher rate limits (5000 req/hr instead of 60 req/hr).
            </p>
          )}

          {isNotFound && (
            <p className="font-body text-sm text-gray-500 mb-6">
              Make sure the repository exists and is public. Check the owner and repository name.
            </p>
          )}

          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="inline-block border-2 border-black px-6 py-3 font-body hover:bg-black hover:text-white transition-colors duration-fast"
            >
              Go Back
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-block border-2 border-black px-6 py-3 font-body hover:bg-black hover:text-white transition-colors duration-fast"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    const stageMessages: Record<string, string> = {
      fetching_commits: 'Fetching commits',
      fetching_branches: 'Fetching branches',
      fetching_contributors: 'Fetching contributors',
      processing_data: 'Processing 3D positions',
      rendering: 'Rendering scene',
    }

    const currentStage = stageMessages[progress.stage] || 'Loading'

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="max-w-lg w-full px-8">
          <h1 className="font-display text-4xl font-semibold mb-8 text-center">
            {currentStage}...
          </h1>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full h-2 bg-gray-800 border border-white">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Progress details */}
          <div className="text-center space-y-2">
            <p className="font-mono text-sm text-gray-400">
              {Math.round(progress.percentage)}% complete
            </p>

            {progress.stage === 'fetching_commits' && progress.total > 0 && (
              <p className="font-mono text-sm text-gray-400">
                {progress.current.toLocaleString()} / {progress.total.toLocaleString()} commits
              </p>
            )}

            {progress.total > 5000 && (
              <p className="font-body text-xs text-gray-500 mt-4">
                This may take 30-60 seconds for large repositories
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <TopBar owner={owner} repo={repo} />

      {/* Dashboard Grid */}
      <div className="min-h-[calc(100vh-64px)] mt-16 grid grid-cols-12 grid-rows-12 gap-3 p-3">
        {/* Top Left - Stats Card */}
        <div className="col-span-3 row-span-4">
          <StatsCard data={data.repoMetadata} contributors={data.contributors.size} />
        </div>

        {/* Center - Main Visualization */}
        <div className="col-span-6 row-span-8">
          <CommitFlow commits={data.commits} />
        </div>

        {/* Top Right - Contributors */}
        <div className="col-span-3 row-span-4">
          <ContributorConstellation
            contributors={Array.from(data.contributors.entries())}
            commits={data.commits}
          />
        </div>

        {/* Left Side - Timeline */}
        <div className="col-span-3 row-span-8 row-start-5">
          <TimelineMilestones commits={data.commits} timeRange={data.timeRange} />
        </div>

        {/* Right Side - Branches */}
        <div className="col-span-3 row-span-8 row-start-5">
          <BranchOverview branches={data.branches} commits={data.commits} />
        </div>

        {/* Bottom - Activity Heatmap */}
        <div className="col-span-6 row-span-4 row-start-9">
          <ActivityHeatmap commits={data.commits} timeRange={data.timeRange} />
        </div>
      </div>
    </div>
  )
}

export default function VisualizePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-display text-2xl">Loading...</p>
        </div>
      }>
        <VisualizerContent />
      </Suspense>
    </ErrorBoundary>
  )
}
