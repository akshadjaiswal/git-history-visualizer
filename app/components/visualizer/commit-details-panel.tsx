'use client'

import { useVisualizerStore } from '@/lib/visualizer-store'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CommitDetailsPanel() {
  const selectedCommit = useVisualizerStore(state => state.selectedCommit)
  const setSelectedCommit = useVisualizerStore(state => state.setSelectedCommit)

  return (
    <AnimatePresence>
      {selectedCommit && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white border-l-2 border-black z-50 overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-display text-2xl font-semibold">Commit Details</h2>
              <button
                onClick={() => setSelectedCommit(null)}
                className="p-2 hover:bg-black hover:text-white transition-colors duration-fast"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">SHA</label>
                <code className="block font-mono text-sm mt-1 break-all">
                  {selectedCommit.sha.slice(0, 7)}
                </code>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">Message</label>
                <p className="mt-1 text-sm font-body whitespace-pre-wrap">
                  {selectedCommit.message}
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">Author</label>
                <p className="mt-1 text-sm font-body">{selectedCommit.author}</p>
                <p className="text-xs text-gray-500 font-mono">{selectedCommit.authorEmail}</p>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">Date</label>
                <p className="mt-1 text-sm font-mono">
                  {format(selectedCommit.date, 'PPpp')}
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">Branch</label>
                <p className="mt-1 text-sm font-body">{selectedCommit.branch}</p>
              </div>

              {selectedCommit.stats && (
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase">Changes</label>
                  <div className="mt-1 text-sm space-y-1 font-mono">
                    <div className="text-green-600">+{selectedCommit.stats.additions} additions</div>
                    <div className="text-red-600">-{selectedCommit.stats.deletions} deletions</div>
                    <div className="text-gray-600">{selectedCommit.stats.total} total</div>
                  </div>
                </div>
              )}

              {selectedCommit.parents.length > 0 && (
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase">Parents</label>
                  <div className="mt-1 text-sm font-mono space-y-1">
                    {selectedCommit.parents.map((parent, index) => (
                      <code key={parent} className="block text-xs text-gray-600">
                        {parent.slice(0, 7)}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
