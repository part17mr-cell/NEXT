'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag, HelpCircle, Users, Box, Package, Wallet,
  ArrowRight, Shield, Clock, Headphones, Sparkles, CheckCircle2,
  Truck, CreditCard, Star, Camera
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { EditableText, useEditMode } from '@/components/edit-mode'
import { ImageInput } from '@/components/ui/image-input'
import { toast } from 'sonner'

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
  const { settings, activeProducts, orders, members, categories, formatMoney, isAdmin, products, updateProducts } = useStore()
  const { isEditMode } = useEditMode()
  const [editingImgId, setEditingImgId] = useState<string | null>(null)
  const [imgValue, setImgValue] = useState('')

  const saveHeroImage = (productId: string) => {
    updateProducts(products.map(p => p.id === productId ? { ...p, image_url: imgValue } : p))
    toast.success('บันทึกรูปภาพแล้ว')
    setEditingImgId(null)
  }
  
  const minPrice = activeProducts.reduce((min, p) =>
    Math.min(min, p.sale_price || p.price), Infinity
  )

  const featuredIds = settings.home.featuredProductIds || []
  const heroProducts = featuredIds.length > 0
    ? featuredIds.map(id => activeProducts.find(p => p.id === id)).filter(Boolean) as typeof activeProducts
    : activeProducts.slice(0, 4)

  const features = [
    { icon: Shield, label: 'ปลอดภัย 100%', color: 'text-emerald-500' },
    { icon: Truck, label: 'ส่งทันที', color: 'text-blue-500' },
    { icon: Headphones, label: '24/7 Support', color: 'text-amber-500' },
  ]

  const trustBadges = [
    { icon: CheckCircle2, label: 'ยืนยันตัวตน' },
    { icon: CreditCard, label: 'ชำระเงินปลอดภัย' },
    { icon: Star, label: 'รีวิว 5 ดาว' },
  ]

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Kicker Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <EditableText 
                fieldPath="home.kicker" 
                value={settings.home.kicker}
                className="inline"
              />
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            {isEditMode ? (
              <EditableText
                fieldPath="home.heroTitle"
                value={settings.home.heroTitle}
                as="span"
                className="block"
              />
            ) : (
              <>
                <span className="block text-foreground">{settings.home.heroTitle.split('{store}')[0]}</span>
                <span className="bg-gradient-to-r from-primary via-violet-400 to-blue-400 bg-clip-text text-transparent">{settings.brand.storeName}</span>
                <span className="text-foreground">{settings.home.heroTitle.split('{store}')[1]}</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            <EditableText 
              fieldPath="home.heroSubtitle" 
              value={settings.home.heroSubtitle}
              as="span"
              multiline
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-10">
            <Link href="/store">
              <Button size="lg" className="gap-2 font-bold text-base h-14 px-8 shadow-xl shadow-primary/30 group">
                <ShoppingBag className="w-5 h-5" />
                {settings.home.primaryButton}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#guide">
              <Button size="lg" variant="outline" className="gap-2 font-bold text-base h-14 px-8">
                <HelpCircle className="w-5 h-5" />
                {settings.home.secondaryButton}
              </Button>
            </Link>
          </motion.div>

          {/* Features Row */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="font-bold text-sm">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Product Preview Grid */}
          <motion.div
            variants={itemVariants}
            className="relative mb-12"
          >
            <div className={`grid gap-3 sm:gap-4 ${
              heroProducts.length === 1
                ? 'grid-cols-1 max-w-[260px] mx-auto'
                : heroProducts.length === 2
                ? 'grid-cols-2 max-w-lg mx-auto'
                : heroProducts.length === 3
                ? 'grid-cols-3 max-w-2xl mx-auto'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}>
              {heroProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <Link href="/store" className="block absolute inset-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center gap-1">
                          <Package className="w-10 h-10 text-primary/40" />
                          <span className="text-[10px] text-primary/60 font-bold">400 × 400 px</span>
                          <span className="text-[9px] text-muted-foreground/40">รูปหน้าแรก (1:1)</span>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Price Badge */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground truncate">{product.name}</span>
                          <span className="text-sm font-bold text-primary ml-2 shrink-0">{formatMoney(product.sale_price || product.price)}</span>
                        </div>
                      </div>
                      {/* Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold shadow-lg">
                          {product.badge || 'HOT'}
                        </span>
                      </div>
                    </Link>

                    {/* Admin: edit image button */}
                    {isAdmin && (
                      <button
                        onClick={e => {
                          e.preventDefault()
                          e.stopPropagation()
                          setEditingImgId(product.id)
                          setImgValue(product.image_url || '')
                        }}
                        className="absolute top-2 right-2 z-20 w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-600"
                        title="แก้รูป (Admin)"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Admin inline image editor */}
                  {isAdmin && editingImgId === product.id && (
                    <div className="absolute inset-x-0 top-full mt-2 z-30 p-3 rounded-2xl bg-card border border-amber-500/40 shadow-xl space-y-2">
                      <p className="text-xs font-bold text-amber-400 mb-1">แก้รูป: {product.name}</p>
                      <ImageInput
                        value={imgValue}
                        onChange={setImgValue}
                        placeholder="URL หรืออัปโหลดรูปจากเครื่อง"
                        previewHeight="h-20"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveHeroImage(product.id)} className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700">
                          บันทึก
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingImgId(null)} className="h-8 text-xs">
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="mt-6 text-center">
              <Link href="/store">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                  ดูสินค้าทั้งหมด ({activeProducts.length} รายการ)
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <badge.icon className="w-4 h-4 text-emerald-500" />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Category Tags */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <Link 
                key={cat} 
                href={`/store?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2 rounded-xl bg-secondary/80 border border-border/50 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
              >
                {cat}
              </Link>
            ))}
          </motion.div>
        </motion.div>

        {/* Announcement */}
        {settings.visibility.homeAnnouncement && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                INFO
              </div>
              <div className="overflow-hidden flex-1">
                <div className="animate-marquee whitespace-nowrap text-foreground font-medium text-sm">
                  {settings.home.announcement} &nbsp;&bull;&nbsp; {settings.home.announcement} &nbsp;&bull;&nbsp;
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {settings.visibility.homeStats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: 'สมาชิก', value: members.length.toLocaleString('th-TH'), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', glow: '' },
              { label: 'สินค้า', value: activeProducts.length.toString(), icon: Box, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', glow: '' },
              { label: 'คำสั่งซื้อ', value: orders.length.toLocaleString('th-TH'), icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', glow: '' },
              { label: 'เริ่มต้นเพียง', value: minPrice === Infinity ? '฿0' : formatMoney(minPrice), icon: Wallet, color: 'text-primary', bg: 'bg-primary/10 border-primary/30', glow: 'shadow-lg shadow-primary/15', highlight: true },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                whileHover={{ scale: 1.03, y: -3 }}
                className={`relative flex items-center gap-4 p-5 rounded-2xl border bg-card/80 overflow-hidden transition-all duration-300 backdrop-blur-sm ${stat.bg} ${stat.glow}`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
