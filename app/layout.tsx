import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Thai, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap'
})

const ibmPlex = IBM_Plex_Sans_Thai({ 
  subsets: ["thai", "latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-thai',
  display: 'swap'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'JOB - ร้านขายสินค้าดิจิทัล',
  description: 'จบงานไว ด้วยสินค้าดิจิทัลพร้อมใช้ Prompt, Script, Template, Workflow ส่งทันทีอัตโนมัติ',
  keywords: ['digital store', 'prompt', 'script', 'template', 'workflow', 'content kit', 'digital products'],
  authors: [{ name: 'JOB Digital Store' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={`dark ${inter.variable} ${ibmPlex.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased selection:bg-primary/20 selection:text-primary-foreground">
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'glass border-border text-foreground',
            style: {
              background: 'oklch(0.09 0.01 260 / 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid oklch(0.22 0.01 260)',
            }
          }}
          richColors
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
