'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ExternalLink, Heart } from 'lucide-react'
import { useStore } from '@/lib/store-context'

export function Footer() {
  const { settings } = useStore()

  const links = [
    { href: '/', label: 'หน้าหลัก' },
    { href: '/store', label: 'ร้านค้า' },
    { href: '/contact', label: 'ติดต่อ' },
    { href: '/track', label: 'ติดตามออเดอร์' },
  ]

  const policyLinks = [
    { href: '/about', label: 'เกี่ยวกับ' },
    { href: '/privacy', label: 'นโยบาย' },
    { href: '/refund', label: 'คืนเงิน' },
  ]

  return (
    <footer className="border-t border-border/30 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <div>
                <p className="font-display font-bold text-lg">{settings.brand.storeName}</p>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">{settings.brand.tagline}</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
              {settings.home.heroSubtitle}
            </p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">เมนู</h3>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">นโยบาย</h3>
            <ul className="space-y-3">
              {policyLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              {settings.visibility.footerAdmin && (
                <li>
                  <Link 
                    href="/admin"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.brand.storeName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> by {settings.brand.storeName} Team
          </p>
        </div>
      </div>
    </footer>
  )
}
