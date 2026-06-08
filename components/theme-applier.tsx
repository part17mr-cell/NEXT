'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store-context'

/**
 * Applies the admin-chosen theme (base palette + accent color) to the live
 * document as CSS custom properties, overriding the defaults in globals.css.
 * Runs site-wide and in the admin panel for instant feedback.
 */

type Vars = Record<string, string>

const BASES: Record<string, Vars> = {
  cream: {
    '--background': '#F7F3EC',
    '--foreground': '#2B2A27',
    '--card': '#FFFFFF',
    '--card-foreground': '#2B2A27',
    '--popover': '#FFFFFF',
    '--popover-foreground': '#2B2A27',
    '--secondary': '#EFEAE0',
    '--secondary-foreground': '#3A3934',
    '--muted': '#EFEAE0',
    '--muted-foreground': '#7A766C',
    '--accent': '#EDE6D9',
    '--accent-foreground': '#3A3934',
    '--border': '#E6DECF',
    '--input': '#E6DECF',
  },
  white: {
    '--background': '#FFFFFF',
    '--foreground': '#18181B',
    '--card': '#FFFFFF',
    '--card-foreground': '#18181B',
    '--popover': '#FFFFFF',
    '--popover-foreground': '#18181B',
    '--secondary': '#F4F4F5',
    '--secondary-foreground': '#27272A',
    '--muted': '#F4F4F5',
    '--muted-foreground': '#71717A',
    '--accent': '#F1F1F3',
    '--accent-foreground': '#27272A',
    '--border': '#E7E7EA',
    '--input': '#E7E7EA',
  },
  dark: {
    '--background': '#0A0A12',
    '--foreground': '#F4F4F7',
    '--card': '#14141F',
    '--card-foreground': '#F4F4F7',
    '--popover': '#14141F',
    '--popover-foreground': '#F4F4F7',
    '--secondary': '#1C1C2A',
    '--secondary-foreground': '#F4F4F7',
    '--muted': '#1C1C2A',
    '--muted-foreground': '#9B9BB0',
    '--accent': '#222233',
    '--accent-foreground': '#F4F4F7',
    '--border': '#272739',
    '--input': '#1A1A28',
  },
}

/** Pick black/white text for a given hex background by perceived luminance. */
function readableOn(hex: string): string {
  const m = hex.replace('#', '').match(/.{1,2}/g)
  if (!m || m.length < 3) return '#FFFFFF'
  const [r, g, b] = m.map(h => parseInt(h, 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.55 ? '#1A1A1A' : '#FFFFFF'
}

export function ThemeApplier() {
  const { settings } = useStore()
  const theme = settings.theme

  useEffect(() => {
    const root = document.documentElement
    const base = BASES[theme?.base ?? 'cream'] ?? BASES.cream
    const primary = theme?.primary || '#D97757'

    const vars: Vars = {
      ...base,
      '--primary': primary,
      '--primary-foreground': readableOn(primary),
      '--ring': primary,
      '--sidebar-primary': primary,
      '--sidebar-primary-foreground': readableOn(primary),
      '--sidebar': base['--card'],
      '--sidebar-foreground': base['--foreground'],
      '--sidebar-accent': base['--secondary'],
      '--sidebar-accent-foreground': base['--secondary-foreground'],
      '--sidebar-border': base['--border'],
      '--sidebar-ring': primary,
    }
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
  }, [theme?.base, theme?.primary])

  return null
}
