'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface VelocityTrendProps {
  data: {
    week: Date
    count: number
  }[]
}

export function VelocityTrend({ data }: VelocityTrendProps) {
  const [hoveredWeek, setHoveredWeek] = useState<typeof data[0] | null>(null)

  if (data.length === 0) {
    return (
      <div className="border-r-0 md:border-r-0 border-b-0 md:border-b-0 border-white p-3 bg-black min-h-[90px]">
        <h3 className="font-mono text-xs text-gray-400 mb-2">VELOCITY TREND</h3>
        <div className="flex items-center justify-center h-20 text-gray-600 font-mono text-xs">
          No recent activity
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...data.map(d => d.count), 1)
  const minCount = Math.min(...data.map(d => d.count))

  // Generate sparkline path
  const generatePath = () => {
    if (data.length === 0) return ''
    const width = 100
    const height = 60
    const padding = 5

    const points = data.map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * (width - padding * 2) + padding
      const y = height - padding - ((d.count / maxCount) * (height - padding * 2))
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }

  // Generate area path
  const generateAreaPath = () => {
    const linePath = generatePath()
    if (!linePath) return ''
    const width = 100
    const height = 60
    return `${linePath} L ${100 - 5},${height} L 5,${height} Z`
  }

  return (
    <div className="border-r-0 md:border-r-0 border-b-0 md:border-b-0 border-white p-3 bg-black hover:bg-gray-900 transition-colors duration-200 min-h-[90px]">
      <h3 className="font-mono text-xs text-gray-400 mb-2">VELOCITY TREND</h3>

      <div className="relative">
        <svg viewBox="0 0 100 60" className="w-full h-auto">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={generateAreaPath()} fill="url(#velocityGradient)" />

          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => {
            const width = 100
            const height = 60
            const padding = 5
            const x = (i / Math.max(data.length - 1, 1)) * (width - padding * 2) + padding
            const y = height - padding - ((d.count / maxCount) * (height - padding * 2))

            // Highlight min and max
            const isMin = d.count === minCount
            const isMax = d.count === maxCount

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isMin || isMax ? 2.5 : 1.5}
                  fill={isMax ? '#6EE7B7' : isMin ? '#FDA4AF' : '#C4B5FD'}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    opacity: hoveredWeek === d ? 1 : 0.7,
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
                  }}
                  onMouseEnter={() => setHoveredWeek(d)}
                  onMouseLeave={() => setHoveredWeek(null)}
                />
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredWeek && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-mono whitespace-nowrap border-2 border-white bg-black z-10 pointer-events-none">
            <div className="text-gray-400">Week of {format(hoveredWeek.week, 'MMM d')}</div>
            <div className="text-white font-bold">{hoveredWeek.count} commits</div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="mt-3 flex justify-between font-mono text-[10px]">
        <div>
          <span className="text-gray-400">Last 12 weeks</span>
        </div>
        <div>
          <span className="text-gray-400">Avg: </span>
          <span className="text-white">
            {Math.round(data.reduce((sum, d) => sum + d.count, 0) / data.length)}
          </span>
        </div>
      </div>
    </div>
  )
}
