'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingBag, HelpCircle, ArrowRight, Zap,
  Shield, Clock, Headphones, Users, Star, Check, Package,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

// ── mini floating product card ─────────────────────────────────────────────
function MiniCard({
  name, image_url, price, origPrice, rotate = 0, delay = 0,
  formatMoney,
}: {
  name: string; image_url?: string; price: number; origPrice: number
  rotate?: number; delay?: number; formatMoney: (n: number) => string
}) {
  const pct = origPrice > price ? Math.round((1 - price / origPrice) * 100) : 0

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ rotate }}
      className="w-32 rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/50 overflow-hidden"
    >
      {/* image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-primary/15 to-violet-900/20 overflow-hidden">
        {image_url ? (
          <img src={image_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-primary/20" />
          </div>
        )}
        {pct > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-black">
            -{pct}%
          </span>
        )}
      </div>
      {/* info */}
      <div className="p-2">
        <p className="text-[10px] font-bold text-foreground leading-tight line-clamp-2 mb-1">{name}</p>
        <p className="text-sm font-black text-primary leading-none">{formatMoney(price)}</p>
      </div>
    </motion.div>
  )
}

// ── main featured card ─────────────────────────────────────────────────────
function FeaturedCard({
  product, formatMoney,
}: {
  product: { id: string; name: string; image_url?: string; price: number; sale_price?: number; badge?: string; short_description?: string; rating?: number; sold?: number }
  formatMoney: (n: number) => string
}) {
  const price = product.sale_price != null ? product.sale_price : product.price
  const orig  = product.price
  const pct   = orig > price ? Math.round((1 - price / orig) * 100) : 0

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-72 rounded-3xl overflow-hidden border-2 border-primary/50 bg-card/90 backdrop-blur-md shadow-2xl shadow-primary/25"
      style={{ boxShadow: '0 0 40px oklch(0.55 0.27 292 / 0.2), 0 25px 50px rgb(0 0 0 / 0.5)' }}
    >
      {/* BEST SELLER badge */}
      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-amber-500 text-white text-[10px] font-black shadow-lg shadow-amber-500/40 flex items-center gap-1">
        ⭐ BEST SELLER
      </div>

      {/* product image */}
      <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-violet-950/30 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-24 h-24 text-primary/15" />
          </div>
        )}
        {pct > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-red-500 text-white text-xs font-black shadow-lg">
            -{pct}%
          </div>
        )}
        {/* gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
      </div>

      {/* content */}
      <div className="p-5">
        <h3 className="font-black text-base text-foreground leading-tight mb-2 line-clamp-2">{product.name}</h3>

        {/* rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.sold ?? 0} ขาย)</span>
        </div>

        {/* checklist */}
        <div className="space-y-1 mb-4">
          {['ดาวน์โหลดได้ทันที', 'ใช้งานได้ไม่จำกัด', 'อัปเดตฟรีตลอด'].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* price + buy */}
        <div className="flex items-end justify-between gap-3">
          <div>
            {orig > price && (
              <del className="text-xs text-muted-foreground/60 block leading-none mb-0.5">{formatMoney(orig)}</del>
            )}
            <span className="text-2xl font-black text-primary">{formatMoney(price)}</span>
          </div>
          <Link href={`/checkout?product=${encodeURIComponent(product.id)}`} className="shrink-0">
            <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
              <Zap className="w-4 h-4" />
              ซื้อ
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ── page component ─────────────────────────────────────────────────────────
export function HomeHero() {
  const { activeProducts, orders, members, formatMoney, settings } = useStore()

  // featured = most sold paid product
  const featured = useMemo(() =>
    [...activeProducts]
      .filter(p => (p.sale_price ?? p.price) > 0)
      .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))[0],
    [activeProducts]
  )

  // surrounding mini cards (exclude featured, up to 4)
  const minis = useMemo(() =>
    activeProducts
      .filter(p => p.id !== featured?.id && (p.sale_price ?? p.price) > 0)
      .slice(0, 4)
      .map(p => ({
        ...p,
        price: p.sale_price ?? p.price,
        origPrice: p.price,
      })),
    [activeProducts, featured]
  )

  const totalOrders = orders.length + (settings.heroStats?.baseOrders ?? 0)
  const totalMembers = members.length + (settings.heroStats?.baseMembers ?? 0)

  return (
    <section className="relative min-h-[88vh] flex items-center py-16 sm:py-20 px-4 overflow-hidden">

      {/* bg: dot grid + glows */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-4 items-center">

          {/* ── LEFT ─────────────────────────────────────────────────── */}
          <div className="max-w-lg">
            {/* kicker */}
            <motion.div {...fadeUp(0)} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-bold">
                <Zap className="w-4 h-4 fill-primary" />
                สินค้าดิจิทัลพร้อมใช้ ส่งทันที
              </span>
            </motion.div>

            {/* headline */}
            <motion.div {...fadeUp(0.06)}>
              <h1 className="font-black leading-[1.0] tracking-tight mb-3">
                <span className="block text-7xl sm:text-8xl lg:text-[5.5rem] text-gradient">
                  จบงานไว
                </span>
                <span className="block text-3xl sm:text-4xl text-foreground mt-2">
                  ด้วยสินค้าดิจิทัลพร้อมใช้
                </span>
              </h1>
            </motion.div>

            {/* sub */}
            <motion.p {...fadeUp(0.12)} className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              รวม Prompt, Script, Template และ Workflow<br />
              สำหรับคนทำคอนเทนต์และงานออนไลน์<br />
              <span className="text-foreground/70 text-sm">ดาวน์โหลดได้ทันทีหลังชำระเงิน</span>
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.16)} className="flex flex-wrap gap-3 mb-8">
              <Link href="/store">
                <Button size="lg" className="gap-2 font-bold h-13 px-8 shadow-xl shadow-primary/30 group text-base">
                  <ShoppingBag className="w-5 h-5" />
                  เลือกซื้อสินค้า
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#guide">
                <Button size="lg" variant="outline" className="gap-2 font-bold h-13 px-7 border-border/60 hover:border-primary/50 text-base">
                  <HelpCircle className="w-5 h-5" />
                  ดูวิธีซื้อ
                </Button>
              </Link>
            </motion.div>

            {/* stats */}
            <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                ลูกค้าประจำ <strong className="text-foreground">{totalMembers.toLocaleString('th-TH')}</strong> คน
              </span>
              <span className="text-border/60">|</span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-primary" />
                ออเดอร์ <strong className="text-foreground">{totalOrders.toLocaleString('th-TH')}+</strong> รายการ
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT: floating product cards ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center items-center min-h-[480px]"
          >
            {/* aurora + glow graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 aurora-blob opacity-30 rounded-full" />
              <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-[80px]" />
            </div>

            {/* featured center card */}
            {featured && (
              <div className="relative z-10">
                <FeaturedCard product={featured} formatMoney={formatMoney} />
              </div>
            )}

            {/* mini card — top left */}
            {minis[0] && (
              <div className="absolute top-0 left-0 z-20">
                <MiniCard {...minis[0]} rotate={-8} delay={0.3} formatMoney={formatMoney} />
              </div>
            )}

            {/* mini card — top right */}
            {minis[1] && (
              <div className="absolute top-0 right-0 z-20">
                <MiniCard {...minis[1]} rotate={8} delay={0.8} formatMoney={formatMoney} />
              </div>
            )}

            {/* mini card — bottom left */}
            {minis[2] && (
              <div className="absolute bottom-0 left-0 z-20">
                <MiniCard {...minis[2]} rotate={-5} delay={1.2} formatMoney={formatMoney} />
              </div>
            )}

            {/* mini card — bottom right */}
            {minis[3] && (
              <div className="absolute bottom-0 right-0 z-20">
                <MiniCard {...minis[3]} rotate={5} delay={0.6} formatMoney={formatMoney} />
              </div>
            )}
          </motion.div>
        </div>

        {/* ── bottom feature bar ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border/20 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { icon: Zap,        label: 'ส่งทันที',             sub: 'ออโต้ 24 ชม.' },
            { icon: Shield,     label: 'ตรวจสอบออเดอร์ได้',   sub: 'ระบบ real-time' },
            { icon: Headphones, label: 'มีบริการหลังการขาย', sub: 'ทีมงานพร้อมช่วย' },
            { icon: Clock,      label: 'ลูกค้าประจำ',          sub: `${totalOrders}+ ออเดอร์` },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label}
              className="flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border border-border/20 bg-card/20 hover:border-primary/25 hover:bg-primary/5 transition-all text-center"
            >
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
