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

  // Generate colors for each commit based on contributor ID
  const colors = useMemo(() => {
    const contributorColors: { [key: number]: string } = {}
    const contributorIds = Array.from(new Set(filteredCommits.map(c => c.contributorId)))

    // Generate HSL colors spread across spectrum (rainbow effect)
    contributorIds.forEach((id, index) => {
      const hue = (index / contributorIds.length) * 360
      contributorColors[id] = `hsl(${hue}, 80%, 70%)`
    })

    // Map each commit to its contributor's color
    return filteredCommits.map(c => new THREE.Color(contributorColors[c.contributorId]))
  }, [filteredCommits])

  // Create instance matrices for each commit
  const matrices = useMemo(() => {
    const temp = new THREE.Object3D()
    const mats: THREE.Matrix4[] = []

    filteredCommits.forEach((commit) => {
      temp.position.set(...commit.position)
      temp.scale.setScalar(isMobile ? 0.8 : 0.6) // Increased size for better visibility
      temp.updateMatrix()
      mats.push(temp.matrix.clone())
    })

    return mats
  }, [filteredCommits, isMobile])

  // Update instance matrices and colors
  useEffect(() => {
    if (!meshRef.current) return

    // Update matrices
    matrices.forEach((matrix, i) => {
      meshRef.current!.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true

    // Update colors - apply color data to geometry
    const colorArray = new Float32Array(colors.length * 3)
    colors.forEach((color, i) => {
      color.toArray(colorArray, i * 3)
    })

    meshRef.current.geometry.setAttribute(
      'color',
      new THREE.InstancedBufferAttribute(colorArray, 3)
    )
  }, [matrices, colors])

  // Dramatic pulsing animation (disabled on mobile for performance)
  useFrame((state) => {
    if (meshRef.current && !isMobile) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      if (material.emissiveIntensity !== undefined) {
        // Bigger pulse: 0.5 to 1.1 (was 0.4 to 0.6)
        material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.8) * 0.3
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
      <sphereGeometry args={[1, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
      <meshStandardMaterial
        vertexColors  // Enable per-instance colors
        emissive="#ffffff"
        emissiveIntensity={0.8}  // Increased from 0.5
        roughness={0.3}  // More shiny (was 0.5)
        metalness={0.7}  // More metallic (was 0.5)
      />
    </instancedMesh>
  )
}
