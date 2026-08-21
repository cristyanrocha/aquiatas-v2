/**
 * Decorative institutional background for the Home hero: a faint grid, three drifting
 * brand-color glows for depth and color richness, and two mirrored node-and-line clusters
 * suggesting connected entities/data. Bolder and more colorful than a purely ambient texture,
 * but still kept out of the central text column so it never competes with content. Glow drift
 * and node pulse are pure CSS animation (see .hero-glow / .hero-node-pulse in index.css) and
 * respect prefers-reduced-motion.
 */
export function HeroBackground() {
  return (
    <svg
      className="absolute inset-0 size-full"
      viewBox="0 0 1600 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
        <radialGradient id="hero-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand-light)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--brand-light)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-glow-b" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-glow-c" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="800" fill="url(#hero-grid)" />
      <circle className="hero-glow hero-glow-a" cx="240" cy="140" r="440" fill="url(#hero-glow-a)" />
      <circle className="hero-glow hero-glow-b" cx="1360" cy="120" r="360" fill="url(#hero-glow-b)" />
      <circle className="hero-glow hero-glow-c" cx="1420" cy="680" r="420" fill="url(#hero-glow-c)" />

      <path
        d="M 0 96 C 260 40, 540 150, 800 108 C 1060 66, 1340 150, 1600 96"
        fill="none"
        stroke="white"
        strokeOpacity="0.16"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <path
        d="M 0 726 C 260 764, 540 656, 800 700 C 1060 744, 1340 660, 1600 726"
        fill="none"
        stroke="white"
        strokeOpacity="0.14"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      <g stroke="var(--brand-light)" strokeOpacity="0.45" strokeWidth="1.4" fill="none">
        <path d="M90 120 L160 220 L110 340 L200 300 L260 180 L340 240 L380 360" />
        <path d="M110 340 L150 460 L230 540 L320 460 L380 360" />
        <path d="M150 460 L120 600" />
        <path d="M230 540 L280 620" />
        <path d="M200 300 L320 460" />
      </g>
      <g fill="white" fillOpacity="0.7">
        <circle className="hero-node-pulse" cx="90" cy="120" r="3.5" />
        <circle cx="160" cy="220" r="2.5" />
        <circle className="hero-node-pulse" cx="110" cy="340" r="3" style={{ animationDelay: '0.6s' }} />
        <circle cx="200" cy="300" r="2.5" />
        <circle className="hero-node-pulse" cx="260" cy="180" r="3" style={{ animationDelay: '1.2s' }} />
        <circle cx="340" cy="240" r="2.5" />
        <circle className="hero-node-pulse" cx="380" cy="360" r="3.5" style={{ animationDelay: '1.8s' }} />
        <circle cx="150" cy="460" r="2.5" />
        <circle className="hero-node-pulse" cx="230" cy="540" r="3" style={{ animationDelay: '0.9s' }} />
        <circle cx="320" cy="460" r="2.5" />
        <circle cx="120" cy="600" r="2.5" />
        <circle cx="280" cy="620" r="3" />
      </g>
      <g stroke="white" strokeOpacity="0.18" fill="none">
        <rect x="330" y="130" width="18" height="18" rx="4" />
        <rect x="70" y="500" width="16" height="16" rx="4" />
      </g>

      <g transform="translate(1600,0) scale(-1,1)">
        <g stroke="var(--brand-light)" strokeOpacity="0.45" strokeWidth="1.4" fill="none">
          <path d="M90 120 L160 220 L110 340 L200 300 L260 180 L340 240 L380 360" />
          <path d="M110 340 L150 460 L230 540 L320 460 L380 360" />
          <path d="M150 460 L120 600" />
          <path d="M230 540 L280 620" />
          <path d="M200 300 L320 460" />
        </g>
        <g fill="white" fillOpacity="0.7">
          <circle className="hero-node-pulse" cx="90" cy="120" r="3.5" style={{ animationDelay: '0.3s' }} />
          <circle cx="160" cy="220" r="2.5" />
          <circle className="hero-node-pulse" cx="110" cy="340" r="3" style={{ animationDelay: '1.5s' }} />
          <circle cx="200" cy="300" r="2.5" />
          <circle className="hero-node-pulse" cx="260" cy="180" r="3" style={{ animationDelay: '2.1s' }} />
          <circle cx="340" cy="240" r="2.5" />
          <circle className="hero-node-pulse" cx="380" cy="360" r="3.5" style={{ animationDelay: '0.7s' }} />
          <circle cx="150" cy="460" r="2.5" />
          <circle className="hero-node-pulse" cx="230" cy="540" r="3" style={{ animationDelay: '1.1s' }} />
          <circle cx="320" cy="460" r="2.5" />
          <circle cx="120" cy="600" r="2.5" />
          <circle cx="280" cy="620" r="3" />
        </g>
        <g stroke="white" strokeOpacity="0.18" fill="none">
          <rect x="330" y="130" width="18" height="18" rx="4" />
          <rect x="70" y="500" width="16" height="16" rx="4" />
        </g>
      </g>
    </svg>
  )
}
