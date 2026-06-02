'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Package, Clock, CheckCircle, XCircle, Truck, Loader2, ExternalLink, Gift, Copy } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Order } from '@/lib/store-data'

const statusConfig = {
  pending: { label: 'รอตรวจสลิป', icon: Clock, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
  paid: { label: 'ชำระแล้ว', icon: CheckCircle, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  processing: { label: 'กำลังจัดส่ง', icon: Truck, color: 'text-primary bg-primary/10 border-primary/30' },
  delivered: { label: 'ส่งสินค้าแล้ว', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  cancelled: { label: 'ยกเลิก', icon: XCircle, color: 'text-muted-foreground bg-muted/10 border-border' },
}

const LAST_ORDER_KEY = 'nextthon.v1.lastOrderCode'

function TrackContent() {
  const searchParams = useSearchParams()
  const initialCode = searchParams.get('code') || ''

  const { orders, formatMoney, isLoaded, getProductById, currentMember } = useStore()
  const [query, setQuery] = useState(initialCode)
  const [results, setResults] = useState<Order[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback((q: string) => {
    const term = q.trim()
    if (!term) {
      setResults([])
      setSearched(false)
      return
    }

    localStorage.setItem(LAST_ORDER_KEY, term)

    // Only search by order_code to prevent leaking other users' orders
    const found = orders.filter(o =>
      o.order_code.toLowerCase().includes(term.toLowerCase())
    )

    setResults(found)
    setSearched(true)
  }, [orders])

  useEffect(() => {
    if (!isLoaded) return
    if (initialCode) {
      handleSearch(initialCode)
    } else {
      const saved = localStorage.getItem(LAST_ORDER_KEY)
      if (saved) {
        setQuery(saved)
        handleSearch(saved)
      }
    }
  }, [initialCode, isLoaded, handleSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="p-8 rounded-3xl border border-border bg-card/50 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3">
            <Search className="w-3.5 h-3.5" />
            TRACKING
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">ติดตามออเดอร์</h1>
          <p className="text-muted-foreground mb-6">ค้นหาด้วยเลขออเดอร์เพื่อดูสถานะและรับสินค้า</p>
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="กรอกเลขออเดอร์ เช่น PX2026..."
                className="pl-10"
              />
            </div>
            <Button type="submit">ค้นหา</Button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {searched && results.length === 0 && (
            <div className="p-8 rounded-3xl border border-border bg-card/50 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-bold mb-2">ไม่พบออเดอร์</h3>
              <p className="text-muted-foreground">ลองตรวจสอบเลขออเดอร์อีกครั้ง</p>
            </div>
          )}
          
          {results.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            const isDelivered = order.status === 'delivered'
            
            // Resolve delivery links: delivery_links array > delivery_link string > per-product download_url
            const rawLinks: string[] =
              order.delivery_links?.length
                ? order.delivery_links
                : order.delivery_link
                  ? [order.delivery_link]
                  : order.items.map(i => getProductById(i.id)?.download_url || '').filter(Boolean)
            // Name each link: if single link → product name, if multiple → number them
            const deliveryLinks = rawLinks.map((link, i) => {
              const total = rawLinks.length
              const productName = order.items[i]?.name || order.items[0]?.name || 'สินค้า'
              let name: string
              if (total === 1) {
                name = productName
              } else if (order.items.length >= total) {
                // Each link maps to a different product
                name = order.items[i]?.name || `ไฟล์ที่ ${i + 1}`
              } else {
                // Multiple links for same product — number them
                name = `📎 ไฟล์ ${i + 1} / ${total}`
              }
              return { name, link }
            })
            
            return (
              <div 
                key={order.id} 
                className={`p-6 rounded-3xl border bg-card/50 ${isDelivered ? 'border-emerald-500/30' : 'border-border'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <h3 className="text-xl font-bold font-mono">#{order.order_code}</h3>
                      <button
                        onClick={() => { navigator.clipboard.writeText(order.order_code); }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="คัดลอกเลขออเดอร์"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatMoney(order.total_amount)}</p>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-muted-foreground">
                    สินค้า: {order.items.map(i => i.name).join(', ')}
                  </p>
                  <p className="text-muted-foreground">
                    วันที่: {new Date(order.created_at).toLocaleString('th-TH')}
                  </p>
                </div>

                {/* Delivery Links - Show when order is delivered */}
                {isDelivered && deliveryLinks.length > 0 && (
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="w-5 h-5 text-emerald-500" />
                      <h4 className="font-bold text-emerald-400">รับสินค้าของคุณ</h4>
                    </div>
                    <div className="space-y-2">
                      {deliveryLinks.map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors group"
                        >
                          <span className="font-medium text-emerald-100">{item.name}</span>
                          <div className="flex items-center gap-2 text-emerald-400 group-hover:text-emerald-300">
                            <span className="text-sm">คลิกรับสินค้า</span>
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending message */}
                {order.status === 'pending' && (
                  <div className="p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 mt-4">
                    <p className="text-sm text-yellow-200">
                      กำลังรอแอดมินตรวจสอบสลิป เมื่อยืนยันแล้วจะได้รับลิงก์สินค้าที่นี่
                    </p>
                  </div>
                )}

                {/* Paid message */}
                {order.status === 'paid' && (
                  <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 mt-4">
                    <p className="text-sm text-blue-200">
                      ชำระเงินเรียบร้อยแล้ว กำลังเตรียมส่งสินค้า
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  )
}
