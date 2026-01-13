import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { ExamplesSection } from '@/components/landing/examples-section'
import { StatsSection } from '@/components/landing/stats-section'
import { Footer } from '@/components/landing/footer'
import { HorizontalRule } from '@/components/ui/horizontal-rule'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <HorizontalRule thickness={8} />
      <FeaturesSection />
      <HorizontalRule thickness={4} />
      <HowItWorksSection />
      <HorizontalRule thickness={4} />
      <ExamplesSection />
      <HorizontalRule thickness={8} />
      <StatsSection />
      <HorizontalRule thickness={2} />
      <Footer />
    </main>
  )
}
