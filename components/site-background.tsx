'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '@/lib/store-context'

/**
 * Full-viewport decorative background that the admin controls from the backend.
 * Supports static images and animated GIFs, optional auto-rotation between
 * several backgrounds, with adjustable opacity and blur. Sits behind all
 * content and never intercepts pointer events.
 */
export function SiteBackground() {
  const { settings } = useStore()
  const bg = settings.background
  const images = (bg?.images ?? []).filter(Boolean)
  const [index, setIndex] = useState(0)

  // Auto-rotate when more than one image and an interval is set
  useEffect(() => {
    if (!bg?.enabled || images.length <= 1 || !bg.intervalSec) return
    const ms = Math.max(2, bg.intervalSec) * 1000
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), ms)
    return () => clearInterval(id)
  }, [bg?.enabled, bg?.intervalSec, images.length])

  // Keep index in range if the image list shrinks
  useEffect(() => {
    if (index >= images.length) setIndex(0)
  }, [images.length, index])

  if (!bg?.enabled || images.length === 0) return null

  const current = images[index] ?? images[0]
  const opacity = Math.min(100, Math.max(0, bg.opacity ?? 18)) / 100
  const blur = Math.max(0, bg.blur ?? 0)

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <AnimatePresence mode="sync">
        <motion.div
          key={current + index}
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url("${current}")`,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            transform: blur > 0 ? 'scale(1.05)' : undefined,
          }}
        />
      </AnimatePresence>
      {/* gradient readability veil — keeps text crisp, makes the image feel intentional */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/20 to-background/55" />
      {/* soft vignette fading edges to the cream base for a premium, framed look */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(130% 90% at 50% 0%, transparent 35%, var(--background) 100%)' }}
      />
    </div>
  )
}
