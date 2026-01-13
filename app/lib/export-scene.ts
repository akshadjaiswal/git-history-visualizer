/**
 * Export the current 3D scene as a PNG image
 * Note: This captures the canvas element directly
 */
export async function exportSceneToPNG(resolution: number = 2): Promise<void> {
  try {
    // Find the canvas element
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      throw new Error('Canvas not found')
    }

    // Create a temporary canvas with higher resolution
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Set dimensions
    tempCanvas.width = canvas.width * resolution
    tempCanvas.height = canvas.height * resolution

    // Draw the original canvas scaled up
    ctx.scale(resolution, resolution)
    ctx.drawImage(canvas, 0, 0)

    // Convert to blob and download
    tempCanvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `git-visualization-${Date.now()}.png`
      link.href = url
      link.click()

      // Cleanup
      URL.revokeObjectURL(url)
    }, 'image/png')
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export image. Please try again.')
  }
}

/**
 * Export as SVG (placeholder for future implementation)
 */
export async function exportSceneToSVG(): Promise<void> {
  alert('SVG export coming soon! For now, please use PNG format.')
}
