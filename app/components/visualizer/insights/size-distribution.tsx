'use client'

import { useState } from 'react'

interface SizeDistributionProps {
  data: {
    small: number
    medium: number
    large: number
    huge: number
  }
  totalCommits: number
}

export function SizeDistribution({ data, totalCommits }: SizeDistributionProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  const categories = [
    { label: 'Small', count: data.small, color: '#6EE7B7', range: '0-50 lines' },
    { label: 'Medium', count: data.medium, color: '#7DD3FC', range: '51-200 lines' },
    { label: 'Large', count: data.large, color: '#FDA4AF', range: '201-500 lines' },
    { label: 'Huge', count: data.huge, color: '#C4B5FD', range: '500+ lines' },
  ]

  const maxCount = Math.max(...categories.map(c => c.count), 1)

  return (
    <div className="border-r-2 md:border-r-2 border-b-2 border-white p-3 bg-black hover:bg-gray-900 transition-colors duration-200 min-h-[90px]">
      <h3 className="font-mono text-xs text-gray-400 mb-2">COMMIT SIZE</h3>

      <div className="space-y-2">
        {categories.map(cat => {
          const percentage = totalCommits > 0 ? (cat.count / totalCommits) * 100 : 0
          return (
            <div
              key={cat.label}
              className="relative"
              onMouseEnter={() => setHovered(cat.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs" style={{ color: cat.color }}>
                  {cat.label}
                </span>
                <span className="font-mono text-xs text-gray-500">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 border-2 border-gray-800 relative">
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${(cat.count / maxCount) * 100}%`,
                    backgroundColor: cat.color,
                    opacity: hovered === cat.label ? 1 : 0.7,
                  }}
                />
              </div>

              {hovered === cat.label && (
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-mono whitespace-nowrap border-2 border-white z-10"
                  style={{ backgroundColor: cat.color, color: '#000' }}
                >
                  {cat.count.toLocaleString()} commits • {cat.range}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
