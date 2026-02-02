'use client'

import { useState } from 'react'

interface MessageQualityProps {
  data: {
    score: number
    conventionalCount: number
    shortCount: number
    averageLength: number
  }
}

export function MessageQuality({ data }: MessageQualityProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getColor = (score: number) => {
    if (score < 40) return '#FDA4AF' // coral - poor
    if (score < 70) return '#FED7AA' // peach - good
    return '#6EE7B7' // mint - excellent
  }

  const getLabel = (score: number) => {
    if (score < 40) return 'Poor'
    if (score < 70) return 'Good'
    return 'Excellent'
  }

  const color = getColor(data.score)
  const label = getLabel(data.score)

  return (
    <div
      className="border-r-2 md:border-r-2 border-b-0 md:border-b-0 border-white p-3 bg-black hover:bg-gray-900 transition-colors duration-200 cursor-pointer min-h-[90px]"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <h3 className="font-mono text-xs text-gray-400 mb-2">MESSAGE QUALITY</h3>

      <div className="space-y-3">
        {/* Score gauge */}
        <div className="relative">
          <div className="h-6 border-2 border-gray-800 relative overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${data.score}%`,
                backgroundColor: color,
              }}
            />
            {/* Score indicator line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white"
              style={{ left: `${data.score}%` }}
            />
          </div>

          {/* Score labels */}
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[10px] text-gray-600">0</span>
            <span className="font-mono text-[10px] text-gray-600">50</span>
            <span className="font-mono text-[10px] text-gray-600">100</span>
          </div>
        </div>

        {/* Score value */}
        <div className="text-center">
          <div className="font-mono text-2xl font-bold" style={{ color }}>
            {Math.round(data.score)}
          </div>
          <div className="font-mono text-xs" style={{ color }}>
            {label}
          </div>
        </div>

        {/* Details on hover */}
        {showDetails && (
          <div className="space-y-1 pt-2 border-t-2 border-gray-800">
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-gray-400">Conventional:</span>
              <span className="text-white">{data.conventionalCount}</span>
            </div>
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-gray-400">Too short:</span>
              <span className="text-white">{data.shortCount}</span>
            </div>
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-gray-400">Avg length:</span>
              <span className="text-white">{Math.round(data.averageLength)} chars</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
