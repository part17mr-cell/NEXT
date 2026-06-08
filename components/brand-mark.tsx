'use client'

/**
 * Brand emblem — a coral squircle with a glossy highlight, a bold lightning
 * bolt ("instant delivery") and an anime-style sparkle glint. Crisp at any size.
 * Used as the default logo when no custom logoUrl is set.
 */
export function BrandMark({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="JOB logo" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bmBody" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F4A06A" />
          <stop offset="0.5" stopColor="#D97757" />
          <stop offset="1" stopColor="#BC5638" />
        </linearGradient>
        <linearGradient id="bmGloss" x1="24" y1="3" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bmBolt" x1="18" y1="9" x2="30" y2="39" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFE9DD" />
        </linearGradient>
      </defs>

      {/* squircle body */}
      <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#bmBody)" />
      {/* glossy top highlight */}
      <rect x="3" y="3" width="42" height="22" rx="13" fill="url(#bmGloss)" />
      {/* inner stroke for crispness */}
      <rect x="3.75" y="3.75" width="40.5" height="40.5" rx="12.25" fill="none" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* lightning bolt = instant */}
      <path
        d="M27.5 7.5 16 26.2h7.2L20 40.5 33 20.4h-7.5z"
        fill="url(#bmBolt)"
        stroke="#A8472C"
        strokeOpacity="0.18"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* sparkle glint */}
      <path d="M34 10.5l.85 2.15 2.15.85-2.15.85L34 16.5l-.85-2.15L31 13.5l2.15-.85z" fill="#FFFFFF" fillOpacity="0.95" />
    </svg>
  )
}
