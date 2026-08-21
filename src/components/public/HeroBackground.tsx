/**
 * Decorative institutional background for the Home hero: a faint grid, a soft dual-tone glow
 * for depth, and two mirrored node-and-line clusters suggesting connected entities/data —
 * kept out of the central text column and at very low opacity so it never competes with content.
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
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
        <radialGradient id="hero-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand-light)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-light)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hero-glow-b" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.16" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="800" fill="url(#hero-grid)" />
      <circle cx="220" cy="120" r="360" fill="url(#hero-glow-a)" />
      <circle cx="1400" cy="700" r="380" fill="url(#hero-glow-b)" />

      <path
        d="M 0 96 C 260 40, 540 150, 800 108 C 1060 66, 1340 150, 1600 96"
        fill="none"
        stroke="white"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <path
        d="M 0 726 C 260 764, 540 656, 800 700 C 1060 744, 1340 660, 1600 726"
        fill="none"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      <g stroke="var(--brand-light)" strokeOpacity="0.35" strokeWidth="1.2" fill="none">
        <path d="M90 120 L160 220 L110 340 L200 300 L260 180 L340 240 L380 360" />
        <path d="M110 340 L150 460 L230 540 L320 460 L380 360" />
        <path d="M150 460 L120 600" />
        <path d="M230 540 L280 620" />
        <path d="M200 300 L320 460" />
      </g>
      <g fill="white" fillOpacity="0.55">
        <circle cx="90" cy="120" r="3.5" />
        <circle cx="160" cy="220" r="2.5" />
        <circle cx="110" cy="340" r="3" />
        <circle cx="200" cy="300" r="2.5" />
        <circle cx="260" cy="180" r="3" />
        <circle cx="340" cy="240" r="2.5" />
        <circle cx="380" cy="360" r="3.5" />
        <circle cx="150" cy="460" r="2.5" />
        <circle cx="230" cy="540" r="3" />
        <circle cx="320" cy="460" r="2.5" />
        <circle cx="120" cy="600" r="2.5" />
        <circle cx="280" cy="620" r="3" />
      </g>
      <g stroke="white" strokeOpacity="0.14" fill="none">
        <rect x="330" y="130" width="18" height="18" rx="4" />
        <rect x="70" y="500" width="16" height="16" rx="4" />
      </g>

      <g transform="translate(1600,0) scale(-1,1)">
        <g stroke="var(--brand-light)" strokeOpacity="0.35" strokeWidth="1.2" fill="none">
          <path d="M90 120 L160 220 L110 340 L200 300 L260 180 L340 240 L380 360" />
          <path d="M110 340 L150 460 L230 540 L320 460 L380 360" />
          <path d="M150 460 L120 600" />
          <path d="M230 540 L280 620" />
          <path d="M200 300 L320 460" />
        </g>
        <g fill="white" fillOpacity="0.55">
          <circle cx="90" cy="120" r="3.5" />
          <circle cx="160" cy="220" r="2.5" />
          <circle cx="110" cy="340" r="3" />
          <circle cx="200" cy="300" r="2.5" />
          <circle cx="260" cy="180" r="3" />
          <circle cx="340" cy="240" r="2.5" />
          <circle cx="380" cy="360" r="3.5" />
          <circle cx="150" cy="460" r="2.5" />
          <circle cx="230" cy="540" r="3" />
          <circle cx="320" cy="460" r="2.5" />
          <circle cx="120" cy="600" r="2.5" />
          <circle cx="280" cy="620" r="3" />
        </g>
        <g stroke="white" strokeOpacity="0.14" fill="none">
          <rect x="330" y="130" width="18" height="18" rx="4" />
          <rect x="70" y="500" width="16" height="16" rx="4" />
        </g>
      </g>
    </svg>
  )
}
