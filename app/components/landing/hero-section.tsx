'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HeroSection() {
  const [url, setUrl] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Parse GitHub URL: https://github.com/owner/repo
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/)
    if (match) {
      const [, owner, repo] = match
      router.push(`/visualize?owner=${owner}&repo=${repo}`)
    } else {
      alert('Please enter a valid GitHub repository URL')
    }
  }

  const sampleRepos = [
    { owner: 'facebook', repo: 'react', label: 'React' },
    { owner: 'vuejs', repo: 'vue', label: 'Vue.js' },
    { owner: 'torvalds', repo: 'linux', label: 'Linux' },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center bg-texture-lines relative">
      <div className="max-w-5xl mx-auto px-8 py-20 text-center">
        {/* Headline */}
        <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight">
          Travel Through
          <br />
          <span className="block mt-2">Git History</span>
        </h1>

        <p className="text-xl md:text-2xl font-light mb-16 max-w-2xl mx-auto text-gray-600">
          Transform any GitHub repository into an interactive 3D constellation.
          Explore commits, branches, and contributors across time.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="max-w-2xl mx-auto mb-6">
            <Input
              type="text"
              placeholder="https://github.com/owner/repository"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-center text-lg py-4"
              required
            />
          </div>
          <Button type="submit" size="lg" variant="primary">
            Visualize Repository
          </Button>
        </form>

        {/* Sample Repos */}
        <div className="flex flex-wrap justify-center gap-4">
          <span className="text-sm text-gray-500 w-full mb-2 font-body">Or try these:</span>
          {sampleRepos.map(({ owner, repo, label }) => (
            <Button
              key={`${owner}/${repo}`}
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/visualize?owner=${owner}&repo=${repo}`)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
