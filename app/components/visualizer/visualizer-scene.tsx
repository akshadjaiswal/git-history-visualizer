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
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #000000 50%, #1a0a0a 100%)'
      }}
    >
      {/* Enhanced Lighting Setup */}
      {/* Key light (main illumination) */}
      <directionalLight position={[50, 50, 50]} intensity={1.5} color="#ffffff" />

      {/* Fill light (softens shadows) */}
      <pointLight position={[-30, 20, 30]} intensity={1} color="#4080ff" />

      {/* Back/rim light (creates edge glow) */}
      <pointLight position={[0, -20, -50]} intensity={0.8} color="#ff8040" />

      {/* Ambient (base illumination) */}
      <ambientLight intensity={0.3} color="#202040" />

      {/* Hemisphere light (sky/ground gradient) */}
      <hemisphereLight
        args={['#1a1a2e', '#0f0f1e', 0.5]}
      />

      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={['#000000', 50, 200]} />

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
