'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingBag, HelpCircle, Users, Box, Package, Wallet,
  ArrowRight, Star, Zap
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
}

export function HomeHero() {
  const { activeProducts, orders, members, formatMoney } = useStore()

  const minPrice = activeProducts.reduce((min, p) =>
    Math.min(min, p.sale_price || p.price), Infinity
  )

  const stats = [
    { label: 'สมาชิก', value: members.length.toLocaleString('th-TH') + ' คน', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'สินค้า', value: activeProducts.length + ' รายการ', icon: Box, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'ออเดอร์', value: orders.length.toLocaleString('th-TH') + ' รายการ', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'เริ่มต้นเพียง', value: minPrice === Infinity ? '฿0' : formatMoney(minPrice), icon: Wallet, color: 'text-primary', bg: 'bg-primary/10 border-primary/30' },
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 px-4 overflow-hidden">
      {/* Background dot grid + glow */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-bold">
                <Zap className="w-4 h-4" />
                สินค้าดิจิทัลพร้อมใช้ ส่งทันที
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-primary via-violet-400 to-purple-300 bg-clip-text text-transparent">
                จบงานไว
              </span>
              <br />
              <span className="text-foreground text-4xl sm:text-5xl lg:text-5xl font-bold">
                ด้วยสินค้าดิจิทัลพร้อมใช้
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              รวม Prompt, Script, Template และ Workflow สำหรับคนทำคอนเทนต์และงานออนไลน์ ดาวน์โหลดได้ทันทีหลังชำระเงิน
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
              <Link href="/store">
                <Button size="lg" className="gap-2 font-bold text-base h-14 px-8 shadow-xl shadow-primary/30 group">
                  <ShoppingBag className="w-5 h-5" />
                  เลือกซื้อสินค้า
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#guide">
                <Button size="lg" variant="outline" className="gap-2 font-bold text-base h-14 px-8 border-border hover:border-primary/50">
                  <HelpCircle className="w-5 h-5" />
                  ดูวิธีซื้อ
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`flex items-center gap-3 p-4 rounded-xl border bg-card/60 backdrop-blur-sm glow-primary-hover transition-all duration-300 ${stat.bg}`}
                >
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: mascot + floating product card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Glow ring */}
            <div className="absolute w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

            {/* Main card */}
            <div className="relative w-72 sm:w-80">
              {/* Mascot card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative p-8 rounded-3xl border border-primary/25 glass glow-primary card-shine text-center"
              >
                <div className="text-8xl mb-4 select-none">😎</div>
                <p className="font-black text-2xl bg-gradient-to-r from-primary to-violet-300 bg-clip-text text-transparent mb-1">
                  JOB
                </p>
                <p className="text-sm text-muted-foreground font-semibold">Digital Store</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">รีวิว 5 ดาว จากลูกค้าจริง</p>
              </motion.div>

              {/* Floating badge top-right */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/40"
              >
                ✓ ส่งทันที
              </motion.div>

              {/* Floating badge bottom-left */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-lg"
              >
                ⚡ ออโต้ 24 ชม.
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
