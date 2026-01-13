'use client'

import { useVisualizerStore } from '@/lib/visualizer-store'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface FilterPanelProps {
  contributors: [string, number][] // [email, id]
}

export function FilterPanel({ contributors }: FilterPanelProps) {
  const showFilterPanel = useVisualizerStore(state => state.showFilterPanel)
  const toggleFilterPanel = useVisualizerStore(state => state.toggleFilterPanel)
  const filteredContributors = useVisualizerStore(state => state.filteredContributors)
  const toggleContributor = useVisualizerStore(state => state.toggleContributor)
  const clearContributorFilter = useVisualizerStore(state => state.clearContributorFilter)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleFilterPanel}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white border-2 border-black p-3 hover:bg-black hover:text-white transition-colors duration-fast"
        aria-label={showFilterPanel ? 'Close filter panel' : 'Open filter panel'}
      >
        {showFilterPanel ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Panel */}
      <motion.div
        initial={false}
        animate={{ x: showFilterPanel ? 0 : '-100%' }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-20 bottom-20 w-full md:w-80 bg-white border-r-2 border-black z-30 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl font-semibold">Filters</h2>
            {filteredContributors.size > 0 && (
              <button
                onClick={clearContributorFilter}
                className="text-xs font-body underline hover:no-underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Contributors */}
          <div className="mb-8">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">
              Contributors ({contributors.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {contributors.map(([email, id]) => {
                const isChecked = filteredContributors.size === 0 || filteredContributors.has(id)

                return (
                  <label key={id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleContributor(id)}
                      className="w-4 h-4 border-2 border-black cursor-pointer"
                    />
                    <span className="text-sm truncate font-body group-hover:underline">
                      {email}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
