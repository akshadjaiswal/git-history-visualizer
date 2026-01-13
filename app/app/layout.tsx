import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/query-provider'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display'
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-body'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Git History Visualizer - 3D Repository Explorer',
  description: 'Transform any GitHub repository into an interactive 3D constellation. Explore commits, branches, and contributors across time.',
  keywords: ['git', 'github', 'visualization', '3d', 'commits', 'history', 'three.js'],
  authors: [{ name: 'Git History Visualizer' }],
  openGraph: {
    title: 'Git History Visualizer',
    description: 'Transform GitHub repos into stunning 3D constellations',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${sourceSerif4.variable} ${jetbrainsMono.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
