'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGitHubVisualization } from '@/lib/use-github-data'
import { TopBar } from '@/components/visualizer/top-bar'
import { StatsCard } from '@/components/visualizer/stats-card'
import { ContributorConstellation } from '@/components/visualizer/contributor-constellation'
import { ActivityHeatmap } from '@/components/visualizer/activity-heatmap'
import { CommitIntelligence } from '@/components/visualizer/commit-intelligence'
import { TimelineMilestones } from '@/components/visualizer/timeline-milestones'
import { BranchOverview } from '@/components/visualizer/branch-overview'
import { ErrorBoundary } from '@/components/error-boundary'
import { ExportModal } from '@/components/visualizer/export-modal'
import { exportDashboardToPNG } from '@/lib/export-scene'

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
        <div className="text-center max-w-2xl px-8">
          {isRateLimit && (
            <div className="space-y-3 mb-6">
              <div className="text-5xl mb-2">⏰</div>
              <h1 className="font-display text-3xl font-semibold text-gray-800 mb-2">
                We're Taking a Break
              </h1>
              <p className="font-body text-gray-600 text-lg">
                This repository has reached GitHub's hourly request limit.
              </p>
              <p className="font-body text-gray-700 font-semibold text-xl">
                Please try again in about an hour.
              </p>
              <p className="font-body text-sm text-gray-500 mt-4">
                You can also try visualizing a different repository in the meantime.
              </p>
            </div>
          )}

          {isNotFound && (
            <div className="space-y-3 mb-6">
              <div className="text-5xl mb-2">🔍</div>
              <h1 className="font-display text-3xl font-semibold text-gray-800 mb-2">
                Repository Not Found
              </h1>
              <p className="font-body text-gray-600 mb-4">
                We couldn't find this repository. Please check:
              </p>
              <ul className="text-left inline-block text-sm text-gray-600 space-y-1 mb-4">
                <li>• The repository URL is correct</li>
                <li>• The repository is public (we can't access private repos)</li>
                <li>• The owner and repository name are spelled correctly</li>
              </ul>
            </div>
          )}

          {!isRateLimit && !isNotFound && (
            <div className="space-y-3 mb-6">
              <div className="text-5xl mb-2">😕</div>
              <h1 className="font-display text-3xl font-semibold text-gray-800 mb-2">
                Something Went Wrong
              </h1>
              <p className="font-body text-gray-600 mb-4">
                {errorMessage}
              </p>
              <p className="font-body text-sm text-gray-500">
                Try refreshing the page or selecting a different repository.
              </p>
            </div>
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
    <div className="min-h-screen bg-black text-white pt-16 visualizer-dashboard">
      {/* Top Bar */}
      <TopBar owner={owner} repo={repo} />

      {/* Dashboard Grid - Flexible rows */}
      <div className="px-2 md:px-4 py-3 md:py-4 space-y-3 md:space-y-4">
        {/* Row 1: Top panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div className="col-span-full md:col-span-3">
            <StatsCard data={data.repoMetadata} contributors={data.contributors.size} />
          </div>
          <div className="col-span-full md:col-span-6">
            <CommitIntelligence commits={data.commits} insights={data.insights} />
          </div>
          <div className="col-span-full md:col-span-3">
            <ContributorConstellation
              contributors={Array.from(data.contributors.entries())}
              commits={data.commits}
            />
          </div>
        </div>

        {/* Row 2: Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4">
          <div className="col-span-full md:col-span-3">
            <TimelineMilestones commits={data.commits} timeRange={data.timeRange} />
          </div>
          <div className="col-span-full md:col-span-6">
            <ActivityHeatmap commits={data.commits} timeRange={data.timeRange} />
          </div>
          <div className="col-span-full md:col-span-3">
            <BranchOverview branches={data.branches} commits={data.commits} />
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal onExport={(format, resolution) => {
        if (format === 'png') {
          exportDashboardToPNG(resolution)
        }
      }} />
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
