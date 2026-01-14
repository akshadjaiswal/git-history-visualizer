'use client'

import type { GitHubRepo } from '@/types/github'

interface StatsCardProps {
  data: GitHubRepo
  contributors: number
}

export function StatsCard({ data, contributors }: StatsCardProps) {
  return (
    <div className="h-full border-2 border-white bg-black p-6 overflow-auto">
      <h2 className="font-display text-xl font-bold mb-6 border-b-2 border-white pb-2">
        Repository Stats
      </h2>

      <div className="space-y-4">
        {/* Stars */}
        <div className="flex items-center justify-between">
          <span className="font-body text-gray-400">Stars</span>
          <span className="font-mono text-3xl font-bold">
            {data.stars.toLocaleString()}
          </span>
        </div>

        {/* Forks */}
        <div className="flex items-center justify-between">
          <span className="font-body text-gray-400">Forks</span>
          <span className="font-mono text-3xl font-bold">
            {data.forks.toLocaleString()}
          </span>
        </div>

        {/* Contributors */}
        <div className="flex items-center justify-between">
          <span className="font-body text-gray-400">Contributors</span>
          <span className="font-mono text-3xl font-bold">
            {contributors}
          </span>
        </div>

        {/* Language Badge */}
        {data.language && (
          <div className="mt-6 pt-4 border-t border-white">
            <div className="bg-white text-black px-3 py-1 inline-block font-mono text-sm">
              {data.language}
            </div>
          </div>
        )}

        {/* Size */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-body text-gray-500">Size</span>
          <span className="font-mono text-gray-400">
            {(data.size / 1024).toFixed(1)} MB
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-body text-gray-500">Updated</span>
          <span className="font-mono text-gray-400">
            {new Date(data.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}
