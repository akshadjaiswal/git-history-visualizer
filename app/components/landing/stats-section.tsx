const stats = [
  { value: '10,000+', label: 'Commits Visualized' },
  { value: '500+', label: 'Repositories Explored' },
  { value: '100%', label: 'Open Source' },
]

export function StatsSection() {
  return (
    <section className="py-20 px-8 bg-black text-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-6xl font-bold mb-4">{stat.value}</div>
              <div className="text-lg text-gray-400 font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
