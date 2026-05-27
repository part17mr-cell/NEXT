'use client'

import { StoreProvider } from '@/lib/store-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}
