# Git History Visualizer – Transform GitHub Repositories into Beautiful Insights

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)  [![React](https://img.shields.io/badge/React-19-149ECA?style=flat&logo=react&logoColor=white)](https://react.dev/)  [![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)  [![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

**Git History Visualizer** is a Next.js web application that transforms GitHub repositories into beautiful, insightful dashboards. Visualize commit patterns, contributor activity, and repository metrics through an elegant pastel-colored interface.

> Turn commits into insights, one visualization at a time. 📊

---

## Latest Highlights

- **Commit Intelligence Analytics** – Advanced insights with 4 metrics: size distribution, peak hours, message quality, velocity trend
- **SVG Line/Area Chart** – Smooth, professional commit activity visualization with gradient fills
- **Pastel Color Scheme** – Beautiful mint, sky, coral, lavender, teal, and peach palette
- **6 Visualization Panels** – Repository stats, commit intelligence, heatmap, contributors, timeline, branches
- **Optimized Layout** – Content-driven heights with smooth scrolling for large datasets
- **Real-time Data** – Live GitHub API integration with progressive loading (5 stages)
- **Mobile Optimized** – Responsive design with adaptive commit limits for performance

---

## Features

### Core Visualization Panels

#### Repository Stats
- **Stars, Forks, Contributors** – Color-coded metrics with mint green, sky blue, and teal
- **Language Badge** – Gradient-filled badge showing primary programming language
- **Repository Size & Last Updated** – Essential metadata at a glance

#### Commit Intelligence
- **Monthly Timeline Chart** – SVG line/area chart showing commit trends with gradient fill
- **Timeline Color Coding** – Mint (early) → Sky (middle) → Lavender (recent)
- **Interactive Data Points** – Hover to see month, commit count, and contributor count
- **Size Distribution** – Categorizes commits by lines changed (Small/Medium/Large/Huge)
- **Peak Hours Clock** – 24-hour radial heatmap revealing when commits happen
- **Message Quality Score** – 0-100 rating based on conventional commits and message length
- **Velocity Trend** – Last 12 weeks sparkline showing development momentum

#### Activity Heatmap
- **GitHub-Style Calendar** – Last 52 weeks of contribution activity
- **Teal→Mint Gradient** – Color intensity from dark teal (low) to mint green (high)
- **Hover Tooltips** – Date and commit count for each day
- **Legend** – Visual guide for activity intensity levels

#### Top Contributors
- **Circular Constellation** – Top 10 contributors arranged in a circle
- **Pastel Colors** – Each contributor gets a unique color
- **Hover Tooltips** – Email and commit count displayed on hover
- **Center Count** – Total contributor number with gradient text

#### Timeline Milestones
- **Key Repository Dates** – First commit, most active period, latest commit
- **Color-Coded Markers** – Mint (first), coral (peak), sky (latest)
- **Gradient Timeline** – Vertical line from teal to lavender
- **Commit Messages** – First line of each milestone commit

#### Branch Overview
- **Branch Activity Bars** – Gradient progress bars showing commit distribution
- **Sorted by Activity** – Branches ordered by commit count
- **Scrollable List** – View all branches with smooth scrolling
- **Last Activity Date** – When each branch was last updated

### Technical Features

- **Pastel Color Palette** – Mint (#6EE7B7), Sky (#7DD3FC), Coral (#FDA4AF), Lavender (#C4B5FD), Peach (#FED7AA), Teal (#5EEAD4)
- **Real-time Data Fetching** – GitHub API via Octokit with progressive loading
- **Smart Commit Limits** – 10,000 commits (desktop) / 2,500 commits (mobile) for optimal performance
- **React Query Caching** – 10-minute stale time, 30-minute garbage collection
- **Timezone-Aware** – Date handling via date-fns
- **Error Boundaries** – Graceful error handling with retry options
- **Responsive Grid** – Flexible two-row layout adapting to content

---

## Usage Guide

### How to Use

1. **Enter Repository URL**
   - Paste any public GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Or use sample repositories (React, VS Code, Next.js) for quick testing

2. **View Dashboard**
   - Progressive loading with 5 stages: Fetching repo → Commits → Branches → Contributors → Processing
   - Watch as the dashboard populates with beautiful visualizations

3. **Explore Insights**
   - Hover over charts, heatmap cells, and contributor circles for detailed tooltips
   - Scroll through branches for repositories with many active branches
   - Analyze commit patterns, peak activity periods, and contributor distribution

### Dashboard Panels Explained

| Panel | What It Shows |
|-------|---------------|
| **Repository Stats** | Stars, forks, contributors, language, size, last updated |
| **Commit Intelligence** | Monthly trends + 4 analytics: size distribution, peak hours, message quality, velocity |
| **Activity Heatmap** | GitHub-style contribution calendar (last 52 weeks) |
| **Top Contributors** | Top 10 contributors in circular pattern with pastel colors |
| **Timeline** | First commit, most active period, and latest commit dates |
| **Branches** | All branches with commit distribution and last activity |

### Commit Intelligence Analytics

The **Commit Intelligence** panel provides deep insights into repository development patterns through four analytical metrics:

#### 📊 Size Distribution
Categorizes commits by the number of lines changed, revealing code complexity patterns:
- **Small (0-50 lines)** – Mint green: Quick fixes, minor tweaks
- **Medium (51-200 lines)** – Sky blue: Feature additions, moderate changes
- **Large (201-500 lines)** – Coral pink: Significant refactors, major features
- **Huge (500+ lines)** – Lavender: Architecture changes, massive updates

*Insight:* Healthy repositories typically show a majority of small-to-medium commits, indicating incremental development practices.

#### ⏰ Peak Hours Clock
A 24-hour radial heatmap showing when commits occur throughout the day:
- Visualizes developer timezone and working patterns
- Teal gradient intensity from dark (low activity) to mint green (high activity)
- Hour markers at 0, 6, 12, and 18 for easy reference

*Insight:* Reveals team time zones, work-life balance patterns, and peak productivity hours.

#### ✍️ Message Quality Score
Measures commit message hygiene on a 0-100 scale:
- **Excellent (71-100)** – Mint green: Strong conventional commit usage
- **Good (41-70)** – Peach: Decent messages with room for improvement
- **Poor (0-40)** – Coral: Needs better commit message standards

*Score calculation:* 80% weight on conventional commits (feat:, fix:, etc.), 20% weight on message length (>10 characters).

*Insight:* Higher scores indicate better documentation practices and team standards.

#### 📈 Velocity Trend
A sparkline showing commits per week over the last 12 weeks:
- Lavender line with gradient fill
- Highlights minimum (coral) and maximum (mint) activity weeks
- Shows project momentum: accelerating, steady, or declining

*Insight:* Tracks development pace and can reveal sprint patterns, release cycles, or project momentum shifts.

---

## Technical Highlights

### Architecture

- **Next.js 16 App Router** with React 19 for modern web development
- **TypeScript Strict Mode** for type safety and better developer experience
- **Client-Side Data Fetching** with TanStack Query v5 for efficient caching
- **Advanced Commit Analytics** – 4-metric insight grid with size, timing, quality, and velocity analysis
- **Progressive Loading** – 5-stage progress tracking for better UX
- **Error Boundaries** – Graceful failure handling with retry mechanisms

### Tech Stack

| Category | Technology |
|---------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | Tailwind CSS |
| State Management | TanStack Query v5 |
| API Client | Octokit (GitHub REST API) |
| Date Handling | date-fns |
| Deployment | Vercel |

### Performance Optimizations

- **Desktop**: Max 10,000 commits for smooth 60 FPS rendering
- **Mobile**: Max 2,500 commits for 30 FPS performance on smaller devices
- **React Query Caching**: 10min staleTime, 30min garbage collection time
- **Lazy Loading**: Components load on demand for faster initial page load
- **Optimized Bundle**: Target <300KB initial JS (gzipped)

---

## Color System

The dashboard uses a carefully curated pastel color palette for visual appeal and clarity:

**Pastel Palette:**
- 🟢 **Mint Green** (#6EE7B7) – Repository stats, early timeline, high activity
- 🔵 **Sky Blue** (#7DD3FC) – Contributors, mid-timeline, secondary accents
- 🌸 **Coral Pink** (#FDA4AF) – Highlights, peak activity, main branch
- 💜 **Lavender** (#C4B5FD) – Recent timeline, main branch, elegant accents
- 🍑 **Peach** (#FED7AA) – Secondary branches, warm highlights
- 🌊 **Teal** (#5EEAD4) – Borders, accents, professional touch

**Design Principles:**
- NO rounded corners (sharp, modern aesthetic)
- Pastel colors on black background for high contrast
- Gradient accents for visual interest
- Consistent padding (16px) across all panels
- Content-driven heights (no excessive empty space)

---

## Project Structure

```
git-history-visualizer/
├── app/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── visualize/page.tsx       # Dashboard layout
│   │   ├── layout.tsx               # Root layout with fonts
│   │   └── globals.css              # Design system & Tailwind
│   ├── components/
│   │   ├── landing/                 # Landing page sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── how-it-works-section.tsx
│   │   │   ├── examples-section.tsx
│   │   │   └── footer.tsx
│   │   ├── visualizer/              # Dashboard panels
│   │   │   ├── top-bar.tsx          # Repo name + export button
│   │   │   ├── stats-card.tsx       # Repository metrics
│   │   │   ├── commit-intelligence.tsx  # Analytics panel with 4 insights
│   │   │   ├── insights/            # Analytics components
│   │   │   │   ├── size-distribution.tsx
│   │   │   │   ├── peak-hours-clock.tsx
│   │   │   │   ├── message-quality.tsx
│   │   │   │   └── velocity-trend.tsx
│   │   │   ├── activity-heatmap.tsx # GitHub-style calendar
│   │   │   ├── contributor-constellation.tsx  # Top 10 circles
│   │   │   ├── timeline-milestones.tsx        # Key dates
│   │   │   └── branch-overview.tsx            # Branch activity
│   │   └── ui/                      # Reusable components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   ├── github-client.ts         # Octokit wrapper
│   │   ├── process-git-data.ts      # Data processing
│   │   ├── use-github-data.ts       # React Query hooks
│   │   └── utils.ts                 # Tailwind cn helper
│   └── types/
│       └── github.ts                # TypeScript interfaces
└── README.md                        # This file
```

---

## Contributing

Contributions are welcome!

**Guidelines**:
- Use TypeScript for all new code
- Follow existing code style and design patterns
- Test thoroughly before submitting pull requests
- Write clear, concise commit messages

**Pull Request Process**:
1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test locally with multiple repositories
5. Submit PR with clear description of changes

---

## Support

- **Bugs** → [Open an issue](https://github.com/akshadjaiswal/git-history-visualizer/issues)
- **Questions** → [Start a discussion](https://github.com/akshadjaiswal/git-history-visualizer/discussions)

---

<div align="center">

**Made with ❤️ by Akshad Jaiswal**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akshadjaiswal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/akshadsantoshjaiswal)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/akshad_999)

**⭐ Star this repo if you find it useful!**

</div>
