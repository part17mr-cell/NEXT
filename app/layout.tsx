import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Thai, JetBrains_Mono } from 'next/font/google'
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
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
}

export const viewport = {
  themeColor: '#D97757',
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
      className={`${inter.variable} ${ibmPlex.variable} ${jetbrainsMono.variable}`}
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
              background: 'oklch(1 0 0 / 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid oklch(0.90 0.012 70)',
              color: 'oklch(0.24 0.012 60)',
            }
          }}
          richColors
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
