import { Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section 1: Project info and links */}
        <p className="text-sm text-gray-600 mb-4 font-body">
          Built with Next.js, Three.js, and love for open source
        </p>
        <div className="flex justify-center gap-6 text-sm font-body mb-8">
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

        {/* Divider */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Section 2: Social links + Copyright */}
        <div className="flex justify-center gap-4 mb-4">
          {/* GitHub Profile */}
          <a
            href="https://github.com/akshadjaiswal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* LinkedIn Profile */}
          <a
            href="https://linkedin.com/in/akshadsantoshjaiswal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* X/Twitter Profile */}
          <a
            href="https://x.com/akshad_999"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) Profile"
            className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 font-body">
          © {new Date().getFullYear()} Git History Visualizer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
