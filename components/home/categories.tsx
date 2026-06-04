'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, MessageSquare, FileText,
  LayoutTemplate, GitBranch, Package,
  Star, Zap, ShoppingCart, TrendingUp,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { useMemo } from 'react'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

const CATS = [
  { key: 'Prompt',      label: 'Prompt',      sub: 'รวม Prompts พร้อมใช้',       Icon: MessageSquare,  color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/25', glow: 'hover:shadow-violet-500/15', dot: 'bg-violet-400' },
  { key: 'Script',      label: 'Script',      sub: 'สคริปต์ไวรัลพร้อมอัด',       Icon: FileText,       color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/25',   glow: 'hover:shadow-blue-500/15',   dot: 'bg-blue-400' },
  { key: 'Template',    label: 'Template',    sub: 'Template สำเร็จรูป',          Icon: LayoutTemplate, color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/25',glow:'hover:shadow-emerald-500/15',dot:'bg-emerald-400'},
  { key: 'Workflow',    label: 'Workflow',    sub: 'ระบบการทำงาน Auto',           Icon: GitBranch,      color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/25',glow:'hover:shadow-orange-500/15', dot:'bg-orange-400'},
  { key: 'Content Kit', label: 'Content Kit', sub: 'ชุดอุปกรณ์คอนเทนต์',        Icon: Package,        color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/25',   glow: 'hover:shadow-pink-500/15',   dot: 'bg-pink-400' },
]

function ProductCard({ product, index }: {
  product: { id: string; name: string; image_url?: string; price: number; sale_price?: number; badge?: string; sold?: number; rating?: number }
  index: number
}) {
  const { formatMoney } = useStore()
  const price  = product.sale_price != null ? product.sale_price : product.price
  const orig   = product.price
  const pct    = orig > price ? Math.round((1 - price / orig) * 100) : 0
  const isFree = price === 0
  const BADGES = ['HOT', 'BEST SELLER', 'NEW', 'SALE', 'HOT']

  return (
    <motion.div
      {...fade(index * 0.06)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex-shrink-0 w-52 sm:w-56 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-violet-900/10">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-primary/20" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {pct > 0 && <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-black">-{pct}%</span>}
          <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-black">
            {product.badge || BADGES[index % BADGES.length]}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-xs text-foreground leading-tight mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[10px] text-amber-400 font-bold">{product.rating?.toFixed(1) ?? '5.0'}</span>
          {product.sold != null && (
            <span className="text-[10px] text-muted-foreground">| ขายแล้ว {product.sold.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            {orig > price && <del className="text-[10px] text-muted-foreground/60 block leading-none">{formatMoney(orig)}</del>}
            <span className={`text-base font-black ${isFree ? 'text-emerald-400' : 'text-primary'}`}>
              {isFree ? 'ฟรี!' : formatMoney(price)}
            </span>
          </div>
          <Link href={`/checkout?product=${encodeURIComponent(product.id)}`}>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">
              <ShoppingCart className="w-3 h-3" />
              สั่งซื้อ
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export function HomeCategories() {
  const { settings, activeProducts } = useStore()

  if (!settings.visibility.homeCategories) return null

  const featured = useMemo(() =>
    [...activeProducts].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 8),
    [activeProducts]
  )

  return (
    <>
      {/* สินค้าแนะนำ */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade()} className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">แนะนำ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">สินค้าแนะนำ</h2>
              <p className="text-sm text-muted-foreground mt-1">ช่วยพัฒนาสินค้าของคุณได้ง่ายขึ้น ลองดูสินค้าที่เราคัดเลือกให้</p>
            </div>
            <Link href="/store">
              <button className="hidden sm:flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

          {featured.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              ยังไม่มีสินค้า — เพิ่มสินค้าในแผงแอดมิน
            </div>
          )}
        </div>
      </section>

      {/* หมวดหมู่สินค้า */}
      <section className="py-12 px-4 bg-card/20 border-y border-border/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade()} className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">หมวดหมู่สินค้า</h2>
            <p className="text-sm text-muted-foreground">เลือกประเภทสินค้าที่เหมาะกับงานของคุณ</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATS.map((cat, i) => (
              <motion.div key={cat.key} {...fade(i * 0.07)}>
                <Link href={`/store?category=${encodeURIComponent(cat.key)}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`group relative p-5 rounded-2xl border bg-card/50 cursor-pointer text-center overflow-hidden hover:shadow-lg transition-all duration-300 ${cat.bg} ${cat.glow}`}
                  >
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${cat.dot} opacity-60`} />
                    <div className={`w-14 h-14 rounded-2xl border mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${cat.bg}`}>
                      <cat.Icon className={`w-7 h-7 ${cat.color}`} />
                    </div>
                    <h3 className={`font-black text-sm mb-1 ${cat.color}`}>{cat.label}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{cat.sub}</p>
                    <div className={`mt-3 flex items-center justify-center gap-1 text-[10px] font-bold ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      ดูสินค้า <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div {...fade(0.4)} className="mt-6 text-center">
            <Link href="/store">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/25 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                <Zap className="w-4 h-4" />
                ดูสินค้าทั้งหมด
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
