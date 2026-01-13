'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CommitNode } from '@/types/github'
import { useVisualizerStore } from '@/lib/visualizer-store'

interface CommitNodesProps {
  commits: CommitNode[]
  isMobile?: boolean
}

export function CommitNodes({ commits, isMobile = false }: CommitNodesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const setSelectedCommit = useVisualizerStore(state => state.setSelectedCommit)
  const getFilteredCommits = useVisualizerStore(state => state.getFilteredCommits)

  // Get filtered commits based on store state
  const filteredCommits = useMemo(() => {
    let result = getFilteredCommits(commits)

    // Debug logging
    console.log('[CommitNodes] Total commits:', commits.length)
    console.log('[CommitNodes] After filtering:', result.length)
    console.log('[CommitNodes] Filter state:', useVisualizerStore.getState().filteredContributors)

    // Further reduce for mobile (show every 3rd commit)
    if (isMobile && result.length > 2500) {
      result = result.filter((_, index) => index % 3 === 0)
    }

    return result.slice(0, isMobile ? 2500 : 10000)
  }, [commits, getFilteredCommits, isMobile])

  // Create instance matrices for each commit
  const matrices = useMemo(() => {
    const temp = new THREE.Object3D()
    const mats: THREE.Matrix4[] = []

    filteredCommits.forEach((commit) => {
      temp.position.set(...commit.position)
      temp.scale.setScalar(isMobile ? 0.5 : 0.3) // Larger on mobile for visibility
      temp.updateMatrix()
      mats.push(temp.matrix.clone())
    })

    return mats
  }, [filteredCommits, isMobile])

  // Update instance matrices
  useEffect(() => {
    if (!meshRef.current) return

    matrices.forEach((matrix, i) => {
      meshRef.current!.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [matrices])

  // Subtle pulsing animation (disabled on mobile for performance)
  useFrame((state) => {
    if (meshRef.current && !isMobile) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      }
    }
  })

  // Handle click events
  const handleClick = (event: any) => {
    event.stopPropagation()
    const instanceId = event.instanceId
    if (instanceId !== undefined && instanceId < filteredCommits.length) {
      const commit = filteredCommits[instanceId]
      setSelectedCommit(commit)
    }
  }

  if (filteredCommits.length === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, filteredCommits.length]}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.5}
        roughness={0.5}
        metalness={0.5}
      />
    </instancedMesh>
  )
}
