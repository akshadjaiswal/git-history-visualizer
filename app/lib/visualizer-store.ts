import { create } from 'zustand'
import type { CommitNode } from '@/types/github'

interface VisualizerStore {
  // Selection state
  selectedCommit: CommitNode | null
  setSelectedCommit: (commit: CommitNode | null) => void

  // Filter state
  filteredContributors: Set<number> // Contributor IDs to HIDE (empty = show all)
  toggleContributor: (id: number) => void
  clearContributorFilter: () => void

  // Date range filter
  dateRange: {
    start: Date | null
    end: Date | null
  }
  setDateRange: (start: Date | null, end: Date | null) => void

  // Timeline state (time travel)
  timelinePosition: number // 0-1, represents current time position
  setTimelinePosition: (position: number) => void

  // UI state
  showFilterPanel: boolean
  toggleFilterPanel: () => void
  showExportModal: boolean
  setShowExportModal: (show: boolean) => void

  // Utility functions
  getFilteredCommits: (commits: CommitNode[]) => CommitNode[]
  resetFilters: () => void
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  // Initial state
  selectedCommit: null,
  filteredContributors: new Set(),
  dateRange: { start: null, end: null },
  timelinePosition: 1, // Start at end (latest commits)
  showFilterPanel: false,
  showExportModal: false,

  // Actions
  setSelectedCommit: (commit) => set({ selectedCommit: commit }),

  toggleContributor: (id) => {
    const current = new Set(get().filteredContributors)
    if (current.has(id)) {
      current.delete(id)
    } else {
      current.add(id)
    }
    set({ filteredContributors: current })
  },

  clearContributorFilter: () => set({ filteredContributors: new Set() }),

  setDateRange: (start, end) => set({ dateRange: { start, end } }),

  setTimelinePosition: (position) => set({ timelinePosition: Math.max(0, Math.min(1, position)) }),

  toggleFilterPanel: () => set((state) => ({ showFilterPanel: !state.showFilterPanel })),

  setShowExportModal: (show) => set({ showExportModal: show }),

  // Computed values
  getFilteredCommits: (commits) => {
    const { filteredContributors, dateRange, timelinePosition } = get()

    if (commits.length === 0) return []

    // Calculate time cutoff based on timeline position
    const timestamps = commits.map(c => c.timestamp)
    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)
    const totalTime = maxTime - minTime
    const cutoffTime = minTime + (totalTime * timelinePosition)

    return commits.filter(commit => {
      // Filter by contributor (Set contains IDs to HIDE)
      if (filteredContributors.has(commit.contributorId)) {
        return false
      }

      // Filter by date range
      if (dateRange.start && commit.date < dateRange.start) return false
      if (dateRange.end && commit.date > dateRange.end) return false

      // Filter by timeline position (time travel)
      if (commit.timestamp > cutoffTime) return false

      return true
    })
  },

  resetFilters: () => set({
    filteredContributors: new Set(),
    dateRange: { start: null, end: null },
    timelinePosition: 1,
    selectedCommit: null,
  }),
}))
