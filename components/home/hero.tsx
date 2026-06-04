'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingBag, HelpCircle, ArrowRight, Zap,
  Shield, Clock, Headphones, Users, Star, Check,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Mascot } from '@/components/mascot'
import { useMemo } from 'react'

// ── animation helpers ──────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

// ── small floating card ────────────────────────────────────────────────────
function MiniCard({
  product, className,
}: {
  product: { name: string; image_url?: string; sale_price?: number; price: number }
  className?: string
}) {
  const price = product.sale_price != null ? product.sale_price : product.price
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute w-28 rounded-xl border border-primary/30 bg-card/90 backdrop-blur-md shadow-xl shadow-black/40 p-2.5 ${className}`}
    >
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover rounded-lg mb-1.5" />
      ) : (
        <div className="w-full aspect-square rounded-lg bg-primary/10 mb-1.5 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-primary/40" />
        </div>
      )}
      <p className="text-[10px] font-bold text-foreground leading-tight truncate">{product.name}</p>
      <p className="text-xs font-black text-primary mt-0.5">
        ฿{price.toLocaleString()}
      </p>
    </motion.div>
  )
}

// ── main component ─────────────────────────────────────────────────────────
export function HomeHero() {
  const { activeProducts, orders, members, formatMoney, settings } = useStore()

  // featured = product with most sold (or highest price if no sold data)
  const featured = useMemo(() =>
    [...activeProducts]
      .filter(p => (p.sale_price ?? p.price) > 0)
      .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))[0],
    [activeProducts]
  )

  // mini cards = next 4 products (exclude featured)
  const minis = useMemo(() =>
    activeProducts.filter(p => p.id !== featured?.id && (p.sale_price ?? p.price) > 0).slice(0, 4),
    [activeProducts, featured]
  )

  const featuredPrice = featured
    ? (featured.sale_price != null ? featured.sale_price : featured.price)
    : 0
  const featuredOriginal = featured?.price ?? 0
  const hasDiscount = featuredOriginal > featuredPrice

  const minPrice = activeProducts.reduce(
    (min, p) => Math.min(min, p.sale_price ?? p.price), Infinity
  )

  const features = [
    { icon: Shield, text: 'ปลอดภัย 100%' },
    { icon: Clock,  text: 'ส่งทันทีอัตโนมัติ 24 ชม.' },
    { icon: Headphones, text: 'มีบริการหลังการขาย' },
    { icon: Users,  text: 'ลูกค้าประจำ ' + (members.length + (settings.heroStats?.baseMembers ?? 0)).toLocaleString('th-TH') + ' คน' },
  ]

  return (
    <section className="relative min-h-[85vh] flex items-center py-16 sm:py-20 px-4 overflow-hidden">

      {/* dot grid + glow */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-60" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[700px] h-[700px] bg-primary/12 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 -left-32 w-[350px] h-[350px] bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-6 items-center">

          {/* ── LEFT ─────────────────────────────────────────────────── */}
          <div>
            {/* badge */}
            <motion.div {...fadeUp(0)} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-bold">
                <Zap className="w-4 h-4 fill-primary" />
                สินค้าดิจิทัลพร้อมใช้ ส่งทันที
              </span>
            </motion.div>

            {/* headline */}
            <motion.h1 {...fadeUp(0.06)} className="font-black leading-[1.0] tracking-tight mb-3">
              <span className="block text-6xl sm:text-7xl lg:text-8xl bg-gradient-to-r from-primary via-violet-400 to-blue-400 bg-clip-text text-transparent">
                จบงานไว
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-[2.6rem] text-foreground mt-1">
                ด้วยสินค้าดิจิทัลพร้อมใช้
              </span>
            </motion.h1>

            {/* sub */}
            <motion.p {...fadeUp(0.12)} className="text-base sm:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              รวม Prompt, Script, Template และ Workflow<br />
              สำหรับคนทำคอนเทนต์และงานออนไลน์<br />
              <span className="text-foreground/70">ดาวน์โหลดได้ทันทีหลังชำระเงิน</span>
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.16)} className="flex flex-wrap gap-3 mb-8">
              <Link href="/store">
                <Button size="lg" className="gap-2 font-bold text-base h-13 px-8 shadow-xl shadow-primary/30 group">
                  <ShoppingBag className="w-5 h-5" />
                  เลือกซื้อสินค้า
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#guide">
                <Button size="lg" variant="outline" className="gap-2 font-bold text-base h-13 px-7 border-border/60 hover:border-primary/50">
                  <HelpCircle className="w-5 h-5" />
                  ดูวิธีซื้อ
                </Button>
              </Link>
            </motion.div>

            {/* trust badges */}
            <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-2">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: mascot + product showcase ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center items-center min-h-[420px] lg:min-h-[500px]"
          >
            {/* glow behind */}
            <div className="absolute w-72 h-72 bg-primary/15 rounded-full blur-3xl" />

            {/* mascot — floating top-right */}
            <div className="absolute -top-8 -right-4 z-30">
              <Mascot page="home" size={160} message="ซื้อแล้วลุยเลย!" float />
            </div>

            {/* ── Featured center card ── */}
            {featured && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-64 sm:w-72 rounded-3xl border-2 border-primary/40 bg-card/90 backdrop-blur-md shadow-2xl shadow-primary/20 overflow-hidden"
              >
                {/* BEST SELLER badge */}
                <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-black shadow-lg shadow-amber-500/40">
                  ⭐ BEST SELLER
                </div>

                {/* image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-violet-900/20">
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-20 h-20 text-primary/20" />
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-black">
                      -{Math.round((1 - featuredPrice / featuredOriginal) * 100)}%
                    </div>
                  )}
                </div>

                {/* info */}
                <div className="p-4">
                  <h3 className="font-black text-sm text-foreground leading-tight mb-1 line-clamp-2">
                    {featured.name}
                  </h3>

                  {/* rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">({featured.sold ?? 0} ขาย)</span>
                  </div>

                  {/* includes */}
                  {featured.short_description && (
                    <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed line-clamp-2">
                      {featured.short_description}
                    </p>
                  )}

                  {/* includes checklist */}
                  <div className="space-y-0.5 mb-3">
                    {['ดาวน์โหลดได้ทันที', 'อัปเดตฟรีตลอด', 'ใช้งานได้ไม่จำกัด'].map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      {hasDiscount && (
                        <del className="text-[10px] text-muted-foreground/60 block">
                          {formatMoney(featuredOriginal)}
                        </del>
                      )}
                      <span className="text-xl font-black text-primary">{formatMoney(featuredPrice)}</span>
                    </div>
                    <Link href={`/checkout?product=${encodeURIComponent(featured.id)}`}>
                      <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        ซื้อ
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Mini floating cards ── */}
            {minis[0] && <MiniCard product={minis[0]} className="-top-4 -left-2 rotate-[-8deg] z-20" />}
            {minis[1] && <MiniCard product={minis[1]} className="-top-4 -right-2 rotate-[8deg] z-20" />}
            {minis[2] && <MiniCard product={minis[2]} className="-bottom-4 -left-4 rotate-[-5deg] z-20" />}
            {minis[3] && <MiniCard product={minis[3]} className="-bottom-4 -right-0 rotate-[5deg] z-20" />}
          </motion.div>
        </div>

        {/* ── Bottom feature bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 pt-8 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
        >
          {[
            { icon: Zap,        label: 'ส่งทันที',               sub: 'ออโต้ 24 ชม.' },
            { icon: Shield,     label: 'ตรวจสอบออเดอร์ได้',      sub: 'ระบบ real-time' },
            { icon: Headphones, label: 'มีบริการหลังการขาย',    sub: 'ทีมงานพร้อมช่วย' },
            { icon: Users,      label: 'ลูกค้าประจำ',            sub: (orders.length + (settings.heroStats?.baseOrders ?? 0)).toLocaleString('th-TH') + '+ ออเดอร์' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border border-border/30 bg-card/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
