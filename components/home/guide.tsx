'use client'

import { motion } from 'framer-motion'
import {
  HelpCircle, Search, ShoppingCart, CreditCard, Package,
  CheckCircle, Headphones, Star, ArrowRight, Clock
} from 'lucide-react'
import { useStore } from '@/lib/store-context'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
}

const steps = [
  {
    icon: Search,
    title: 'เลือกสินค้า',
    desc: 'เลือกสินค้าที่ต้องการจากร้านค้า ครบทุกหมวดหมู่',
  },
  {
    icon: ShoppingCart,
    title: 'เพิ่มลงตะกร้า',
    desc: 'เพิ่มสินค้าลงตะกร้า แล้วตรวจสอบรายการก่อนจ่าย',
  },
  {
    icon: CreditCard,
    title: 'ชำระเงิน',
    desc: 'ชำระผ่านช่องทางที่รองรับ พร้อมอัปโหลดสลิป',
  },
  {
    icon: Package,
    title: 'รับสินค้าทันที',
    desc: 'รับสินค้าดิจิทัลทันทีหลังยืนยัน ระบบออโต้ 24 ชม.',
  },
]

const trustBadges = [
  { icon: Clock, label: 'ส่งทันที 24 ชม.' },
  { icon: CheckCircle, label: 'ตรวจสอบออเดอร์' },
  { icon: Headphones, label: 'มีบริการหลังการขาย' },
  { icon: Star, label: 'ลูกค้าประจำ' },
]

const reviews = [
  {
    name: 'คุณ ปาย',
    avatar: '🧑‍💻',
    stars: 5,
    text: 'ซื้อ Prompt pack มาใช้แล้วงานเสร็จเร็วมากเลย ปกติทำ 2 ชั่วโมง เหลือแค่ 20 นาที แนะนำมากๆ ครับ',
  },
  {
    name: 'คุณ มิ้นท์',
    avatar: '👩‍🎨',
    stars: 5,
    text: 'Template สวยมาก ใช้ง่าย ลงตะกร้าแล้วได้รับไฟล์ทันที ไม่ต้องรอเลย บริการดีมากค่ะ',
  },
  {
    name: 'คุณ แบงค์',
    avatar: '🧑‍🚀',
    stars: 5,
    text: 'Script ไวรัลที่ซื้อมาใช้แล้ววิดีโอยอดวิวพุ่งเลยครับ คุ้มค่ามากๆ จะกลับมาซื้อเพิ่มอีกแน่นอน',
  },
]

export function HomeGuide() {
  const { settings } = useStore()

  if (!settings.visibility.homeGuide) return null

  return (
    <section id="guide" className="py-20 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            HOW TO ORDER
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">วิธีสั่งซื้อ</h2>
          <p className="text-muted-foreground">ง่ายกว่าที่คิด ใช้เวลาไม่ถึง 5 นาที</p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative group"
              >
                {/* Connector arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-10 left-[calc(100%+4px)] w-8 items-center justify-center z-10">
                    <ArrowRight className="w-5 h-5 text-primary/40" />
                  </div>
                )}

                <div className="relative p-6 rounded-2xl border border-border/50 bg-card/40 glass card-shine h-full glow-primary-hover transition-all duration-300">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-black flex items-center justify-center shadow-lg shadow-primary/35">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
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
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{badge.label}</span>
              </div>
            )
          })}
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">รีวิวลูกค้า</h3>
          <p className="text-muted-foreground text-sm">จากลูกค้าจริงที่ไว้วางใจเรา</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-5"
        >
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/50 glass card-shine glow-primary-hover transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xl">
                  {rev.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm">{rev.name}</p>
                  <div className="flex gap-0.5">
                    {[...Array(rev.stars)].map((_, si) => (
                      <Star key={si} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-[10px] text-muted-foreground font-semibold px-2 py-0.5 rounded-full bg-secondary/60">ลูกค้าจริง</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{rev.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            มีคำถามเพิ่มเติม? <a href="/contact" className="text-primary font-semibold hover:underline">ติดต่อเราได้เลย</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
