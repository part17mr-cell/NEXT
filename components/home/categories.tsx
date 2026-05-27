'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Tags, ArrowRight, Layers,
  Gamepad2, Car, Flame, Zap, User, ShieldCheck, Monitor, Boxes
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const categoryConfig: Record<string, { Icon: LucideIcon; gradient: string; iconBg: string; textColor: string; glow: string }> = {
  'ACCOUNT':   { Icon: User,       gradient: 'from-blue-500/15 to-blue-900/5',    iconBg: 'bg-blue-500/15 border-blue-500/30',    textColor: 'text-blue-400',    glow: 'hover:shadow-blue-500/10' },
  'FIVEM':     { Icon: Car,        gradient: 'from-violet-500/15 to-violet-900/5', iconBg: 'bg-violet-500/15 border-violet-500/30', textColor: 'text-violet-400',  glow: 'hover:shadow-violet-500/10' },
  'ROBLOX':    { Icon: Boxes,      gradient: 'from-red-500/15 to-red-900/5',       iconBg: 'bg-red-500/15 border-red-500/30',       textColor: 'text-red-400',     glow: 'hover:shadow-red-500/10' },
  'FREE FIRE': { Icon: Flame,      gradient: 'from-orange-500/15 to-orange-900/5', iconBg: 'bg-orange-500/15 border-orange-500/30', textColor: 'text-orange-400',  glow: 'hover:shadow-orange-500/10' },
  'SERVICE':   { Icon: Zap,        gradient: 'from-emerald-500/15 to-emerald-900/5',iconBg: 'bg-emerald-500/15 border-emerald-500/30',textColor: 'text-emerald-400',glow: 'hover:shadow-emerald-500/10' },
  'GAME':      { Icon: Gamepad2,   gradient: 'from-cyan-500/15 to-cyan-900/5',     iconBg: 'bg-cyan-500/15 border-cyan-500/30',     textColor: 'text-cyan-400',    glow: 'hover:shadow-cyan-500/10' },
  'SCRIPT':    { Icon: Monitor,    gradient: 'from-pink-500/15 to-pink-900/5',     iconBg: 'bg-pink-500/15 border-pink-500/30',     textColor: 'text-pink-400',    glow: 'hover:shadow-pink-500/10' },
  'UNBAN':     { Icon: ShieldCheck,gradient: 'from-teal-500/15 to-teal-900/5',     iconBg: 'bg-teal-500/15 border-teal-500/30',     textColor: 'text-teal-400',    glow: 'hover:shadow-teal-500/10' },
}
const defaultCatConfig = { Icon: Boxes as LucideIcon, gradient: 'from-primary/15 to-primary/5', iconBg: 'bg-primary/15 border-primary/30', textColor: 'text-primary', glow: 'hover:shadow-primary/10' }

export function HomeCategories() {
  const { settings, categories, activeProducts } = useStore()

  if (!settings.visibility.homeCategories) return null

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
              <Tags className="w-3.5 h-3.5" />
              CATEGORIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">{settings.home.categoryTitle}</h2>
            <p className="text-muted-foreground mt-2">เลือกหมวดหมู่ที่ต้องการ</p>
          </div>
          <Link href="/store">
            <Button variant="outline" className="gap-2 font-semibold group">
              ดูสินค้าทั้งหมด
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Category Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {categories.map((category) => {
            const count = activeProducts.filter(p => p.category === category).length
            const cfg = categoryConfig[category] || defaultCatConfig
            const { Icon } = cfg

            return (
              <motion.div key={category} variants={itemVariants}>
                <Link href={`/store?category=${encodeURIComponent(category)}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`group relative p-6 rounded-2xl border border-border/40 bg-card/50 card-shine overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${cfg.glow} hover:border-opacity-60`}
                  >
                    {/* Per-category gradient fill */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Watermark */}
                    <span className="absolute -bottom-2 -right-2 font-display text-7xl font-black text-foreground/[0.025] pointer-events-none transition-transform group-hover:scale-110">
                      {category}
                    </span>

                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${cfg.iconBg}`}>
                        <Icon className={`w-6 h-6 ${cfg.textColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Layers className="w-3 h-3" />
                        หมวดหมู่สินค้า
                      </div>
                      <h3 className={`text-xl font-bold mb-1 transition-colors group-hover:${cfg.textColor}`}>{category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {count} รายการพร้อมสั่งซื้อ
                      </p>

                      {/* Arrow */}
                      <div className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 ${cfg.iconBg}`}>
                        <ArrowRight className={`w-4 h-4 ${cfg.textColor}`} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
