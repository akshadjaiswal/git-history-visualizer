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
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Back + Repo Name */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white hover:text-black transition-colors duration-fast"
            aria-label="Go back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-semibold">
              {owner} / {repo}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="bg-white text-black border-2 border-white hover:bg-black hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Export</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
