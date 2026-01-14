'use client'

import type { GitHubRepo } from '@/types/github'

interface StatsCardProps {
  data: GitHubRepo
  contributors: number
}

export function StatsCard({ data, contributors }: StatsCardProps) {
  return (
    <div className="h-auto min-h-[280px] border-2 border-white bg-black p-4 overflow-auto hover:border-[#5EEAD4] transition-colors duration-200" style={{ borderTop: '4px solid #5EEAD4' }}>
      <h2 className="font-display text-xl font-bold mb-4 border-b-2 border-white pb-2">
        Repository Stats
      </h2>

      <div className="space-y-3">
        {/* Stars */}
        <div className="flex items-center justify-between">
          <span className="font-body text-gray-400">Stars</span>
          <span className="font-mono text-3xl font-bold" style={{ color: '#6EE7B7' }}>
            {data.stars.toLocaleString()}
          </span>
        </div>

        {/* Forks */}
        <div className="flex items-center justify-between">
          <span className="font-body text-gray-400">Forks</span>
          <span className="font-mono text-3xl font-bold" style={{ color: '#7DD3FC' }}>
            {data.forks.toLocaleString()}
          </span>
        </div>

        {/* Contributors */}
        <div className="flex items-center justify-between">
          <span className="font-body text-gray-400">Contributors</span>
          <span className="font-mono text-3xl font-bold" style={{ color: '#5EEAD4' }}>
            {contributors}
          </span>
        </div>

        {/* Language Badge */}
        {data.language && (
          <div className="mt-6 pt-4 border-t border-white">
            <div className="px-3 py-1 inline-block font-mono text-sm font-semibold text-black" style={{ background: 'linear-gradient(135deg, #6EE7B7 0%, #7DD3FC 100%)' }}>
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
