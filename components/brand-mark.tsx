'use client'

/**
 * Anime-flavoured brand emblem rendered as crisp inline SVG.
 * A coral squircle with a manga-style speed swoosh and a sparkle/star glint.
 * Used as the default logo when no custom logoUrl is set.
 */
export function BrandMark({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="JOB logo" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandFill" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F0935E" />
          <stop offset="0.55" stopColor="#D97757" />
          <stop offset="1" stopColor="#C2603F" />
        </linearGradient>
        <linearGradient id="brandShine" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* squircle body */}
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#brandFill)" />
      {/* top gloss */}
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#brandShine)" />

      {/* manga speed swoosh */}
      <path d="M9 31c6 2 12 2 18-1" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M11 36c4 1 8 1 12-1" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* bold J */}
      <path
        d="M30 12.5h5.4v15.8c0 4.8-3 7.7-7.8 7.7-3.3 0-5.9-1.5-7.2-4.2l4.3-2.5c.5 1.1 1.4 1.8 2.7 1.8 1.6 0 2.6-1 2.6-3V12.5z"
        fill="#FFFFFF"
      />

      {/* sparkle / star glint */}
      <path
        d="M16 12.5l1.1 2.8 2.8 1.1-2.8 1.1L16 20.3l-1.1-2.8L12 16.4l2.9-1.1z"
        fill="#FFFFFF"
      />
    </svg>
  )
}
