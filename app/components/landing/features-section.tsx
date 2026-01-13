import { Clock, Stars, Camera, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Clock,
    title: 'Time Travel',
    description: 'Scrub through repository history with an interactive timeline. Watch commits appear chronologically as you explore the evolution of your codebase.',
  },
  {
    icon: Stars,
    title: 'Contributor Constellations',
    description: 'Each contributor forms their own constellation in 3D space. Visualize team collaboration patterns and individual contributions over time.',
  },
  {
    icon: Camera,
    title: 'Cinematic Camera',
    description: 'Smooth camera controls and intuitive navigation. Orbit, zoom, and fly through your git history with fluid motion and precise control.',
  },
  {
    icon: Download,
    title: 'Export Snapshots',
    description: 'Capture and export high-resolution images of your visualization. Share your git story with the world in stunning detail.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-16 text-center">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} hoverable className="p-8">
                <Icon className="w-12 h-12 mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 font-body">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
