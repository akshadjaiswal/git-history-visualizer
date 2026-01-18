import html2canvas from 'html2canvas'

/**
 * Export the current dashboard as a PNG image
 * Captures the entire visualizer page including top bar and all panels
 */
export async function exportDashboardToPNG(resolution: number = 2): Promise<void> {
  try {
    // Find the dashboard container (main element with all panels)
    const dashboard = document.querySelector('.visualizer-dashboard')
    if (!dashboard || !(dashboard instanceof HTMLElement)) {
      throw new Error('Dashboard not found')
    }

    // Capture with html2canvas
    const canvas = await html2canvas(dashboard, {
      scale: resolution, // 1x, 2x, or 4x
      backgroundColor: '#000000', // Match dashboard black bg
      logging: false,
      useCORS: true, // Allow external images if any
      allowTaint: true, // Allow cross-origin images
      foreignObjectRendering: true, // Better SVG support
      imageTimeout: 0, // Don't timeout on images
      windowWidth: dashboard.scrollWidth,
      windowHeight: dashboard.scrollHeight,
    })

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob')
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      link.download = `git-dashboard-${timestamp}.png`
      link.href = url
      link.click()

      // Cleanup
      URL.revokeObjectURL(url)
    }, 'image/png', 0.95) // 95% quality
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to export dashboard. Please try again.')
  }
}

/**
 * Export as SVG (placeholder for future implementation)
 */
export async function exportDashboardToSVG(): Promise<void> {
  alert('SVG export coming soon! For now, please use PNG format.')
}
