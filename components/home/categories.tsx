'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, FileText, Layout, GitBranch, Package, ArrowRight, Tags } from 'lucide-react'

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

const categories = [
  {
    name: 'Prompt',
    slug: 'Prompt',
    icon: Brain,
    description: 'Prompt สำหรับ AI ทุกประเภท ใช้ได้ทันที ประหยัดเวลา',
    color: 'text-violet-400',
    iconBg: 'bg-violet-500/15 border-violet-500/30',
    gradient: 'from-violet-500/10 to-violet-900/5',
    glow: 'hover:shadow-violet-500/15',
  },
  {
    name: 'Script',
    slug: 'Script',
    icon: FileText,
    description: 'Script สคริปต์พร้อมใช้ สำหรับ TikTok, YouTube, Reels',
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/15 border-blue-500/30',
    gradient: 'from-blue-500/10 to-blue-900/5',
    glow: 'hover:shadow-blue-500/15',
  },
  {
    name: 'Template',
    slug: 'Template',
    icon: Layout,
    description: 'Template ดีไซน์พร้อม Edit ง่าย ใช้งานได้เลย',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30',
    gradient: 'from-emerald-500/10 to-emerald-900/5',
    glow: 'hover:shadow-emerald-500/15',
  },
  {
    name: 'Workflow',
    slug: 'Workflow',
    icon: GitBranch,
    description: 'Workflow อัตโนมัติ ช่วยให้งานเสร็จเร็วขึ้นหลายเท่า',
    color: 'text-orange-400',
    iconBg: 'bg-orange-500/15 border-orange-500/30',
    gradient: 'from-orange-500/10 to-orange-900/5',
    glow: 'hover:shadow-orange-500/15',
  },
  {
    name: 'Content Kit',
    slug: 'Content Kit',
    icon: Package,
    description: 'ชุดเครื่องมือครบ สำหรับ Content Creator มืออาชีพ',
    color: 'text-pink-400',
    iconBg: 'bg-pink-500/15 border-pink-500/30',
    gradient: 'from-pink-500/10 to-pink-900/5',
    glow: 'hover:shadow-pink-500/15',
  },
]

export function HomeCategories() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
            <Tags className="w-3.5 h-3.5" />
            CATEGORIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">หมวดหมู่สินค้า</h2>
          <p className="text-muted-foreground max-w-md mx-auto">เลือกสินค้าที่เหมาะกับงานของคุณ</p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link href={`/store?category=${encodeURIComponent(cat.slug)}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`group relative p-5 rounded-2xl border border-border/40 bg-card/50 card-shine overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${cat.glow} hover:border-opacity-60 glow-primary-hover flex flex-col items-center text-center gap-3`}
                  >
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Icon */}
                    <div className={`relative w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${cat.iconBg}`}>
                      <Icon className={`w-6 h-6 ${cat.color}`} />
                    </div>

                    {/* Name */}
                    <h3 className={`relative font-bold text-sm transition-colors group-hover:${cat.color}`}>
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="relative text-xs text-muted-foreground leading-snug hidden md:block">
                      {cat.description}
                    </p>

                    {/* Link arrow */}
                    <div className={`relative flex items-center gap-1 text-xs font-semibold ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      ดูสินค้า <ArrowRight className="w-3 h-3" />
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
