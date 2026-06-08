'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  HelpCircle, Search, ShoppingCart, CreditCard, Package,
  CheckCircle, Headphones, ArrowRight, Sparkles, Zap, ShieldCheck,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const steps = [
  { icon: Search,     title: 'เลือกสินค้า',     desc: 'เลือกสินค้าที่ต้องการจากร้านค้า ครบทุกหมวดหมู่',     tint: 'from-violet-500/25 to-violet-500/5', ring: 'border-violet-500/30', fg: 'text-violet-300' },
  { icon: ShoppingCart,title: 'เพิ่มลงตะกร้า',   desc: 'เพิ่มสินค้าลงตะกร้า แล้วตรวจสอบรายการก่อนจ่าย',      tint: 'from-fuchsia-500/25 to-fuchsia-500/5', ring: 'border-fuchsia-500/30', fg: 'text-fuchsia-300' },
  { icon: CreditCard, title: 'ชำระเงิน',        desc: 'ชำระผ่านช่องทางที่รองรับ พร้อมอัปโหลดสลิป',          tint: 'from-blue-500/25 to-blue-500/5', ring: 'border-blue-500/30', fg: 'text-blue-300' },
  { icon: Package,    title: 'รับสินค้าทันที',   desc: 'รับสินค้าดิจิทัลทันทีหลังยืนยัน ระบบออโต้ 24 ชม.',     tint: 'from-emerald-500/25 to-emerald-500/5', ring: 'border-emerald-500/30', fg: 'text-emerald-300' },
]

const trustBadges = [
  { icon: Zap,         label: 'ส่งทันที 24 ชม.' },
  { icon: CheckCircle, label: 'ตรวจสอบออเดอร์ได้' },
  { icon: Headphones,  label: 'บริการหลังการขาย' },
  { icon: ShieldCheck, label: 'ปลอดภัย 100%' },
]

export function HomeGuide() {
  const { settings } = useStore()
  if (!settings.visibility.homeGuide) return null

  return (
    <section id="guide" className="relative py-20 px-4 scroll-mt-24 overflow-hidden">
      {/* decorative graphics */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-[420px] h-[420px] aurora-blob opacity-25 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[420px] h-[420px] aurora-blob opacity-20 rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            วิธีสั่งซื้อ
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            ซื้อง่าย <span className="text-gradient">รับของไว</span>
          </h2>
          <p className="text-muted-foreground">แค่ 4 ขั้นตอน ใช้เวลาไม่ถึง 5 นาที</p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative group"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-12 left-[calc(100%+4px)] w-8 items-center justify-center z-10">
                    <ArrowRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}

                <div className="relative p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm h-full sheen overflow-hidden transition-all duration-300 group-hover:border-primary/40">
                  {/* big faded step number graphic */}
                  <span className="absolute -top-4 right-3 text-7xl font-black text-primary/5 select-none leading-none">
                    {index + 1}
                  </span>
                  {/* step number chip */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-black flex items-center justify-center shadow-lg shadow-primary/35">
                    {index + 1}
                  </div>

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.tint} border ${step.ring} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${step.fg}`} />
                  </div>

                  <h3 className="text-lg font-black mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{badge.label}</span>
              </div>
            )
          })}
        </motion.div>

        {/* Bold CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-primary/30 p-10 sm:p-14 text-center"
        >
          {/* graphic backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-fuchsia-600/10 to-blue-600/15" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] aurora-blob opacity-30 rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20" />

          <div className="relative">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 mb-5 animate-float-slow"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h3 className="text-3xl sm:text-4xl font-black mb-3">
              พร้อม<span className="text-gradient">จบงานไว</span>แล้วหรือยัง?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              เลือกสินค้าดิจิทัลพร้อมใช้ ดาวน์โหลดทันทีหลังชำระเงิน
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/store">
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                  <ShoppingCart className="w-5 h-5" />
                  เลือกซื้อสินค้า
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-card/60 border border-border/60 font-bold hover:border-primary/40 transition-colors">
                  <Headphones className="w-5 h-5 text-primary" />
                  สอบถามก่อนซื้อ
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
