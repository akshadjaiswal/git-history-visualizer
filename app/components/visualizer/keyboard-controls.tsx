'use client'

import { useEffect } from 'react'
import { useVisualizerStore } from '@/lib/visualizer-store'

export function KeyboardControls() {
  const setTimelinePosition = useVisualizerStore(state => state.setTimelinePosition)
  const timelinePosition = useVisualizerStore(state => state.timelinePosition)
  const setSelectedCommit = useVisualizerStore(state => state.setSelectedCommit)
  const toggleFilterPanel = useVisualizerStore(state => state.toggleFilterPanel)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          // Scrub backward
          e.preventDefault()
          setTimelinePosition(Math.max(0, timelinePosition - 0.01))
          break

        case 'ArrowRight':
          // Scrub forward
          e.preventDefault()
          setTimelinePosition(Math.min(1, timelinePosition + 0.01))
          break

        case 'Escape':
          // Close panels
          e.preventDefault()
          setSelectedCommit(null)
          break

        case ' ':
        case 'Space':
          // Reset timeline to end
          e.preventDefault()
          setTimelinePosition(1)
          break

        case 'f':
        case 'F':
          // Toggle filter panel
          e.preventDefault()
          toggleFilterPanel()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [timelinePosition, setTimelinePosition, setSelectedCommit, toggleFilterPanel])

  return null
}
