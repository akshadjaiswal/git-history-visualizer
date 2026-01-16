'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'

const examples = [
  {
    owner: 'facebook',
    repo: 'react',
    name: 'React',
    description: 'A declarative, efficient JavaScript library for building user interfaces',
    stars: '220k',
  },
  {
    owner: 'microsoft',
    repo: 'vscode',
    name: 'VS Code',
    description: 'Visual Studio Code - Open Source code editor',
    stars: '160k',
  },
  {
    owner: 'torvalds',
    repo: 'linux',
    name: 'Linux Kernel',
    description: 'The Linux kernel source tree',
    stars: '170k',
  },
]

export function ExamplesSection() {
  const router = useRouter()

  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 text-center">
          Example Visualizations
        </h2>
        <p className="text-center text-gray-600 mb-16 font-body">
          Click any repository to explore its history in 3D
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
          {examples.map((example) => (
            <Card
              key={`${example.owner}/${example.repo}`}
              className="cursor-pointer transition-all duration-fast hover:border-4 overflow-hidden"
              onClick={() => router.push(`/visualize?owner=${example.owner}&repo=${example.repo}`)}
            >
              {/* Placeholder for preview image */}
              <div className="h-40 sm:h-48 md:h-64 bg-gray-100 flex items-center justify-center border-b-2 border-black">
                <span className="text-8xl font-display font-bold text-gray-300">{example.name[0]}</span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-2xl font-semibold">{example.name}</h3>
                  <span className="text-sm text-gray-500 font-mono">★ {example.stars}</span>
                </div>
                <p className="text-sm text-gray-600 font-body">{example.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
