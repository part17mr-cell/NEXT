'use client'

import { StoreProvider } from '@/lib/store-context'
import { ThemeApplier } from '@/components/theme-applier'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeApplier />
      {children}
    </StoreProvider>
  )
}
