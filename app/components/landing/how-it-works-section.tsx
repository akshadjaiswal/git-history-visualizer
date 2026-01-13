const steps = [
  {
    number: '01',
    title: 'Enter GitHub URL',
    description: 'Paste any public GitHub repository URL or select from popular examples',
  },
  {
    number: '02',
    title: 'Fetch & Process',
    description: 'We analyze commits, branches, and contributors to build your visualization',
  },
  {
    number: '03',
    title: 'Render 3D Scene',
    description: 'Watch your repository transform into a stunning 3D constellation in real-time',
  },
  {
    number: '04',
    title: 'Explore & Export',
    description: 'Interact with your git history, discover patterns, and export snapshots',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 px-8 bg-texture-grid">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-16 text-center">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-gray-300 z-0" />
              )}

              {/* Step content */}
              <div className="relative z-10">
                <div className="w-24 h-24 border-4 border-black flex items-center justify-center mx-auto mb-6 bg-white">
                  <span className="font-display text-3xl font-bold">{step.number}</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-center text-gray-600 font-body">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
