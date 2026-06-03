'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Zap, Sparkles, Check, X, Eye, Package, User, Car, Boxes, Flame, Shield, Monitor, Gamepad2, Pencil, Save, Camera, Trash2, Clock, Users, Tag, Star, MessageSquare, Send, Gift, ChevronLeft, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { type Product } from '@/lib/store-data'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ImageInput } from '@/components/ui/image-input'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const categoryStyles: Record<string, { gradient: string; iconBg: string; textColor: string; Icon: LucideIcon }> = {
  'ACCOUNT':   { gradient: 'from-blue-500/30 via-blue-950/20 to-card',    iconBg: 'bg-blue-500/20 border border-blue-500/30',     textColor: 'text-blue-300',   Icon: User },
  'FIVEM':     { gradient: 'from-violet-500/30 via-violet-950/20 to-card', iconBg: 'bg-violet-500/20 border border-violet-500/30', textColor: 'text-violet-300', Icon: Car },
  'ROBLOX':    { gradient: 'from-red-500/30 via-red-950/20 to-card',       iconBg: 'bg-red-500/20 border border-red-500/30',       textColor: 'text-red-300',    Icon: Boxes },
  'FREE FIRE': { gradient: 'from-orange-500/30 via-orange-950/20 to-card', iconBg: 'bg-orange-500/20 border border-orange-500/30', textColor: 'text-orange-300', Icon: Flame },
  'SERVICE':   { gradient: 'from-emerald-500/30 via-emerald-950/20 to-card',iconBg: 'bg-emerald-500/20 border border-emerald-500/30',textColor: 'text-emerald-300',Icon: Shield },
  'GAME':      { gradient: 'from-cyan-500/30 via-cyan-950/20 to-card',     iconBg: 'bg-cyan-500/20 border border-cyan-500/30',     textColor: 'text-cyan-300',   Icon: Gamepad2 },
  'SCRIPT':    { gradient: 'from-pink-500/30 via-pink-950/20 to-card',     iconBg: 'bg-pink-500/20 border border-pink-500/30',     textColor: 'text-pink-300',   Icon: Monitor },
}
const defaultStyle = { gradient: 'from-primary/20 via-primary/5 to-card', iconBg: 'bg-primary/10 border border-primary/20', textColor: 'text-primary/60', Icon: Package }

function useCountdown(endTime: string | undefined) {
  const [remaining, setRemaining] = useState<number | null>(null)
  useEffect(() => {
    if (!endTime) { setRemaining(null); return }
    // 'always' = เปิดตลอด ไม่มี countdown
    if (endTime === 'always') { setRemaining(Infinity); return }
    // 'daily' = รีเซ็ตทุก midnight
    if (endTime === 'daily') {
      const calc = () => {
        const now = new Date()
        const midnight = new Date(now)
        midnight.setHours(23, 59, 59, 999)
        setRemaining(midnight.getTime() - now.getTime())
      }
      calc()
      const id = setInterval(calc, 1000)
      return () => clearInterval(id)
    }
    const calc = () => {
      const diff = new Date(endTime).getTime() - Date.now()
      setRemaining(diff > 0 ? diff : 0)
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [endTime])
  return remaining
}

function FlashTimer({ ms, size = 'sm', showLabels = true }: { ms: number; size?: 'sm' | 'md'; showLabels?: boolean }) {
  const isSmall = size === 'sm'
  // 'always' mode — แสดง ∞ แทน countdown
  if (!isFinite(ms)) {
    return (
      <span className={`${isSmall ? 'text-xs' : 'text-sm'} bg-black/30 text-white font-black rounded px-2 py-0.5 font-mono`}>
        24/7
      </span>
    )
  }
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const parts = [
    { val: h, label: 'ชม.' },
    { val: m, label: 'นาที' },
    { val: sec, label: 'วิ' },
  ]
  return (
    <div className="flex items-center gap-0.5">
      {parts.map((p, i) => (
        <div key={i} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className={`text-white/70 font-black leading-none ${isSmall ? 'text-[10px]' : 'text-sm'} ${showLabels ? 'mb-2.5' : ''}`}>:</span>
          )}
          <div className="flex flex-col items-center">
            <span className={`${isSmall ? 'min-w-[20px] h-5 text-[10px]' : 'min-w-[28px] h-7 text-sm'} bg-black/30 text-white font-black rounded flex items-center justify-center font-mono`}>
              {String(p.val).padStart(2, '0')}
            </span>
            {showLabels && (
              <span className={`${isSmall ? 'text-[7px]' : 'text-[8px]'} text-white/60 leading-tight mt-0.5`}>{p.label}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatCountdown(ms: number) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map(n => String(n).padStart(2, '0')).join(':')
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, formatMoney, isAdmin, products, updateProducts, openModal, closeModal, getProductRating, getProductSoldCount, getProductViewCount, incrementProductViews, currentMember, createOrder, orders } = useStore()
  const router = useRouter()
  const [showDetail, setShowDetail] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showAdminEdit, setShowAdminEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const price = product.sale_price || product.price
  const hasDiscount = product.price > price
  const isFree = price === 0
  const discountPercent = hasDiscount ? Math.round((1 - price / product.price) * 100) : 0
  const savings = hasDiscount ? product.price - price : 0
  const catStyle = categoryStyles[product.category] || defaultStyle
  const CatIcon = catStyle.Icon

  const remaining = useCountdown(product.flash_sale_end)
  const isFlashSale = remaining !== null && (remaining === Infinity || remaining > 0)
  const isLowStock = product.stock_qty !== null && product.stock_qty !== undefined && product.stock_qty > 0 && product.stock_qty <= 10
  const isOutOfStock = product.stock_qty !== null && product.stock_qty !== undefined && product.stock_qty === 0

  const stableHash = useMemo(() => {
    let h = 0
    for (const c of product.id) h = (h * 31 + c.charCodeAt(0)) & 0xffff
    return h
  }, [product.id])
  const viewsDisplay = getProductViewCount(product.id, stableHash, product.views)
  const soldCount = getProductSoldCount(product.id, stableHash, product.sold)
  const stableRating = getProductRating(product.id, stableHash, product.rating).toFixed(1)

  const alreadyOwned = useMemo(() => currentMember !== null && orders.some(o =>
    o.status !== 'cancelled' &&
    (o.member_id === currentMember!.id || o.customer_username === currentMember!.username) &&
    o.items.some(i => i.id === product.id)
  ), [currentMember, orders, product.id])

  const handleOpenDetail = () => {
    setShowDetail(true)
    openModal()
    incrementProductViews(product.id, stableHash)
  }
  const handleCloseDetail = () => {
    setShowDetail(false)
    closeModal()
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdding(true)
    addToCart(product.id)
    setTimeout(() => setIsAdding(false), 600)
  }

  const handleClaimFree = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!currentMember) { router.push('/login'); return }

    const alreadyClaimed = orders.some(o =>
      o.source === 'free_claim' &&
      o.status !== 'cancelled' &&
      (o.member_id === currentMember.id || o.customer_username === currentMember.username) &&
      o.items.some(i => i.id === product.id)
    )
    if (alreadyClaimed) {
      toast.info('คุณรับสินค้านี้ไปแล้ว')
      if (product.download_url) window.open(product.download_url, '_blank', 'noopener')
      return
    }

    const freeLinks = product.download_urls?.filter(Boolean).length ? product.download_urls.filter(Boolean) : product.download_url ? [product.download_url] : []
    createOrder({
      status: 'delivered',
      customer_name: currentMember.display_name || currentMember.username,
      customer_username: currentMember.username,
      phone: '', line_id: '',
      note: 'รับสินค้าฟรี',
      paid_amount: 0, paid_at: new Date().toISOString(), total_amount: 0,
      items: [{ id: product.id, sku: product.sku, name: product.name, category: product.category, price: 0, qty: 1, delivery_note: product.delivery_note }],
      slip_data: '', member_id: currentMember.id, source: 'free_claim',
      delivery_link: freeLinks[0] || '',
      delivery_links: freeLinks,
      admin_note: '', promo_code: '', discount_amount: 0,
    })
    if (freeLinks[0]) {
      window.open(freeLinks[0], '_blank', 'noopener')
      toast.success('รับสินค้าแล้ว! เปิดลิงก์ให้แล้ว')
    } else {
      toast.success('รับสินค้าแล้ว! แอดมินจะส่งสินค้าให้เร็วๆ นี้')
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!confirmDelete) {
      setConfirmDelete(true)
      deleteTimer.current = setTimeout(() => setConfirmDelete(false), 3000)
    } else {
      clearTimeout(deleteTimer.current)
      updateProducts(products.filter(p => p.id !== product.id))
      toast.success(`ลบ "${product.name}" แล้ว`)
    }
  }

  // cleanup timer on unmount
  useEffect(() => () => clearTimeout(deleteTimer.current), [])

  return (
    <>
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1],
          y: { type: "spring", stiffness: 400, damping: 25 }
        }}
        className="group relative flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
      >
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden cursor-pointer bg-card"
          onClick={handleOpenDetail}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${catStyle.gradient} flex flex-col items-center justify-center gap-3`}>
              {/* subtle grid */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl ${catStyle.iconBg} flex items-center justify-center`}>
                  <CatIcon className={`w-7 h-7 ${catStyle.textColor}`} />
                </div>
                <div className="text-center">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${catStyle.textColor} block`}>{product.category}</span>
                  <span className="text-[9px] text-muted-foreground/50">1:1 Square</span>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4 transition-opacity"
          >
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <Eye className="w-4 h-4" />
              <span>ดูรายละเอียด</span>
            </motion.div>
          </motion.div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
            {hasDiscount && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-lg shadow-emerald-500/30"
              >
                -{discountPercent}%
              </motion.span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold shadow-lg">
              {product.badge || 'พร้อมส่ง'}
            </span>
          </div>
          
          {/* Quick buy / free / owned button — hidden when out of stock */}
          {!isOutOfStock && (
            <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
              {alreadyOwned ? (
                <Button size="icon" onClick={e => { e.stopPropagation(); handleOpenDetail() }} className="h-9 w-9 rounded-xl shadow-lg bg-white/90 text-foreground hover:bg-white">
                  <Eye className="w-4 h-4" />
                </Button>
              ) : isFree ? (
                <Button size="icon" onClick={e => handleClaimFree(e)} className="h-9 w-9 rounded-xl shadow-lg bg-emerald-500 text-white hover:bg-emerald-600">
                  <Gift className="w-4 h-4" />
                </Button>
              ) : (
                <Link href={`/checkout?product=${encodeURIComponent(product.id)}`}>
                  <Button size="icon" className="h-9 w-9 rounded-xl shadow-lg bg-white text-foreground hover:bg-white/90">
                    <Zap className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Admin delete button — bottom-right, hover only */}
          {isAdmin && (
            <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
              <motion.button
                onClick={handleDelete}
                animate={confirmDelete ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-200 ${
                  confirmDelete
                    ? 'bg-red-500 text-white ring-2 ring-red-400 ring-offset-1 ring-offset-transparent'
                    : 'bg-black/60 text-red-400 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>{confirmDelete ? 'ยืนยัน?' : 'ลบ'}</span>
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Flash Sale Banner — between image and body */}
        {isFlashSale && (
          <div className="mx-3 my-2 rounded-xl overflow-hidden flex items-stretch bg-gradient-to-r from-red-600 to-red-500">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-red-700/60">
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
              </motion.div>
              <span className="text-[11px] font-black text-white tracking-widest uppercase whitespace-nowrap">Flash Sale</span>
            </div>
            <motion.div
              className="flex-1 flex items-center justify-end px-3 gap-1"
              animate={{ opacity: [1, 0.75, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FlashTimer ms={remaining!} size="sm" showLabels={false} />
            </motion.div>
          </div>
        )}

        {/* Product Body */}
        {isFlashSale ? (
          /* ── FLASH SALE LAYOUT ── */
          <div className="flex-1 flex flex-col p-3 gap-2">
            {/* Title */}
            <h3
              className="font-bold text-sm leading-tight line-clamp-2 cursor-pointer group-hover:text-primary transition-colors"
              onClick={handleOpenDetail}
            >
              {product.name}
            </h3>

            {/* Social proof */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-wrap">
              <span className="text-yellow-400 font-bold">★ {stableRating}</span>
              <span className="opacity-30">|</span>
              <span>{viewsDisplay.toLocaleString()} ยอดดู</span>
              <span className="opacity-30">|</span>
              <span>ขายแล้ว {soldCount.toLocaleString()}</span>
            </div>

            {/* Price — Shopee style */}
            <div>
              <div className="flex items-center gap-1.5">
                <del className="text-[11px] text-muted-foreground/60">{formatMoney(product.price)}</del>
                {hasDiscount && (
                  <span className="text-[10px] text-red-400 font-bold">(-{discountPercent}%)</span>
                )}
              </div>
              {isFree
                ? <strong className="text-2xl text-emerald-400 font-black leading-tight">ฟรี!</strong>
                : <strong className="text-2xl text-primary font-black leading-tight">{formatMoney(price)}</strong>
              }
            </div>

            {/* Scarcity bar */}
            {isLowStock && (
              <div className="space-y-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-orange-400 font-bold flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5" /> เหลือ {product.stock_qty} ชิ้น
                  </span>
                  <span className="text-muted-foreground">ขายเร็วมาก</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(5, Math.min(35, (product.stock_qty! / 20) * 100))}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Buttons — cart icon + buy / free / owned */}
            <div className="flex gap-2 mt-auto pt-1">
              {alreadyOwned ? (
                <Button
                  variant="outline"
                  className="w-full h-10 font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  onClick={e => { e.stopPropagation(); handleOpenDetail() }}
                >
                  <Eye className="w-4 h-4" />
                  ดูสินค้า
                </Button>
              ) : (
                <>
                  {!isFree && (
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 rounded-xl shrink-0 transition-all ${isAdding ? 'border-emerald-500 text-emerald-500' : 'border-primary/30 hover:bg-primary/10'}`}
                      onClick={handleAddToCart}
                      disabled={isAdding || isOutOfStock}
                    >
                      {isAdding ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    </Button>
                  )}
                  {isFree ? (
                    <Button
                      className="w-full h-10 font-bold shadow-lg shadow-emerald-500/30 gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={e => handleClaimFree(e)}
                      disabled={isOutOfStock}
                    >
                      <Gift className="w-4 h-4" />
                      {isOutOfStock ? 'หมดสต็อก' : 'รับฟรี!'}
                    </Button>
                  ) : (
                    <Link href={`/checkout?product=${encodeURIComponent(product.id)}`} className="flex-1">
                      <Button className="w-full h-10 font-bold shadow-lg shadow-primary/25 gap-1.5" disabled={isOutOfStock}>
                        <Zap className="w-4 h-4" />
                        {isOutOfStock ? 'หมดสต็อก' : 'ซื้อเลย'}
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={e => { e.stopPropagation(); setShowAdminEdit(true) }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all"
              >
                <Pencil className="w-3 h-3" /> แก้ไขสินค้า
              </button>
            )}
          </div>
        ) : (
          /* ── NORMAL LAYOUT ── */
          <div className="flex-1 flex flex-col p-4">
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold">
                <Sparkles className="w-2.5 h-2.5" />
                {product.category || 'Digital'}
              </span>
            </div>

            {/* Title */}
            <h3
              className="font-bold text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
              onClick={handleOpenDetail}
            >
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1">
              {product.short_description || 'สินค้า Digital พร้อมส่ง'}
            </p>

            {/* Scarcity */}
            {isLowStock && (
              <div className="mb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400 shrink-0" />
                    <span className="text-[10px] text-orange-400 font-bold">เหลือเพียง {product.stock_qty} ชิ้น!</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">ขายเร็วมาก</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(5, Math.min(35, (product.stock_qty! / 20) * 100))}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  />
                </div>
              </div>
            )}
            {isOutOfStock && (
              <div className="mb-2 flex items-center gap-1.5">
                <X className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-bold">สินค้าหมดแล้ว</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end justify-between gap-2 mb-2">
              <div>
                {hasDiscount && (
                  <del className="text-[10px] text-muted-foreground/70 block leading-none">{formatMoney(product.price)}</del>
                )}
                {isFree
                  ? <strong className="text-xl text-emerald-400 font-bold leading-none">ฟรี!</strong>
                  : <strong className="text-xl text-primary font-bold leading-none">{formatMoney(price)}</strong>
                }
              </div>
              {savings > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold">
                  <Tag className="w-2.5 h-2.5" />
                  ประหยัด {formatMoney(savings)}
                </span>
              )}
            </div>

            {/* Viewer count */}
            <div className="flex items-center gap-1 mb-2">
              <Users className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[9px] text-muted-foreground/50">{viewsDisplay.toLocaleString()} ยอดดู</span>
            </div>

            {/* Add to Cart / Free Claim / Already Owned */}
            {alreadyOwned ? (
              <Button
                variant="outline"
                className="w-full gap-2 font-semibold h-10 border-primary/30 text-primary hover:bg-primary/10"
                onClick={handleOpenDetail}
              >
                <Eye className="w-4 h-4" />
                ดูสินค้า
              </Button>
            ) : isFree ? (
              <Button
                className="w-full gap-2 font-semibold h-10 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                onClick={handleClaimFree}
                disabled={isOutOfStock}
              >
                <Gift className="w-4 h-4" />
                {isOutOfStock ? 'หมดสต็อก' : 'รับฟรี!'}
              </Button>
            ) : (
              <Button
                className={`w-full gap-2 font-semibold h-10 transition-all duration-300 ${isAdding ? 'bg-emerald-500 hover:bg-emerald-500 scale-95' : 'shadow-lg shadow-primary/20 hover:shadow-primary/30'}`}
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4" /><span>เพิ่มแล้ว</span>
                    </motion.div>
                  ) : (
                    <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /><span>{isOutOfStock ? 'หมดสต็อก' : 'เพิ่มตะกร้า'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}

            {isAdmin && (
              <button
                onClick={e => { e.stopPropagation(); setShowAdminEdit(true) }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all"
              >
                <Pencil className="w-3 h-3" /> แก้ไขสินค้า
              </button>
            )}
          </div>
        )}
      </motion.article>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        open={showDetail}
        onClose={handleCloseDetail}
      />

      {/* Admin Quick Edit Dialog */}
      {isAdmin && (
        <AdminProductEdit
          product={product}
          open={showAdminEdit}
          onClose={() => setShowAdminEdit(false)}
          onSave={updated => {
            updateProducts(products.map(p => p.id === updated.id ? updated : p))
            toast.success('บันทึกสินค้าแล้ว')
            setShowAdminEdit(false)
          }}
        />
      )}
    </>
  )
}

interface ProductDetailModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const { addToCart, formatMoney, isAdmin, products, updateProducts, currentMember, createOrder, orders, addReview, deleteReview, updateReview, getProductReviews, getProductRating, getProductSoldCount, getProductViewCount } = useStore()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editingRating, setEditingRating] = useState(5)
  const [editingComment, setEditingComment] = useState('')

  const price = product.sale_price || product.price
  const hasDiscount = product.price > price
  const isFree = price === 0
  const discountPercent = hasDiscount ? Math.round((1 - price / product.price) * 100) : 0
  const savings = hasDiscount ? product.price - price : 0
  const catStyle = categoryStyles[product.category] || defaultStyle
  const CatIcon = catStyle.Icon
  const remaining = useCountdown(product.flash_sale_end)
  const isFlashSale = remaining !== null && (remaining === Infinity || remaining > 0)
  const isLowStock = product.stock_qty !== null && product.stock_qty !== undefined && product.stock_qty > 0 && product.stock_qty <= 10
  const isOutOfStock = product.stock_qty !== null && product.stock_qty !== undefined && product.stock_qty === 0

  const handleClaimFreeModal = () => {
    if (!currentMember) { router.push('/login'); return }

    const alreadyClaimed = orders.some(o =>
      o.source === 'free_claim' &&
      o.status !== 'cancelled' &&
      (o.member_id === currentMember.id || o.customer_username === currentMember.username) &&
      o.items.some(i => i.id === product.id)
    )
    if (alreadyClaimed) {
      toast.info('คุณรับสินค้านี้ไปแล้ว')
      if (product.download_url) window.open(product.download_url, '_blank', 'noopener')
      onClose()
      return
    }

    const freeLinks2 = product.download_urls?.filter(Boolean).length ? product.download_urls.filter(Boolean) : product.download_url ? [product.download_url] : []
    createOrder({
      status: 'delivered',
      customer_name: currentMember.display_name || currentMember.username,
      customer_username: currentMember.username,
      phone: '', line_id: '',
      note: 'รับสินค้าฟรี',
      paid_amount: 0, paid_at: new Date().toISOString(), total_amount: 0,
      items: [{ id: product.id, sku: product.sku, name: product.name, category: product.category, price: 0, qty: 1, delivery_note: product.delivery_note }],
      slip_data: '', member_id: currentMember.id, source: 'free_claim',
      delivery_link: freeLinks2[0] || '',
      delivery_links: freeLinks2,
      admin_note: '', promo_code: '', discount_amount: 0,
    })
    if (freeLinks2[0]) {
      window.open(freeLinks2[0], '_blank', 'noopener')
      toast.success('รับสินค้าแล้ว! เปิดลิงก์ให้แล้ว')
    } else {
      toast.success('รับสินค้าแล้ว! แอดมินจะส่งสินค้าให้เร็วๆ นี้')
    }
    onClose()
  }

  const modalHash = useMemo(() => {
    let h = 0
    for (const c of product.id) h = (h * 31 + c.charCodeAt(0)) & 0xffff
    return h
  }, [product.id])

  const alreadyOwned = useMemo(() => currentMember !== null && orders.some(o =>
    o.status !== 'cancelled' &&
    (o.member_id === currentMember!.id || o.customer_username === currentMember!.username) &&
    o.items.some(i => i.id === product.id)
  ), [currentMember, orders, product.id])

  const myDeliveryLink = useMemo(() => {
    if (!currentMember) return undefined
    return orders.find(o =>
      o.status !== 'cancelled' &&
      (o.member_id === currentMember.id || o.customer_username === currentMember.username) &&
      o.items.some(i => i.id === product.id)
    )?.delivery_link
  }, [currentMember, orders, product.id])

  const productReviews = getProductReviews(product.id)
  const viewsDisplay = getProductViewCount(product.id, modalHash, product.views)
  const soldCount = getProductSoldCount(product.id, modalHash, product.sold)
  const stableRating = getProductRating(product.id, modalHash, product.rating).toFixed(1)

  const handleSubmitReview = () => {
    if (!currentMember) { toast.error('กรุณาเข้าสู่ระบบก่อนรีวิว'); return }
    if (!reviewComment.trim()) { toast.error('กรุณาใส่ความคิดเห็น'); return }
    setSubmittingReview(true)
    addReview({ product_id: product.id, member_id: currentMember.id, username: currentMember.username, rating: reviewRating, comment: reviewComment.trim() })
    setReviewComment('')
    setReviewRating(5)
    setSubmittingReview(false)
  }

  const handleSaveEditReview = (id: string) => {
    if (!editingComment.trim()) return
    updateReview(id, { rating: editingRating, comment: editingComment.trim() })
    setEditingReviewId(null)
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product.id)
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 500)
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-card border-border/50 gap-0 max-h-[90vh] flex flex-col overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.short_description || 'รายละเอียดสินค้า'}</DialogDescription>
        </VisuallyHidden>
        {/* Image Section */}
        {(() => {
          const gallery = (product.gallery_images ?? []).filter(Boolean)
          const allImages = [...(product.image_url ? [product.image_url] : []), ...gallery]
          const activeImg = allImages[selectedImageIdx] ?? allImages[0] ?? ''
          const hasGallery = allImages.length > 1
          const goPrev = () => setSelectedImageIdx(i => (i - 1 + allImages.length) % allImages.length)
          const goNext = () => setSelectedImageIdx(i => (i + 1) % allImages.length)
          return (
            <div className="shrink-0">
              {/* Main image — h-72 */}
              <div className="relative h-72 w-full bg-card overflow-hidden">
                {activeImg ? (
                  <img
                    src={activeImg}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${catStyle.gradient} flex flex-col items-center justify-center gap-3`}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className={`relative z-10 w-16 h-16 rounded-2xl ${catStyle.iconBg} flex items-center justify-center`}>
                      <CatIcon className={`w-8 h-8 ${catStyle.textColor}`} />
                    </div>
                    <span className={`relative z-10 text-xs font-bold tracking-widest uppercase ${catStyle.textColor}`}>{product.category}</span>
                  </div>
                )}

                {/* gradient overlay ล่าง */}
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />

                {/* badges บนซ้าย */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 flex-wrap">
                  {hasDiscount && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-lg">
                      -{discountPercent}%
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                    {product.badge || 'พร้อมส่ง'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-bold shadow-lg">
                    {product.category || 'Digital'}
                  </span>
                </div>

                {/* ลูกศรซ้าย/ขวา — แสดงเฉพาะเมื่อมีหลายรูป */}
                {hasGallery && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {/* dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImageIdx(i)}
                          className={`rounded-full transition-all ${
                            selectedImageIdx === i
                              ? 'w-4 h-2 bg-white'
                              : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* admin edit button */}
                {isAdmin && (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="absolute bottom-3 left-3 z-20 h-8 px-3 rounded-full bg-amber-500 backdrop-blur-sm flex items-center gap-1.5 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-lg"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    แก้ไข
                  </button>
                )}
              </div>

              {/* Thumbnail strip */}
              {hasGallery && (
                <div className="flex gap-2 px-3 pt-2.5 pb-1 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIdx(i)}
                      className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === i
                          ? 'border-primary scale-105 shadow-md shadow-primary/20'
                          : 'border-border/40 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`รูป ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Flash Sale strip — between image and content */}
        {isFlashSale && (
          <div className="mx-3 my-2 rounded-xl overflow-hidden flex items-stretch bg-gradient-to-r from-red-600 to-red-500 shrink-0">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-red-700/60 shrink-0">
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <Zap className="w-4 h-4 text-yellow-300" />
              </motion.div>
              <span className="text-sm font-black text-white tracking-widest uppercase">Flash Sale</span>
            </div>
            <motion.div
              className="flex-1 flex items-center justify-end px-4 gap-2"
              animate={{ opacity: [1, 0.75, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-[11px] text-white/70">เหลือเวลา</span>
              <FlashTimer ms={remaining!} size="md" showLabels={false} />
            </motion.div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <h2 className="text-xl font-bold leading-tight">{product.name}</h2>

          {/* Social proof — shown always (bigger when flash sale) */}
          <div className={`flex items-center gap-2 flex-wrap ${isFlashSale ? 'py-2 px-3 rounded-xl bg-red-500/8 border border-red-500/15' : ''}`}>
            <span className="text-yellow-400 font-bold text-sm">★ {stableRating}</span>
            <span className="text-border/40">|</span>
            <span className="text-xs text-muted-foreground">{viewsDisplay.toLocaleString()} ยอดดู</span>
            <span className="text-border/40">|</span>
            <span className="text-xs text-muted-foreground">ขายแล้ว {soldCount.toLocaleString()}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.long_description || product.description || product.short_description || 'สินค้า Digital พร้อมส่ง'}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {['ส่งทันที', 'ปลอดภัย 100%', 'รับประกันสินค้า'].map((feature, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-emerald-500" />
                {feature}
              </span>
            ))}
          </div>

          {/* Delivery Note */}
          {product.delivery_note && (
            <div className="p-3 rounded-xl bg-secondary/50 border border-border/30">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">การส่งมอบ:</strong> {product.delivery_note}
              </p>
            </div>
          )}

          {/* Scarcity */}
          {isLowStock && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <Flame className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-sm text-orange-400 font-bold">เหลือเพียง {product.stock_qty} ชิ้น — สั่งซื้อก่อนหมด!</span>
            </div>
          )}
          {isOutOfStock && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border/30">
              <X className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground font-semibold">สินค้าหมดแล้ว</span>
            </div>
          )}

          {/* Reviews */}
          <div className="pt-3 border-t border-border/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                รีวิวสินค้า {productReviews.length > 0 && <span className="text-xs text-muted-foreground font-normal">({productReviews.length})</span>}
              </span>
            </div>

            {/* Write review */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/30 space-y-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)}>
                    <Star className={`w-4 h-4 transition-colors ${s <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={currentMember ? 'เขียนรีวิว...' : 'เข้าสู่ระบบเพื่อรีวิว'}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  disabled={!currentMember}
                  className="text-sm h-8"
                  onKeyDown={e => e.key === 'Enter' && handleSubmitReview()}
                />
                <Button size="sm" className="h-8 px-3 shrink-0" onClick={handleSubmitReview} disabled={!currentMember || submittingReview}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Review list */}
            {productReviews.length > 0 && (
              <div className="space-y-2">
                {(showAllReviews ? productReviews : productReviews.slice(0, 3)).map(r => (
                  <div key={r.id} className="flex gap-2.5 p-2.5 rounded-xl bg-secondary/30">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                      {r.username[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingReviewId === r.id ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <button key={s} onClick={() => setEditingRating(s)}>
                                <Star className={`w-4 h-4 ${s <= editingRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                              </button>
                            ))}
                          </div>
                          <Input value={editingComment} onChange={e => setEditingComment(e.target.value)} className="h-7 text-xs" />
                          <div className="flex gap-1">
                            <Button size="sm" className="h-6 px-2 text-[10px]" onClick={() => handleSaveEditReview(r.id)}>บันทึก</Button>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => setEditingReviewId(null)}>ยกเลิก</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold">@{r.username}</span>
                              <span className="text-yellow-400 text-[10px]">{'★'.repeat(r.rating)}</span>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => { setEditingReviewId(r.id); setEditingRating(r.rating); setEditingComment(r.comment) }} className="text-[10px] text-amber-400 hover:text-amber-300 px-1">แก้</button>
                                <button onClick={() => deleteReview(r.id)} className="text-[10px] text-red-400 hover:text-red-300 px-1">ลบ</button>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.comment}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {productReviews.length > 3 && (
                  <button onClick={() => setShowAllReviews(v => !v)} className="text-xs text-primary hover:underline w-full text-center py-1">
                    {showAllReviews ? 'ดูน้อยลง' : `ดูทั้งหมด ${productReviews.length} รีวิว`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div>
              {hasDiscount && !isFree && (
                <div className="flex items-center gap-1.5">
                  <del className="text-sm text-muted-foreground">{formatMoney(product.price)}</del>
                  {isFlashSale && <span className="text-xs text-red-400 font-bold">(-{discountPercent}%)</span>}
                </div>
              )}
              {isFree
                ? <strong className="text-2xl text-emerald-400 font-bold">ฟรี!</strong>
                : <strong className="text-2xl text-primary font-bold">{formatMoney(price)}</strong>
              }
              {savings > 0 && !isFlashSale && !isFree && (
                <span className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-bold">
                  <Tag className="w-3 h-3" />ประหยัด {formatMoney(savings)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {alreadyOwned ? (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold">
                    <Check className="w-4 h-4" />
                    คุณมีสินค้านี้แล้ว
                  </div>
                  {(myDeliveryLink || product.download_url) && (
                    <Button
                      variant="outline"
                      className="gap-2 font-semibold border-primary/30"
                      onClick={() => window.open(myDeliveryLink || product.download_url, '_blank', 'noopener')}
                    >
                      <Eye className="w-4 h-4" />
                      เปิดลิงก์สินค้า
                    </Button>
                  )}
                </div>
              ) : isFree ? (
                <Button
                  className="gap-2 font-semibold shadow-lg shadow-emerald-500/30 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleClaimFreeModal}
                  disabled={isOutOfStock}
                >
                  <Gift className="w-4 h-4" />
                  {isOutOfStock ? 'หมดสต็อก' : 'รับฟรี!'}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className={`gap-2 font-semibold transition-all ${isAdding ? 'bg-emerald-500 border-emerald-500 text-white' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAdding || isOutOfStock}
                  >
                    {isAdding ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    {isAdding ? 'เพิ่มแล้ว' : isOutOfStock ? 'หมดสต็อก' : 'เพิ่มตะกร้า'}
                  </Button>
                  <Link href={`/checkout?product=${encodeURIComponent(product.id)}`}>
                    <Button className="gap-2 font-semibold shadow-lg shadow-primary/30" disabled={isOutOfStock}>
                      <Zap className="w-4 h-4" />ซื้อเลย
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Admin edit dialog — opened from inside modal */}
    {isAdmin && (
      <AdminProductEdit
        product={product}
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={updated => {
          updateProducts(products.map(p => p.id === updated.id ? updated : p))
          toast.success('บันทึกสินค้าแล้ว')
          setShowEdit(false)
        }}
      />
    )}
  </>
  )
}

// Admin quick-edit dialog — edit everything about a product inline
function AdminProductEdit({
  product,
  open,
  onClose,
  onSave,
}: {
  product: Product
  open: boolean
  onClose: () => void
  onSave: (p: Product) => void
}) {
  const [form, setForm] = useState<Product>(product)

  // reset form whenever the dialog opens or product data changes
  useEffect(() => { if (open) setForm(product) }, [product, open])

  const set = <K extends keyof Product>(key: K, val: Product[K]) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <Pencil className="w-4 h-4" />
            แก้ไขสินค้า (Admin)
          </DialogTitle>
          <DialogDescription className="sr-only">แก้ไขข้อมูลสินค้า</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-semibold">
              <Camera className="w-4 h-4 text-muted-foreground" />
              รูปภาพสินค้า
            </Label>
            <ImageInput
              value={form.image_url || ''}
              onChange={v => set('image_url', v)}
              placeholder="วาง URL หรือกด อัปโหลด เพื่อเลือกไฟล์จากเครื่อง"
              previewHeight="h-36"
            />
          </div>

          {/* Name + Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-semibold">ชื่อสินค้า</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">หมวดหมู่</Label>
              <Input value={form.category} onChange={e => set('category', e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Badge</Label>
              <Input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="ยอดนิยม, ใหม่, HOT…" className="h-9" />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">ราคาเต็ม (฿)</Label>
              <Input type="number" value={form.price} onChange={e => set('price', +e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">ราคาขาย (0 = ไม่ลด)</Label>
              <Input type="number" value={form.sale_price} onChange={e => set('sale_price', +e.target.value)} className="h-9" />
            </div>
          </div>

          {/* Social Proof */}
          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-2">
            <Label className="text-sm font-semibold text-yellow-400 flex items-center gap-1.5">
              ★ Social Proof (ว่าง = สุ่มอัตโนมัติ)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">ดาว (0-5)</Label>
                <Input
                  type="number" step="0.1" min="0" max="5"
                  value={form.rating ?? ''}
                  onChange={e => set('rating', e.target.value === '' ? undefined : +e.target.value)}
                  placeholder="4.8"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">ยอดดู</Label>
                <Input
                  type="number"
                  value={form.views ?? ''}
                  onChange={e => set('views', e.target.value === '' ? undefined : +e.target.value)}
                  placeholder="5,304"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">ขายแล้ว</Label>
                <Input
                  type="number"
                  value={form.sold ?? ''}
                  onChange={e => set('sold', e.target.value === '' ? undefined : +e.target.value)}
                  placeholder="171"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">รายละเอียดสั้น</Label>
            <Input value={form.short_description} onChange={e => set('short_description', e.target.value)} className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">รายละเอียดยาว</Label>
            <Textarea value={form.long_description} onChange={e => set('long_description', e.target.value)} rows={3} />
          </div>

          {/* Download URL */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-emerald-400">ลิงก์ส่งสินค้า (download_url)</Label>
            <Input value={form.download_url} onChange={e => set('download_url', e.target.value)} placeholder="https://drive.google.com/..." className="h-9 font-mono text-xs" />
          </div>

          {/* Stock */}
          <div className="space-y-1.5 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <Label className="text-sm font-semibold text-orange-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> จำนวนสินค้าคงเหลือ
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={form.stock_qty ?? ''}
                onChange={e => set('stock_qty', e.target.value === '' ? null : +e.target.value)}
                placeholder="ว่าง = ไม่จำกัด"
                className="h-9 flex-1"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[3, 5, 10, 20, 50].map(n => (
                <button key={n} type="button" onClick={() => set('stock_qty', n)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${form.stock_qty === n ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500 hover:text-white'}`}>
                  {n} ชิ้น
                </button>
              ))}
              <button type="button" onClick={() => set('stock_qty', null)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${form.stock_qty === null ? 'bg-secondary text-foreground border-border' : 'bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary'}`}>
                ∞ ไม่จำกัด
              </button>
            </div>
          </div>

          {/* Flash Sale */}
          <div className="space-y-1.5 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <Label className="text-sm font-semibold text-red-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Flash Sale
            </Label>
            {/* Special modes */}
            <div className="flex gap-1.5 flex-wrap mb-1">
              <button type="button"
                onClick={() => set('flash_sale_end', 'always')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${form.flash_sale_end === 'always' ? 'bg-red-500 text-white border-red-500' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white'}`}>
                ♾ 24/7 ตลอดเวลา
              </button>
              <button type="button"
                onClick={() => set('flash_sale_end', 'daily')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${form.flash_sale_end === 'daily' ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500 hover:text-white'}`}>
                🔄 รีเซ็ตทุกวัน
              </button>
            </div>
            {/* Time presets */}
            <div className="flex gap-1.5 flex-wrap mb-1.5">
              {[{ label: '1ชม.', h: 1 }, { label: '3ชม.', h: 3 }, { label: '6ชม.', h: 6 }, { label: '12ชม.', h: 12 }, { label: '24ชม.', h: 24 }].map(({ label, h }) => (
                <button key={h} type="button"
                  onClick={() => set('flash_sale_end', new Date(Date.now() + h * 3600000).toISOString())}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white transition-all">
                  +{label}
                </button>
              ))}
              <button type="button" onClick={() => set('flash_sale_end', undefined)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-secondary/50 text-muted-foreground border-border/50 hover:bg-destructive hover:text-white transition-all">
                ปิด
              </button>
            </div>
            {form.flash_sale_end === 'always' ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                <Zap className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-xs text-red-400 font-bold">เปิด Flash Sale ตลอด 24/7</span>
              </div>
            ) : form.flash_sale_end === 'daily' ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
                <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="text-xs text-orange-400 font-bold flex-1">รีเซ็ตทุกเที่ยงคืน</span>
              </div>
            ) : form.flash_sale_end && new Date(form.flash_sale_end) > new Date() ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                <Zap className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-xs text-red-400 font-bold flex-1">กำลัง Flash Sale อยู่</span>
                <FlashTimer ms={new Date(form.flash_sale_end).getTime() - Date.now()} size="sm" />
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground">ยังไม่ได้เปิด Flash Sale</p>
            )}
            {form.flash_sale_end !== 'always' && form.flash_sale_end !== 'daily' && (
              <Input
                type="datetime-local"
                value={form.flash_sale_end ? form.flash_sale_end.slice(0, 16) : ''}
                onChange={e => set('flash_sale_end', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                className="h-8 text-xs"
              />
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30">
            <Label className="text-sm font-semibold">เปิดขาย</Label>
            <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border/30">
            <Button onClick={() => onSave(form)} className="flex-1 gap-2 bg-amber-500 hover:bg-amber-600 text-white">
              <Save className="w-4 h-4" />
              บันทึก
            </Button>
            <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
