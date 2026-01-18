'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVisualizerStore } from '@/lib/visualizer-store'

interface ExportModalProps {
  onExport: (format: 'png' | 'svg', resolution: number) => void
}

export function ExportModal({ onExport }: ExportModalProps) {
  const showExportModal = useVisualizerStore(state => state.showExportModal)
  const setShowExportModal = useVisualizerStore(state => state.setShowExportModal)

  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [resolution, setResolution] = useState(2)

  const handleExport = () => {
    // Close modal FIRST to prevent it from appearing in screenshot
    setShowExportModal(false)

    // Wait for modal close animation (300ms from framer-motion) to complete
    setTimeout(() => {
      onExport(format, resolution)
    }, 350)
  }

  return (
    <AnimatePresence>
      {showExportModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowExportModal(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="bg-white border-4 border-black p-8 max-w-md w-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-display text-3xl font-semibold text-black">Export</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-black hover:text-white transition-colors duration-fast text-black"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-mono uppercase text-gray-700 mb-3">
                  Format
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormat('png')}
                    className={`flex-1 border-2 border-black p-4 transition-colors duration-fast font-body ${
                      format === 'png' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setFormat('svg')}
                    className={`flex-1 border-2 border-black p-4 transition-colors duration-fast font-body ${
                      format === 'svg' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    SVG
                  </button>
                </div>
              </div>

              {/* Resolution */}
              {format === 'png' && (
                <div className="mb-6">
                  <label className="block text-sm font-mono uppercase text-gray-700 mb-3">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value))}
                    className="w-full border-2 border-black p-3 bg-white text-black font-body focus-visible:border-4 focus-visible:outline-none"
                  >
                    <option value={1} className="bg-white text-black">1x (Standard)</option>
                    <option value={2} className="bg-white text-black">2x (High)</option>
                    <option value={4} className="bg-white text-black">4x (Ultra)</option>
                  </select>
                </div>
              )}

              {/* SVG Notice */}
              {format === 'svg' && (
                <div className="mb-6 p-4 border-2 border-gray-300 bg-gray-50">
                  <p className="text-sm text-gray-700 font-body">
                    SVG export is coming soon. For now, please use PNG format.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={handleExport}
                  variant="primary"
                  className="flex-1"
                  disabled={format === 'svg'}
                >
                  Download
                </Button>
                <Button
                  onClick={() => setShowExportModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
