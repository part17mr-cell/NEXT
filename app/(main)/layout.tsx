'use client'

import { StoreProvider } from '@/lib/store-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingButtons } from '@/components/floating-buttons'
import { EditModeProvider, EditModeToggle } from '@/components/edit-mode'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <EditModeProvider>
        <div className="min-h-screen flex flex-col pt-4">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingButtons />
          <EditModeToggle />
        </div>
      </EditModeProvider>
    </StoreProvider>
  )
}
