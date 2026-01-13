'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import type { VisualizationData } from '@/types/github'
import { CommitNodes } from './commit-nodes'
import { BranchLines } from './branch-lines'

interface VisualizerSceneProps {
  data: VisualizationData
  isMobile?: boolean
}

export function VisualizerScene({ data, isMobile = false }: VisualizerSceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 30, 60],
        fov: 60,
        near: 0.1,
        far: 1000,
      }}
      className="w-full h-full"
      dpr={isMobile ? 1 : [1, 2]}
      performance={{ min: isMobile ? 0.3 : 0.5 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[0, 20, 0]} intensity={0.7} />

      {/* Background stars (for space effect) - disabled on mobile */}
      {!isMobile && (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      )}

      {/* Main content */}
      <Suspense fallback={null}>
        <CommitNodes commits={data.commits} isMobile={isMobile} />
        <BranchLines branches={data.branches} commits={data.commits} isMobile={isMobile} />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.5}
        minDistance={20}
        maxDistance={200}
      />
    </Canvas>
  )
}
