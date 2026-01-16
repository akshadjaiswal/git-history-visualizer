export function Footer() {
  return (
    <footer className="py-12 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-600 mb-4 font-body">
          Built with Next.js, Three.js, and love for open source
        </p>
        <div className="flex justify-center gap-6 text-sm font-body">
          <a
            href="https://github.com/akshadjaiswal/git-history-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-none"
          >
            GitHub
          </a>
          <a
            href="https://github.com/akshadjaiswal/git-history-visualizer#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-none"
          >
            Documentation
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-8 font-body">
          © 2025 Git History Visualizer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
