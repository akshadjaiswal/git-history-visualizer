'use client'

import { useMemo, useState } from 'react'
import type { CommitNode } from '@/types/github'

interface CommitFlowProps {
  commits: CommitNode[]
}

export function CommitFlow({ commits }: CommitFlowProps) {
  // Generate pastel color for each contributor
  const contributorColors = useMemo(() => {
    const colors = new Map<number, string>()
    const contributorIds = Array.from(new Set(commits.map(c => c.contributorId)))
    const pastelColors = ['#FDA4AF', '#FED7AA', '#6EE7B7', '#7DD3FC', '#C4B5FD', '#5EEAD4']

    contributorIds.forEach((id, index) => {
      colors.set(id, pastelColors[index % pastelColors.length])
    })

    return colors
  }, [commits])

  // Group commits by month for timeline bars
  const monthlyData = useMemo(() => {
    const groups = new Map<string, { count: number; contributors: Set<number> }>()

    commits.forEach(commit => {
      const month = commit.date.toISOString().substring(0, 7) // YYYY-MM
      if (!groups.has(month)) {
        groups.set(month, { count: 0, contributors: new Set() })
      }
      const group = groups.get(month)!
      group.count++
      group.contributors.add(commit.contributorId)
    })

    return Array.from(groups.entries()).map(([month, data]) => ({
      month,
      count: data.count,
      contributorCount: data.contributors.size,
    }))
  }, [commits])

  const maxCount = Math.max(...monthlyData.map(d => d.count), 1)

  const [hoveredMonth, setHoveredMonth] = useState<typeof monthlyData[0] | null>(null)

  // Helper function to generate line path
  const generateLinePath = (data: typeof monthlyData, max: number) => {
    if (data.length === 0) return ''
    const points = data.map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * 1000
      const y = 300 - ((d.count / max) * 280) // 280 max height, 20px padding
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }

  // Helper function to generate area path
  const generateAreaPath = (data: typeof monthlyData, max: number) => {
    if (data.length === 0) return ''
    const linePath = generateLinePath(data, max)
    const lastX = 1000
    return `${linePath} L ${lastX},300 L 0,300 Z`
  }

  // Get color based on timeline position
  const getPointColor = (index: number) => {
    const progress = index / Math.max(monthlyData.length - 1, 1)
    if (progress < 0.33) return '#6EE7B7' // Mint green (early)
    if (progress < 0.66) return '#7DD3FC' // Sky blue (middle)
    return '#C4B5FD' // Lavender (recent)
  }

  return (
    <div className="h-auto min-h-[400px] max-h-[500px] border-2 border-white bg-black relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-white">
        <h2 className="font-display text-2xl font-bold">Commit Activity</h2>
        <p className="font-mono text-sm text-gray-400 mt-1">
          {commits.length.toLocaleString()} total commits
        </p>
      </div>

      {/* SVG Line/Area Chart */}
      <div className="flex-1 p-4 relative min-h-[200px]">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.05"/>
            </linearGradient>
          </defs>

          {/* Reference grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={300 - (y * 2.8)}
              x2="1000"
              y2={300 - (y * 2.8)}
              stroke="#333"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path
            d={generateAreaPath(monthlyData, maxCount)}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d={generateLinePath(monthlyData, maxCount)}
            fill="none"
            stroke="white"
            strokeWidth="2"
          />

          {/* Data points */}
          {monthlyData.map((data, index) => {
            const x = (index / Math.max(monthlyData.length - 1, 1)) * 1000
            const y = 300 - ((data.count / maxCount) * 280)
            const color = getPointColor(index)

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  className="cursor-pointer transition-all"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
                  onMouseEnter={() => setHoveredMonth(data)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
                {hoveredMonth === data && (
                  <g>
                    {/* Tooltip background */}
                    <rect
                      x={Math.min(Math.max(x - 60, 0), 880)}
                      y={Math.max(y - 60, 10)}
                      width="120"
                      height="50"
                      fill={color}
                      rx="4"
                    />
                    {/* Tooltip text */}
                    <text
                      x={Math.min(Math.max(x, 60), 940)}
                      y={Math.max(y - 40, 30)}
                      textAnchor="middle"
                      className="font-mono text-xs font-bold"
                      fill="#000"
                    >
                      <tspan x={Math.min(Math.max(x, 60), 940)} dy="0">{data.month}</tspan>
                      <tspan x={Math.min(Math.max(x, 60), 940)} dy="15">{data.count} commits</tspan>
                      <tspan x={Math.min(Math.max(x, 60), 940)} dy="15">{data.contributorCount} contributors</tspan>
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>

        {/* Month labels */}
        <div className="absolute bottom-0 left-4 right-4 h-8 pointer-events-none">
          {monthlyData.filter((_, i) => i % 3 === 0).map((data, idx) => {
            const originalIndex = idx * 3
            const x = (originalIndex / Math.max(monthlyData.length - 1, 1)) * 100
            return (
              <div
                key={data.month}
                className="absolute text-xs font-mono text-gray-500 whitespace-nowrap"
                style={{
                  left: `${x}%`,
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top left',
                  marginTop: '4px'
                }}
              >
                {data.month}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent commits stream */}
      <div className="p-4 border-t-2 border-white bg-gradient-to-b from-black to-gray-900 max-h-40 overflow-y-auto">
        <h3 className="font-display text-lg font-bold mb-3">Recent Commits</h3>
        <div className="space-y-2">
          {commits.slice(-10).reverse().map((commit, index) => (
            <div key={commit.sha} className="flex items-start gap-3 group">
              <div
                className="w-4 h-4 rounded-full border border-white mt-1 flex-shrink-0"
                style={{ backgroundColor: contributorColors.get(commit.contributorId) }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-white truncate group-hover:text-clip group-hover:whitespace-normal">
                  {commit.message.split('\n')[0]}
                </div>
                <div className="font-mono text-xs text-gray-500">
                  {commit.author} • {commit.date.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
