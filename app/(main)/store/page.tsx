'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, Search, ArrowLeft, Loader2, Sparkles, X, Grid3X3, LayoutGrid, Package, SlidersHorizontal, Check, User, Car, Boxes, Flame, Zap, Shield, Monitor, Gamepad2, MessageSquare, FileText, LayoutTemplate, GitBranch } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { ProductCard } from '@/components/store/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const catTabConfig: Record<string, { Icon: LucideIcon; active: string; dot: string }> = {
  // Content / AI business categories
  'Prompt':      { Icon: MessageSquare,  active: 'bg-violet-500 text-white border-violet-500',   dot: 'bg-violet-400' },
  'Script':      { Icon: FileText,       active: 'bg-blue-500 text-white border-blue-500',        dot: 'bg-blue-400' },
  'Template':    { Icon: LayoutTemplate, active: 'bg-emerald-500 text-white border-emerald-500',  dot: 'bg-emerald-400' },
  'Workflow':    { Icon: GitBranch,      active: 'bg-orange-500 text-white border-orange-500',    dot: 'bg-orange-400' },
  'Content Kit': { Icon: Package,        active: 'bg-pink-500 text-white border-pink-500',        dot: 'bg-pink-400' },
  // Legacy / gaming categories (kept for backward compatibility)
  'ACCOUNT':   { Icon: User,    active: 'bg-blue-500 text-white border-blue-500',      dot: 'bg-blue-400' },
  'FIVEM':     { Icon: Car,     active: 'bg-violet-500 text-white border-violet-500',   dot: 'bg-violet-400' },
  'ROBLOX':    { Icon: Boxes,   active: 'bg-red-500 text-white border-red-500',         dot: 'bg-red-400' },
  'FREE FIRE': { Icon: Flame,   active: 'bg-orange-500 text-white border-orange-500',   dot: 'bg-orange-400' },
  'SERVICE':   { Icon: Zap,     active: 'bg-emerald-500 text-white border-emerald-500', dot: 'bg-emerald-400' },
  'GAME':      { Icon: Gamepad2,active: 'bg-cyan-500 text-white border-cyan-500',       dot: 'bg-cyan-400' },
  'SCRIPT':    { Icon: Monitor, active: 'bg-pink-500 text-white border-pink-500',       dot: 'bg-pink-400' },
  'UNBAN':     { Icon: Shield,  active: 'bg-teal-500 text-white border-teal-500',       dot: 'bg-teal-400' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
}

function StoreContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  
  const { settings, activeProducts, categories, isLoaded } = useStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState('sort')

  // Sync category filter when URL ?category= param changes (e.g. clicking category links)
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all')
  }, [searchParams])
  const [gridSize, setGridSize] = useState<'small' | 'large'>('small')

  const filteredProducts = useMemo(() => {
    let list = [...activeProducts]
    
    if (search.trim()) {
      const term = search.toLowerCase()
      list = list.filter(p => 
        [p.name, p.sku, p.category, p.short_description].join(' ').toLowerCase().includes(term)
      )
    }
    
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category)
    }
    
    switch (sort) {
      case 'priceLow':
        list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
        break
      case 'priceHigh':
        list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name, 'th'))
        break
    }
    
    return list
  }, [activeProducts, search, category, sort])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  return (
    <section className="py-6 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {settings.visibility.storeHero && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Link href="/">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 hover:bg-primary/20 transition-colors cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    กลับหน้าแรก
                  </span>
                </Link>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </span>
                  {settings.store.title}
                  <span className="text-muted-foreground text-lg font-normal">({filteredProducts.length})</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">{settings.store.subtitle}</p>
              </div>
            </div>

            {/* Badges */}
            {settings.visibility.storeBadges && (
              <div className="flex flex-wrap gap-2 mt-5">
                {settings.store.badges.map(badge => (
                  <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/50 text-xs font-medium">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Toolbar */}
        {settings.visibility.storeToolbar && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-16 z-30 mb-6"
          >
            <div className="rounded-2xl border border-border bg-card/85 backdrop-blur-xl shadow-sm shadow-black/[0.04] p-2.5 sm:p-3 space-y-3">
              {/* Search + Sort + Grid row */}
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                  <Input
                    placeholder="ค้นหาสินค้าที่ต้องการ..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-secondary/50 border-transparent shadow-none focus-visible:bg-card focus-visible:border-primary/40 transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[120px] sm:w-[148px] h-11 rounded-xl bg-secondary/50 border-transparent shadow-none shrink-0 font-medium">
                    <SlidersHorizontal className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="เรียงตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sort">แนะนำ</SelectItem>
                    <SelectItem value="priceLow">ราคาต่ำ-สูง</SelectItem>
                    <SelectItem value="priceHigh">ราคาสูง-ต่ำ</SelectItem>
                    <SelectItem value="name">ชื่อสินค้า</SelectItem>
                  </SelectContent>
                </Select>

                {/* Grid Size Toggle — segmented control */}
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-secondary/50 shrink-0">
                  <button
                    onClick={() => setGridSize('small')}
                    aria-label="กริดเล็ก"
                    className={`p-2 rounded-lg transition-all ${gridSize === 'small' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridSize('large')}
                    aria-label="กริดใหญ่"
                    className={`p-2 rounded-lg transition-all ${gridSize === 'large' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Tab Pills */}
              <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
                {(['all', ...categories] as string[]).map(cat => {
                  const cfg = catTabConfig[cat]
                  const isActive = category === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                          : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {cat === 'all' ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          ทุกหมวด
                        </>
                      ) : cfg ? (
                        <>
                          <cfg.Icon className="w-3.5 h-3.5" />
                          {cat}
                        </>
                      ) : cat}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active search chip */}
            {search && (
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                  ค้นหา: {search}
                  <button onClick={() => setSearch('')} className="hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
                <button
                  onClick={() => { setSearch(''); setCategory('all'); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ล้างทั้งหมด
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div 
              key="products"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-4 sm:gap-5 ${
                gridSize === 'large' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold mb-2">ไม่พบสินค้า</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดู
              </p>
              <Button 
                variant="outline" 
                onClick={() => { setSearch(''); setCategory('all'); }}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                ล้างตัวกรอง
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            แสดง {filteredProducts.length} สินค้า
            {(search || category !== 'all') && ` จากทั้งหมด ${activeProducts.length} สินค้า`}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <StoreContent />
    </Suspense>
  )
}
