'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, ExternalLink, Heart } from 'lucide-react'
import { useStore } from '@/lib/store-context'

export function Footer() {
  const { settings } = useStore()

  const links = [
    { href: '/store', label: 'สินค้า' },
    { href: '/contact', label: 'ติดต่อ' },
    { href: '/faq', label: 'คำถามพบบ่อย' },
    { href: '/refund', label: 'นโยบายคืนเงิน' },
  ]

  const policyLinks = [
    { href: '/about', label: 'เกี่ยวกับ' },
    { href: '/privacy', label: 'นโยบายความเป็นส่วนตัว' },
    { href: '/track', label: 'ติดตามออเดอร์' },
  ]

  return (
    <footer className="border-t border-border/40 mt-20 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center"
              >
                <span className="text-xl font-black bg-gradient-to-br from-primary via-violet-400 to-blue-400 bg-clip-text text-transparent leading-none select-none">J</span>
              </motion.div>
              <div>
                <p className="font-display font-bold text-lg bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">JOB</p>
                <p className="text-xs text-primary font-bold uppercase tracking-wider">DIGITAL STORE</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-5">
              จบงานไว ด้วยสินค้าดิจิทัลพร้อมใช้ Prompt, Script, Template และ Workflow ส่งทันทีอัตโนมัติ
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE 24 ชม.
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Zap className="w-3 h-3" />
                ส่งอัตโนมัติ
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">เมนู</h3>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
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
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">นโยบาย</h3>
            <ul className="space-y-3">
              {policyLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
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
            &copy; {new Date().getFullYear()} JOB Digital Store. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> by JOB Digital Store Team
          </p>
        </div>
      </div>
    </footer>
  )
}
