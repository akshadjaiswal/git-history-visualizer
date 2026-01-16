'use client'

import { Button } from '@/components/ui/button'
import { Download, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useVisualizerStore } from '@/lib/visualizer-store'

interface TopBarProps {
  owner: string
  repo: string
}

export function TopBar({ owner, repo }: TopBarProps) {
  const router = useRouter()
  const setShowExportModal = useVisualizerStore(state => state.setShowExportModal)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b-2 border-white">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        {/* Left: Back + Repo Name */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
          <button
            onClick={() => router.push('/')}
            className="p-1.5 sm:p-2 hover:bg-white hover:text-black transition-colors duration-fast flex-shrink-0"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-sm sm:text-base md:text-xl lg:text-2xl font-semibold truncate">
              {owner} / {repo}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="bg-white text-black border-2 border-white hover:bg-black hover:text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2"
            title="Export Dashboard"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-2" />
            <span className="hidden md:inline text-xs sm:text-sm">Export</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
