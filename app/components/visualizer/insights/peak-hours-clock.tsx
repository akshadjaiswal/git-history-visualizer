'use client'

import { useState } from 'react'

interface PeakHoursClockProps {
  data: {
    hour: number
    count: number
  }[]
}

export function PeakHoursClock({ data }: PeakHoursClockProps) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null)

  // Create hour map for quick lookup
  const hourMap = new Map(data.map(d => [d.hour, d.count]))
  const maxCount = Math.max(...data.map(d => d.count), 1)

  // Generate all 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: hourMap.get(i) || 0,
  }))

  const getColor = (count: number) => {
    const intensity = count / maxCount
    if (intensity === 0) return '#111'
    if (intensity < 0.25) return '#134E4A' // dark teal
    if (intensity < 0.5) return '#14B8A6' // teal
    if (intensity < 0.75) return '#5EEAD4' // bright teal
    return '#6EE7B7' // mint green
  }

  const cx = 50
  const cy = 50
  const radius = 35
  const innerRadius = 20

  return (
    <div className="border-r-0 md:border-r-0 border-b-2 border-white p-3 bg-black hover:bg-gray-900 transition-colors duration-200 min-h-[140px]">
      <h3 className="font-mono text-xs text-gray-400 mb-3">PEAK HOURS</h3>

      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-auto">
          {/* Center circle */}
          <circle cx={cx} cy={cy} r={innerRadius} fill="#000" stroke="#333" strokeWidth="1" />

          {/* Hour segments */}
          {hours.map(({ hour, count }) => {
            const angle = (hour / 24) * 360 - 90 // Start at top (12 o'clock)
            const nextAngle = ((hour + 1) / 24) * 360 - 90

            const x1 = cx + innerRadius * Math.cos((angle * Math.PI) / 180)
            const y1 = cy + innerRadius * Math.sin((angle * Math.PI) / 180)
            const x2 = cx + radius * Math.cos((angle * Math.PI) / 180)
            const y2 = cy + radius * Math.sin((angle * Math.PI) / 180)
            const x3 = cx + radius * Math.cos((nextAngle * Math.PI) / 180)
            const y3 = cy + radius * Math.sin((nextAngle * Math.PI) / 180)
            const x4 = cx + innerRadius * Math.cos((nextAngle * Math.PI) / 180)
            const y4 = cy + innerRadius * Math.sin((nextAngle * Math.PI) / 180)

            const path = `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`

            return (
              <path
                key={hour}
                d={path}
                fill={getColor(count)}
                stroke="#000"
                strokeWidth="0.5"
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: hoveredHour === hour ? 1 : 0.8 }}
                onMouseEnter={() => setHoveredHour(hour)}
                onMouseLeave={() => setHoveredHour(null)}
              />
            )
          })}

          {/* Hour markers for 0, 6, 12, 18 */}
          {[0, 6, 12, 18].map(hour => {
            const angle = (hour / 24) * 360 - 90
            const labelRadius = radius + 8
            const x = cx + labelRadius * Math.cos((angle * Math.PI) / 180)
            const y = cy + labelRadius * Math.sin((angle * Math.PI) / 180)

            return (
              <text
                key={hour}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono text-[6px] fill-gray-500"
              >
                {hour}
              </text>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredHour !== null && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="px-3 py-1.5 text-xs font-mono whitespace-nowrap border-2 border-white bg-black">
              <div className="text-white">
                {hoveredHour}:00 - {(hoveredHour + 1) % 24}:00
              </div>
              <div style={{ color: getColor(hourMap.get(hoveredHour) || 0) }}>
                {(hourMap.get(hoveredHour) || 0).toLocaleString()} commits
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
