'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  Wand2,
  Package,
  Receipt,
  Users,
  LogOut,
  ExternalLink,
  Save,
  Lock,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Palette,
  MessageCircle,
  CreditCard,
  FileText,
  ToggleLeft,
  Shield,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Home,
  Store,
  Sparkles,
  Menu,
  Search,
  Download,
  Copy,
  Tag,
  TrendingUp,
  BarChart3,
  StickyNote,
  RefreshCw,
  Ban,
  History,
  Key,
  Phone,
  User,
  Gift,
  Type,
  Upload,
  ImageIcon,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { ImageInput } from '@/components/ui/image-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Product, Order, StoreSettings, PromoCode } from '@/lib/store-data'

// Dashboard Tab
function DashboardTab() {
  const { orders, products, members, formatMoney, updateOrder, refreshFromServer } = useStore()
  const [refreshing, setRefreshing] = useState(false)

  const activeOrders = orders.filter(o => o.status !== 'cancelled')
  // Revenue counts only confirmed (paid/delivered) orders, not unverified pending
  const confirmedOrders = orders.filter(o => o.status === 'paid' || o.status === 'delivered' || o.status === 'processing')
  const revenue = confirmedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length
  const todayRevenue = confirmedOrders
    .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.total_amount || 0), 0)

  // 7-day revenue chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toDateString()
    const dayRevenue = activeOrders
      .filter(o => new Date(o.created_at).toDateString() === dateStr)
      .reduce((sum, o) => sum + (o.total_amount || 0), 0)
    return {
      label: d.toLocaleDateString('th-TH', { weekday: 'short' }),
      value: dayRevenue,
    }
  })
  const maxRevenue = Math.max(...last7Days.map(d => d.value), 1)

  // Top products
  const productSales: Record<string, { name: string; count: number; revenue: number }> = {}
  activeOrders.forEach(o => {
    o.items.forEach(item => {
      if (!productSales[item.id]) productSales[item.id] = { name: item.name, count: 0, revenue: 0 }
      productSales[item.id].count += item.qty
      productSales[item.id].revenue += item.price * item.qty
    })
  })
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    paid: 'bg-blue-500',
    processing: 'bg-purple-500',
    delivered: 'bg-emerald-500',
    cancelled: 'bg-muted-foreground',
  }
  const statusLabels: Record<string, string> = {
    pending: 'รอตรวจสลิป', paid: 'ชำระแล้ว', processing: 'กำลังจัดส่ง',
    delivered: 'ส่งแล้ว', cancelled: 'ยกเลิก',
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">อัปเดตทุก 15 วินาที</p>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={refreshing}
          onClick={async () => {
            setRefreshing(true)
            await refreshFromServer()
            setRefreshing(false)
            toast.success('โหลดข้อมูลล่าสุดแล้ว')
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ออเดอร์ทั้งหมด', value: orders.length.toString(), color: 'text-foreground', bg: '' },
          { label: 'รอตรวจสลิป', value: pendingCount.toString(), color: 'text-yellow-500', bg: 'border-yellow-500/20' },
          { label: 'ยอดขายรวม', value: formatMoney(revenue), color: 'text-primary', bg: 'border-primary/20' },
          { label: 'วันนี้', value: formatMoney(todayRevenue), color: 'text-emerald-500', bg: 'border-emerald-500/20' },
        ].map((kpi, i) => (
          <div key={i} className={`p-5 rounded-2xl border bg-card/50 ${kpi.bg || 'border-border'}`}>
            <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 7-Day Revenue Chart */}
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">รายได้ 7 วันล่าสุด</h3>
          </div>
          <div className="flex items-end gap-2 h-40">
            {last7Days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex items-end" style={{ height: '120px' }}>
                  <div
                    className="w-full rounded-t-lg bg-primary/60 hover:bg-primary transition-all duration-300"
                    style={{ height: `${Math.max((day.value / maxRevenue) * 100, day.value > 0 ? 4 : 0)}%` }}
                    title={formatMoney(day.value)}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">สถานะออเดอร์</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(statusLabels).map(([status, label]) => {
              const count = orders.filter(o => o.status === status).length
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${statusColors[status]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">สินค้าขายดี</h3>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm font-medium truncate">{p.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{formatMoney(p.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{p.count} ชิ้น</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">ยังไม่มีข้อมูลการขาย</p>
          )}
        </div>

        {/* Recent Orders + Quick Actions */}
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">ออเดอร์ล่าสุด</h3>
            {pendingCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/30">
                {pendingCount} รอตรวจ
              </span>
            )}
          </div>
          {orders.length > 0 ? (
            <div className="space-y-2">
              {orders.slice(0, 6).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
                  <div>
                    <p className="font-medium text-sm">#{order.order_code}</p>
                    <p className="text-xs text-muted-foreground">@{order.customer_username || '-'} · {statusLabels[order.status] || order.status}</p>
                  </div>
                  <p className="font-bold text-primary text-sm">{formatMoney(order.total_amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">ยังไม่มีออเดอร์</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card/50 text-center">
          <p className="text-2xl font-bold">{products.filter(p => p.is_active).length}</p>
          <p className="text-xs text-muted-foreground mt-1">สินค้าเปิดขาย</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card/50 text-center">
          <p className="text-2xl font-bold">{members.length}</p>
          <p className="text-xs text-muted-foreground mt-1">สมาชิก</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card/50 text-center">
          <p className="text-2xl font-bold text-emerald-500">{deliveredCount}</p>
          <p className="text-xs text-muted-foreground mt-1">ส่งสำเร็จ</p>
        </div>
      </div>
    </div>
  )
}

// Slip lightbox modal
function SlipModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1 text-sm">
          <X className="w-5 h-5" /> ปิด
        </button>
        <img src={src} alt="Slip" className="w-full rounded-2xl border border-white/20 shadow-2xl object-contain max-h-[80vh]" />
        <a href={src} download="slip.jpg" className="mt-3 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
          <Download className="w-4 h-4" /> บันทึกสลิป
        </a>
      </div>
    </div>
  )
}

// Orders Tab with full management
function OrdersTab() {
  const { orders, updateOrder, deleteOrder, formatMoney, getProductById, refreshFromServer } = useStore()
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest'>('newest')
  const [deliveryLinks, setDeliveryLinks] = useState<Record<string, string[]>>({})
  const [editNotes, setEditNotes] = useState<Record<string, string>>({})
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [slipModal, setSlipModal] = useState<string | null>(null)
  const [verifyingSlip, setVerifyingSlip] = useState<string | null>(null)
  const [slipResults, setSlipResults] = useState<Record<string, { ok: boolean; verified?: boolean; provider?: string; amount?: number; sender?: string; receiver?: string; sendingBank?: string; transRef?: string; error?: string }>>({})

  const toggleExpand = (id: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleVerifySlip = async (orderId: string, slipData: string) => {
    setVerifyingSlip(orderId)
    try {
      const res = await fetch('/api/verify-slip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slip_data: slipData }),
      })
      const data = await res.json()
      setSlipResults(prev => ({ ...prev, [orderId]: data }))
      if (data.ok && data.verified) toast.success(`สลิปถูกต้อง ยอด ฿${data.amount}`)
      else toast.error(data.error || 'ตรวจสลิปไม่ผ่าน')
    } catch {
      toast.error('ไม่สามารถตรวจสลิปได้')
    } finally {
      setVerifyingSlip(null)
    }
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'รอตรวจสลิป', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
    paid: { label: 'ชำระแล้ว', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    processing: { label: 'กำลังจัดส่ง', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
    delivered: { label: 'ส่งสินค้าแล้ว', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
    cancelled: { label: 'ยกเลิก', color: 'bg-muted/50 text-muted-foreground border-border' }
  }

  const filteredOrders = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => {
      if (!search) return true
      const q = search.toLowerCase()
      return o.order_code.toLowerCase().includes(q) ||
        (o.customer_username || '').toLowerCase().includes(q) ||
        (o.customer_name || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'highest') return b.total_amount - a.total_amount
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const handleConfirmDelivery = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    const autoLinks = order.items
      .map(item => getProductById(item.id)?.download_url || '')
      .filter(Boolean)
    const links = (deliveryLinks[orderId] ?? (
      order.delivery_links?.length ? order.delivery_links
      : order.delivery_link ? [order.delivery_link]
      : autoLinks
    )).filter(Boolean)
    updateOrder(orderId, { status: 'delivered', delivery_links: links, delivery_link: links[0] || '' })
    toast.success('ยืนยันสลิปและส่งสินค้าแล้ว')
  }

  const handleRejectOrder = (orderId: string) => {
    if (!confirm('ยืนยันการปฏิเสธออเดอร์นี้?')) return
    updateOrder(orderId, { status: 'cancelled' })
    toast.success('ปฏิเสธออเดอร์แล้ว')
  }

  const handleSaveNote = (orderId: string) => {
    const note = editNotes[orderId]
    if (note === undefined) return
    updateOrder(orderId, { admin_note: note })
    setEditNotes(prev => { const n = { ...prev }; delete n[orderId]; return n })
    toast.success('บันทึกโน้ตแล้ว')
  }

  const exportCSV = () => {
    const rows = [
      ['Order Code', 'Customer', 'Status', 'Amount', 'Items', 'Date', 'Promo Code', 'Discount', 'Admin Note'],
      ...filteredOrders.map(o => [
        o.order_code,
        o.customer_username || o.customer_name || '-',
        o.status,
        o.total_amount,
        o.items.map(i => `${i.name} x${i.qty}`).join(' | '),
        new Date(o.created_at).toLocaleString('th-TH'),
        o.promo_code || '-',
        o.discount_amount || 0,
        o.admin_note || '-',
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast.success('ดาวน์โหลด CSV แล้ว')
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-card/50">
        <div className="flex flex-wrap gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            ทั้งหมด ({orders.length})
          </Button>
          {Object.entries(statusLabels).map(([value, { label }]) => {
            const count = orders.filter(o => o.status === value).length
            return (
              <Button key={value} variant={filter === value ? 'default' : 'outline'} size="sm" onClick={() => setFilter(value)}>
                {label} ({count})
              </Button>
            )
          })}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาเลขออเดอร์ หรือชื่อลูกค้า..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">ใหม่สุด</SelectItem>
              <SelectItem value="oldest">เก่าสุด</SelectItem>
              <SelectItem value="highest">ยอดสูงสุด</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={exportCSV} title="Export CSV">
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="โหลดออเดอร์ใหม่จาก Server"
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true)
              await refreshFromServer()
              setRefreshing(false)
              toast.success('โหลดออเดอร์ล่าสุดแล้ว')
            }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {slipModal && <SlipModal src={slipModal} onClose={() => setSlipModal(null)} />}

      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => {
          const status = statusLabels[order.status] || statusLabels.pending
          const isPending = order.status === 'pending'
          const isDelivered = order.status === 'delivered'
          const isCancelled = order.status === 'cancelled'
          const isExpanded = expandedOrders.has(order.id)
          const autoLinks = order.items.map(i => getProductById(i.id)?.download_url || '').filter(Boolean)
          const isEditingNote = editNotes[order.id] !== undefined
          const slipResult = slipResults[order.id]
          const timeAgo = (() => {
            const diff = Date.now() - new Date(order.created_at).getTime()
            if (diff < 60000) return 'เมื่อกี้'
            if (diff < 3600000) return `${Math.floor(diff / 60000)} นาทีที่แล้ว`
            if (diff < 86400000) return `${Math.floor(diff / 3600000)} ชม.ที่แล้ว`
            return new Date(order.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
          })()

          return (
            <div key={order.id} className={`rounded-2xl border bg-card/50 overflow-hidden transition-all ${isPending ? 'border-yellow-500/40' : isCancelled ? 'border-border/40 opacity-70' : 'border-border'}`}>
              {/* Collapsed header — always visible */}
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors text-left"
              >
                {/* Status dot */}
                <span className={`w-2 h-2 rounded-full shrink-0 ${isPending ? 'bg-yellow-500 animate-pulse' : isDelivered ? 'bg-emerald-500' : isCancelled ? 'bg-muted-foreground' : 'bg-blue-500'}`} />
                {/* Order code */}
                <span className="font-bold text-sm font-mono shrink-0">#{order.order_code}</span>
                {/* Status badge */}
                <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${status.color}`}>
                  {status.label}
                </span>
                {/* Customer */}
                <span className="text-xs text-muted-foreground truncate flex-1">@{order.customer_username || order.customer_name || '-'}</span>
                {/* Has slip indicator */}
                {order.slip_data && (
                  <span className="hidden sm:flex items-center gap-1 text-[10px] text-blue-400 border border-blue-500/30 rounded px-1.5 py-0.5 shrink-0">
                    <Eye className="w-2.5 h-2.5" /> สลิป
                  </span>
                )}
                {/* Amount */}
                <span className="font-bold text-primary text-sm shrink-0">{formatMoney(order.total_amount)}</span>
                {/* Time */}
                <span className="text-xs text-muted-foreground shrink-0 hidden md:block">{timeAgo}</span>
                {/* Expand icon */}
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/30 pt-4 space-y-3">
                  {/* Top row: status select + time */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Select value={order.status} onValueChange={value => updateOrder(order.id, { status: value as Order['status'] })}>
                      <SelectTrigger className="w-40 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => { navigator.clipboard.writeText(order.order_code); toast.success('คัดลอกแล้ว') }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <Copy className="w-3 h-3" /> คัดลอกเลขออเดอร์
                    </button>
                    {order.promo_code && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/30">
                        🏷 {order.promo_code} -{formatMoney(order.discount_amount || 0)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(order.created_at).toLocaleString('th-TH')}</span>
                  </div>

                  {/* Main grid: info + slip */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Left: customer info + items */}
                    <div className="space-y-2 text-sm">
                      {/* Customer */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/50 border border-border/50">
                        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">{order.customer_name || order.customer_username || '-'}</span>
                        {order.customer_username && order.customer_name && order.customer_name !== order.customer_username && (
                          <span className="text-xs text-muted-foreground">@{order.customer_username}</span>
                        )}
                      </div>
                      {/* Phone */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/50 border border-border/50">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {order.phone
                          ? <><span className="font-mono flex-1">{order.phone}</span><a href={`tel:${order.phone}`} className="text-xs text-primary hover:underline">โทร</a></>
                          : <span className="text-xs text-muted-foreground">ไม่มีเบอร์</span>
                        }
                      </div>
                      {/* LINE */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/50 border border-border/50">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {order.line_id
                          ? <><span className="font-mono flex-1">{order.line_id}</span>
                              <a href={`https://line.me/ti/p/${order.line_id.replace('@', '~')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline">ทัก</a>
                            </>
                          : <span className="text-xs text-muted-foreground">ไม่มี LINE ID</span>
                        }
                      </div>
                      {/* Items */}
                      <div className="p-2.5 rounded-xl bg-background/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">สินค้า ({order.items.length} รายการ)</p>
                        {order.items.map((item, i) => (
                          <p key={i} className="text-xs">{item.name} <span className="text-muted-foreground">×{item.qty}</span> <span className="text-primary font-bold">{formatMoney(item.price * item.qty)}</span></p>
                        ))}
                      </div>
                      {order.note && (
                        <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
                          หมายเหตุลูกค้า: {order.note}
                        </div>
                      )}
                    </div>

                    {/* Right: slip */}
                    {order.slip_data ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">สลิปโอนเงิน</p>
                        <button onClick={() => setSlipModal(order.slip_data)} className="block w-full group relative">
                          <img src={order.slip_data} alt="Slip" className="w-full rounded-xl border border-border object-contain max-h-48 group-hover:brightness-90 transition-all" />
                          <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <span className="flex items-center gap-1.5 text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full">
                              <Eye className="w-3.5 h-3.5" /> ดูเต็มจอ
                            </span>
                          </div>
                        </button>
                        {/* Slip verification */}
                        <button
                          onClick={() => handleVerifySlip(order.id, order.slip_data)}
                          disabled={verifyingSlip === order.id}
                          className="w-full py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {verifyingSlip === order.id
                            ? <><Loader2 className="w-3 h-3 animate-spin" /> กำลังตรวจ...</>
                            : <><Shield className="w-3 h-3" /> ตรวจสลิปอัตโนมัติ</>
                          }
                        </button>
                        {slipResult && (
                          <div className={`p-2.5 rounded-lg text-xs border ${slipResult.ok && slipResult.verified !== false ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                            {slipResult.ok && slipResult.verified !== false ? (
                              <span>
                                ✓ สลิปถูกต้อง
                                {slipResult.amount ? ` ฿${slipResult.amount.toLocaleString('th-TH')}` : ''}
                                {slipResult.sender ? ` · จาก ${slipResult.sender}` : ''}
                                {slipResult.sendingBank ? ` (${slipResult.sendingBank})` : ''}
                                {slipResult.receiver ? ` → ${slipResult.receiver}` : ''}
                                <span className="block opacity-50 mt-0.5">
                                  {slipResult.provider === 'tabscanner' ? 'via Tabscanner' : 'via EasySlip'}
                                  {slipResult.transRef ? ` · Ref: ${slipResult.transRef}` : ''}
                                </span>
                              </span>
                            ) : (
                              <>✗ {slipResult.error || 'ตรวจสลิปไม่ผ่าน'}</>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl border border-dashed border-border/50 bg-background/30 text-xs text-muted-foreground p-8">
                        ยังไม่มีสลิป
                      </div>
                    )}
                  </div>

                  {/* Delivery */}
                  {!isDelivered && !isCancelled && (() => {
                    const currentLinks: string[] = deliveryLinks[order.id] ?? (
                      order.delivery_links?.length ? order.delivery_links
                      : order.delivery_link ? [order.delivery_link]
                      : autoLinks.length ? autoLinks
                      : ['']
                    )
                    const setLinks = (links: string[]) =>
                      setDeliveryLinks(prev => ({ ...prev, [order.id]: links }))
                    return (
                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-emerald-400">ลิ้งส่งสินค้า ({currentLinks.filter(Boolean).length}/{Math.min(currentLinks.length, 10)} รายการ)</p>
                          {currentLinks.length < 10 && (
                            <button
                              type="button"
                              onClick={() => setLinks([...currentLinks, ''])}
                              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> เพิ่มลิ้ง
                            </button>
                          )}
                        </div>
                        {currentLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-1.5 items-center">
                            <span className="text-[10px] text-muted-foreground w-4 shrink-0 text-center">{idx + 1}</span>
                            <Input
                              placeholder={autoLinks[idx] || 'https://drive.google.com/...'}
                              value={link}
                              onChange={e => {
                                const next = [...currentLinks]
                                next[idx] = e.target.value
                                setLinks(next)
                              }}
                              className="flex-1 text-xs h-7"
                            />
                            {currentLinks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setLinks(currentLinks.filter((_, i) => i !== idx))}
                                className="text-muted-foreground hover:text-destructive shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <Button onClick={() => handleRejectOrder(order.id)} variant="outline" size="sm" className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10 text-xs h-8">
                            <X className="w-3 h-3" /> ปฏิเสธ
                          </Button>
                          <Button onClick={() => handleConfirmDelivery(order.id)} size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs h-8 flex-1">
                            <Check className="w-3 h-3" /> ยืนยันสลิป &amp; ส่งสินค้า
                          </Button>
                        </div>
                      </div>
                    )
                  })()}

                  {isDelivered && (order.delivery_links?.length || order.delivery_link) && (
                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1.5">
                      <p className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> ส่งสินค้าแล้ว</p>
                      {(order.delivery_links?.length ? order.delivery_links : [order.delivery_link]).filter(Boolean).map((lnk, i) => (
                        <a key={i} href={lnk} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-emerald-300 hover:text-emerald-200 hover:underline break-all">
                          <ExternalLink className="w-3 h-3 shrink-0" />{lnk}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Admin Note */}
                  <div className="p-2.5 rounded-xl border border-border bg-background/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><StickyNote className="w-3 h-3" /> โน้ตแอดมิน</span>
                      {!isEditingNote
                        ? <button onClick={() => setEditNotes(prev => ({ ...prev, [order.id]: order.admin_note || '' }))} className="text-xs text-primary hover:underline">แก้ไข</button>
                        : <div className="flex gap-2">
                            <button onClick={() => handleSaveNote(order.id)} className="text-xs text-emerald-500 hover:underline">บันทึก</button>
                            <button onClick={() => setEditNotes(prev => { const n = { ...prev }; delete n[order.id]; return n })} className="text-xs text-muted-foreground hover:underline">ยกเลิก</button>
                      </div>
                      }
                    </div>
                    {isEditingNote ? (
                      <Textarea value={editNotes[order.id]} onChange={e => setEditNotes(prev => ({ ...prev, [order.id]: e.target.value }))} rows={2} className="text-xs mt-1" placeholder="จดโน้ต..." />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">{order.admin_note || 'ยังไม่มีโน้ต'}</p>
                    )}
                  </div>

                  {/* Danger zone: delete order */}
                  <div className="flex justify-end pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7"
                      onClick={() => {
                        if (confirm(`ลบออเดอร์ #${order.order_code} ถาวร?`)) {
                          deleteOrder(order.id)
                          toast.success('ลบออเดอร์แล้ว')
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3" /> ลบออเดอร์
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })
      ) : (
        <div className="text-center py-16 rounded-2xl border border-border bg-card/50">
          <Receipt className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">ไม่พบออเดอร์</p>
        </div>
      )}
    </div>
  )
}

// Products Tab with full CRUD
function ProductsTab() {
  const { products, updateProducts, formatMoney } = useStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')

  const emptyProduct: Product = {
    id: '', sku: '', name: '', category: '', short_description: '', description: '',
    long_description: '', price: 0, sale_price: 0, badge: '', icon: '', image_url: '',
    delivery_note: 'แอดมินตรวจสลิปแล้วส่งสินค้า/ข้อมูลให้ตามช่องทางที่กรอก',
    download_url: '', is_active: true, sort_order: products.length + 1, stock_qty: null,
  }

  const handleSaveProduct = (product: Product) => {
    if (isCreating) {
      const newProduct = { ...product, id: `product-${Date.now()}-${Math.random().toString(36).slice(2)}` }
      updateProducts([...products, newProduct])
      toast.success('เพิ่มสินค้าสำเร็จ')
    } else {
      updateProducts(products.map(p => p.id === product.id ? product : p))
      toast.success('อัปเดตสินค้าสำเร็จ')
    }
    setEditingProduct(null); setIsCreating(false)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('ต้องการลบสินค้านี้?')) {
      updateProducts(products.filter(p => p.id !== id))
      toast.success('ลบสินค้าแล้ว')
    }
  }

  const toggleProduct = (id: string) => {
    updateProducts(products.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
  }

  const duplicateProduct = (product: Product) => {
    const dup: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: `${product.name} (copy)`,
      sku: `${product.sku}-COPY`,
      sort_order: products.length + 1,
    }
    updateProducts([...products, dup])
    toast.success('Duplicate สินค้าแล้ว')
  }

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/50 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ค้นหาสินค้า..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-muted-foreground text-sm">{products.length} สินค้า</p>
        <Button className="gap-2" onClick={() => { setEditingProduct(emptyProduct); setIsCreating(true) }}>
          <Plus className="w-4 h-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      {/* Product List */}
      {filtered.map(product => (
        <div key={product.id} className={`flex items-center justify-between gap-4 p-4 rounded-2xl border bg-card/50 transition-colors ${product.is_active ? 'border-border' : 'border-border/40 opacity-60'}`}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
              {product.image_url
                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                : <Package className="w-6 h-6 text-primary" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold truncate">{product.name}</h3>
                {!product.is_active && <span className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground shrink-0">ปิดขาย</span>}
                {product.stock_qty !== null && product.stock_qty !== undefined && (
                  <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${product.stock_qty > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                    สต็อก: {product.stock_qty}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{product.category} · {product.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <p className="font-bold text-primary hidden sm:block">{formatMoney(product.sale_price || product.price)}</p>
            <Button variant="ghost" size="icon" onClick={() => toggleProduct(product.id)} title={product.is_active ? 'ปิดขาย' : 'เปิดขาย'} className={product.is_active ? 'text-emerald-500' : 'text-muted-foreground'}>
              {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => duplicateProduct(product)} title="Duplicate">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setIsCreating(false) }}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Edit/Create Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => { setEditingProduct(null); setIsCreating(false) }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'เพิ่มสินค้าใหม่' : 'แก้ไขสินค้า'}</DialogTitle>
            <DialogDescription className="sr-only">
              {isCreating ? 'กรอกข้อมูลสินค้าที่ต้องการเพิ่ม' : 'แก้ไขข้อมูลสินค้า'}
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              product={editingProduct} 
              categories={categories}
              onSave={handleSaveProduct} 
              onCancel={() => { setEditingProduct(null); setIsCreating(false) }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Product Form Component
function ProductForm({ 
  product, 
  categories,
  onSave, 
  onCancel 
}: { 
  product: Product
  categories: string[]
  onSave: (product: Product) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(product)

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ชื่อสินค้า *</Label>
          <Input 
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>SKU</Label>
          <Input 
            value={form.sku}
            onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>หมวดหมู่</Label>
          <Input 
            value={form.category}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            list="categories"
          />
          <datalist id="categories">
            {categories.map(cat => <option key={cat} value={cat} />)}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input 
            value={form.badge}
            onChange={e => setForm(prev => ({ ...prev, badge: e.target.value }))}
            placeholder="เช่น ยอดนิยม, ใหม่, Hot"
          />
        </div>
        <div className="space-y-2">
          <Label>ราคาเต็ม *</Label>
          <Input 
            type="number"
            value={form.price}
            onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>ราคาขาย</Label>
          <Input 
            type="number"
            value={form.sale_price}
            onChange={e => setForm(prev => ({ ...prev, sale_price: Number(e.target.value) }))}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>รายละเอียดสั้น</Label>
          <Input 
            value={form.short_description}
            onChange={e => setForm(prev => ({ ...prev, short_description: e.target.value }))}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>รายละเอียดยาว</Label>
          <Textarea 
            value={form.long_description}
            onChange={e => setForm(prev => ({ ...prev, long_description: e.target.value }))}
            rows={3}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            รูปภาพปกสินค้า
            <span className="text-xs text-muted-foreground font-normal">— แนะนำ 800×800px (JPG/PNG ไม่เกิน 10MB)</span>
          </Label>
          <ImageInput
            value={form.image_url}
            onChange={v => setForm(prev => ({ ...prev, image_url: v }))}
            placeholder="วาง URL หรืออัปโหลดรูปจากเครื่อง"
            previewHeight="h-32"
          />
        </div>
        <div className="space-y-3 sm:col-span-2 p-4 rounded-xl border border-border/50 bg-secondary/20">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              รูปรายละเอียดสินค้า <span className="text-muted-foreground font-normal text-xs">(สูงสุด 5 รูป)</span>
            </Label>
            {(form.gallery_images?.length ?? 0) < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => setForm(prev => ({ ...prev, gallery_images: [...(prev.gallery_images ?? []), ''] }))}
              >
                <Plus className="w-3 h-3" />เพิ่มรูป
              </Button>
            )}
          </div>
          {(form.gallery_images?.length ?? 0) === 0 && (
            <p className="text-xs text-muted-foreground">ยังไม่มีรูปรายละเอียด กด "เพิ่มรูป" เพื่อเริ่มต้น</p>
          )}
          {(form.gallery_images ?? []).map((img, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">รูปที่ {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => setForm(prev => ({ ...prev, gallery_images: (prev.gallery_images ?? []).filter((_, j) => j !== i) }))}
                >
                  <Trash2 className="w-3 h-3 mr-1" />ลบ
                </Button>
              </div>
              <ImageInput
                value={img}
                onChange={v => setForm(prev => {
                  const g = [...(prev.gallery_images ?? [])]
                  g[i] = v
                  return { ...prev, gallery_images: g }
                })}
                placeholder="วาง URL หรืออัปโหลดรูปจากเครื่อง"
                previewHeight="h-28"
              />
            </div>
          ))}
        </div>
        <div className="space-y-2 sm:col-span-2 p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5">
          <Label className="text-emerald-400 font-bold flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            ลิงก์ส่งสินค้าอัตโนมัติ
          </Label>
          <Input
            value={form.download_url}
            onChange={e => setForm(prev => ({ ...prev, download_url: e.target.value }))}
            placeholder="https://drive.google.com/... หรือ Dropbox, OneDrive..."
            className="font-mono text-sm"
          />
          <p className="text-xs text-emerald-300/70">เมื่อแอดมินกด "ยืนยันสลิป" ลิงก์นี้จะส่งให้ลูกค้าทันทีโดยอัตโนมัติ</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>ข้อความส่งมอบ</Label>
          <Textarea 
            value={form.delivery_note}
            onChange={e => setForm(prev => ({ ...prev, delivery_note: e.target.value }))}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>ลำดับการแสดง</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={e => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <Label>สต็อก (ว่างเปล่า = ไม่จำกัด)</Label>
          <Input
            type="number"
            placeholder="ไม่จำกัด"
            value={form.stock_qty ?? ''}
            onChange={e => setForm(prev => ({ ...prev, stock_qty: e.target.value === '' ? null : Number(e.target.value) }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={form.is_active}
            onCheckedChange={checked => setForm(prev => ({ ...prev, is_active: checked }))}
          />
          <Label>เปิดขาย</Label>
        </div>

        {/* Stats & Flash Sale */}
        <div className="sm:col-span-2 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            สถิติสินค้า (แสดงบนการ์ด)
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">คะแนนรีวิว (0–5)</Label>
              <Input
                type="number"
                min={0} max={5} step={0.1}
                placeholder="เช่น 4.8"
                value={form.rating ?? ''}
                onChange={e => setForm(prev => ({ ...prev, rating: e.target.value === '' ? undefined : Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ยอดดู</Label>
              <Input
                type="number"
                min={0}
                placeholder="เช่น 1500"
                value={form.views ?? ''}
                onChange={e => setForm(prev => ({ ...prev, views: e.target.value === '' ? undefined : Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ขายแล้ว</Label>
              <Input
                type="number"
                min={0}
                placeholder="เช่น 230"
                value={form.sold ?? ''}
                onChange={e => setForm(prev => ({ ...prev, sold: e.target.value === '' ? undefined : Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Flash Sale หมดเวลา (ว่างเปล่า = ปิด)</Label>
            <Input
              type="datetime-local"
              value={form.flash_sale_end ? form.flash_sale_end.slice(0, 16) : ''}
              onChange={e => setForm(prev => ({ ...prev, flash_sale_end: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="gap-2">
          <Save className="w-4 h-4" />
          บันทึก
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>ยกเลิก</Button>
      </div>
    </form>
  )
}

// Members Tab
function MembersTab() {
  const { members, updateMembers, orders, updateOrder, deleteOrder, activeProducts, createOrder, formatMoney } = useStore()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<'edit' | 'give' | 'orders' | null>(null)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editOrderStatus, setEditOrderStatus] = useState<Order['status']>('pending')
  const [editOrderLink, setEditOrderLink] = useState('')
  const [editForm, setEditForm] = useState({
    username: '', display_name: '', role: 'member' as 'member' | 'admin',
    rank: '', note: '', password: '',
  })
  const [giveProductId, setGiveProductId] = useState('')
  const [giveNote, setGiveNote] = useState('')

  const openPanel = (member: import('@/lib/store-data').Member, panel: 'edit' | 'give' | 'orders') => {
    if (expandedId === member.id && activePanel === panel) {
      setExpandedId(null); setActivePanel(null); return
    }
    setExpandedId(member.id)
    setActivePanel(panel)
    if (panel === 'edit') {
      setEditForm({
        username: member.username,
        display_name: member.display_name || '',
        role: member.role,
        rank: member.rank || '',
        note: member.note || '',
        password: '',
      })
    }
    if (panel === 'give') { setGiveProductId(''); setGiveNote('') }
  }

  const saveEdit = async (memberId: string) => {
    if (!editForm.username.trim()) { toast.error('กรุณากรอก Username'); return }
    if (editForm.username.trim().length < 3) { toast.error('Username ต้องมีอย่างน้อย 3 ตัว'); return }
    if (members.find(m => m.id !== memberId && m.username.toLowerCase() === editForm.username.toLowerCase())) {
      toast.error('Username นี้ถูกใช้แล้ว'); return
    }
    const updates: Partial<import('@/lib/store-data').Member> = {
      username: editForm.username.trim(),
      display_name: editForm.display_name.trim(),
      role: editForm.role,
      rank: editForm.rank.trim(),
      note: editForm.note.trim(),
    }
    if (editForm.password) {
      if (editForm.password.length < 6) { toast.error('Password ต้องมีอย่างน้อย 6 ตัว'); return }
      updates.password_hash = await sha256Member(editForm.password)
    }
    updateMembers(members.map(m => m.id === memberId ? { ...m, ...updates } : m))
    setExpandedId(null); setActivePanel(null)
    toast.success('อัปเดตข้อมูลสมาชิกแล้ว')
  }

  const giveProduct = (member: import('@/lib/store-data').Member) => {
    if (!giveProductId) { toast.error('กรุณาเลือกสินค้า'); return }
    const product = activeProducts.find(p => p.id === giveProductId)
    if (!product) return
    createOrder({
      status: 'delivered',
      customer_name: member.display_name || member.username,
      customer_username: member.username,
      phone: '',
      line_id: '',
      note: giveNote || 'แอดมินมอบสินค้าให้',
      paid_amount: 0,
      paid_at: new Date().toISOString(),
      total_amount: 0,
      items: [{ id: product.id, sku: product.sku, name: product.name, category: product.category, price: 0, qty: 1, delivery_note: product.delivery_note }],
      slip_data: '',
      member_id: member.id,
      source: 'admin_gift',
      delivery_link: product.download_url || '',
      admin_note: `มอบโดยแอดมิน${giveNote ? ` — ${giveNote}` : ''}`,
      promo_code: '',
      discount_amount: 0,
    })
    setExpandedId(null); setActivePanel(null)
    toast.success(`ส่ง "${product.name}" ให้ @${member.username} แล้ว`)
  }

  const deleteMember = (id: string) => {
    if (confirm('ต้องการลบสมาชิกนี้?')) {
      updateMembers(members.filter(m => m.id !== id))
      toast.success('ลบสมาชิกแล้ว')
    }
  }

  const filtered = members.filter(m =>
    !search || m.username.toLowerCase().includes(search.toLowerCase()) ||
    (m.display_name || '').toLowerCase().includes(search.toLowerCase())
  )

  const getMemberOrders = (memberId: string) =>
    orders.filter(o => o.member_id === memberId || o.customer_username === members.find(m => m.id === memberId)?.username)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ค้นหาชื่อ / username..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <p className="text-muted-foreground text-sm shrink-0">{members.length} สมาชิก</p>
      </div>

      {filtered.length > 0 ? (
        filtered.map(member => {
          const memberOrders = getMemberOrders(member.id)
          const totalSpent = memberOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0)
          const isExpanded = expandedId === member.id

          return (
            <div key={member.id} className={`rounded-2xl border bg-card/50 overflow-hidden transition-colors ${isExpanded ? 'border-primary/40' : 'border-border'}`}>
              {/* Member Row */}
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-bold text-lg shrink-0 ${member.role === 'admin' ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted/50 border-border text-foreground'}`}>
                    {member.username[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">@{member.username}</span>
                      {member.display_name && <span className="text-sm text-muted-foreground">({member.display_name})</span>}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${member.role === 'admin' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/50 text-muted-foreground border-border'}`}>
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                      {member.rank && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {member.rank}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      สมัคร {new Date(member.created_at).toLocaleDateString('th-TH')} · {memberOrders.length} ออเดอร์ · {formatMoney(totalSpent)}
                    </p>
                    {member.note && <p className="text-xs text-amber-400/80 mt-0.5 truncate">📝 {member.note}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant={isExpanded && activePanel === 'orders' ? 'default' : 'ghost'} size="icon" title="ประวัติออเดอร์" onClick={() => openPanel(member, 'orders')}>
                    <History className="w-4 h-4" />
                  </Button>
                  <Button variant={isExpanded && activePanel === 'give' ? 'default' : 'ghost'} size="icon" title="ให้สินค้า" onClick={() => openPanel(member, 'give')}>
                    <Gift className="w-4 h-4" />
                  </Button>
                  <Button variant={isExpanded && activePanel === 'edit' ? 'default' : 'ghost'} size="icon" title="แก้ไขข้อมูล" onClick={() => openPanel(member, 'edit')}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteMember(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Edit Panel */}
              {isExpanded && activePanel === 'edit' && (
                <div className="px-4 pb-4 border-t border-border/50 pt-4 space-y-3 bg-primary/[0.03]">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">แก้ไขข้อมูลสมาชิก</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Username *</Label>
                      <Input value={editForm.username} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ชื่อแสดง (Display Name)</Label>
                      <Input value={editForm.display_name} onChange={e => setEditForm(p => ({ ...p, display_name: e.target.value }))} placeholder="ชื่อจริงหรือชื่อเล่น" className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Role</Label>
                      <Select value={editForm.role} onValueChange={v => setEditForm(p => ({ ...p, role: v as 'member' | 'admin' }))}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member"><span className="flex items-center gap-2"><User className="w-3.5 h-3.5" />Member</span></SelectItem>
                          <SelectItem value="admin"><span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" />Admin</span></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ยศ / Rank</Label>
                      <Input value={editForm.rank} onChange={e => setEditForm(p => ({ ...p, rank: e.target.value }))} placeholder="เช่น VIP, Gold, MVP..." className="h-9" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs">โน้ตแอดมิน</Label>
                      <Input value={editForm.note} onChange={e => setEditForm(p => ({ ...p, note: e.target.value }))} placeholder="บันทึกข้อมูลสำหรับแอดมิน" className="h-9" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs">Password ใหม่ <span className="text-muted-foreground font-normal">(ว่างไว้ = ไม่เปลี่ยน)</span></Label>
                      <Input type="password" value={editForm.password} onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))} placeholder="อย่างน้อย 6 ตัว" className="h-9" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="gap-1.5" onClick={() => saveEdit(member.id)}>
                      <Check className="w-3.5 h-3.5" /> บันทึก
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setExpandedId(null); setActivePanel(null) }}>ยกเลิก</Button>
                  </div>
                </div>
              )}

              {/* Give Product Panel */}
              {isExpanded && activePanel === 'give' && (
                <div className="px-4 pb-4 border-t border-border/50 pt-4 space-y-3 bg-emerald-500/[0.03]">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ให้สินค้าแก่ @{member.username}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs">เลือกสินค้า *</Label>
                      <Select value={giveProductId} onValueChange={setGiveProductId}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="-- เลือกสินค้า --" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeProducts.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              <span className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">[{p.category}]</span>
                                {p.name}
                                {p.download_url && <span className="text-[10px] text-emerald-500">● มีลิงก์</span>}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs">หมายเหตุ <span className="text-muted-foreground font-normal">(ไม่บังคับ)</span></Label>
                      <Input value={giveNote} onChange={e => setGiveNote(e.target.value)} placeholder="เช่น ของขวัญ, รางวัล, ชดเชย..." className="h-9" />
                    </div>
                  </div>
                  {giveProductId && (
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs space-y-1">
                      {(() => {
                        const p = activeProducts.find(x => x.id === giveProductId)
                        return p ? (
                          <>
                            <p className="font-semibold text-emerald-300">{p.name}</p>
                            {p.download_url
                              ? <p className="text-emerald-400">✓ ลิงก์จะถูกส่งให้ทันที: <span className="font-mono break-all">{p.download_url}</span></p>
                              : <p className="text-yellow-400">⚠ สินค้านี้ยังไม่มีลิงก์ download — สมาชิกจะเห็นออเดอร์แต่ไม่มีลิงก์</p>
                            }
                          </>
                        ) : null
                      })()}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => giveProduct(member)}>
                      <Gift className="w-3.5 h-3.5" /> ส่งสินค้า
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setExpandedId(null); setActivePanel(null) }}>ยกเลิก</Button>
                  </div>
                </div>
              )}

              {/* Order History Panel */}
              {isExpanded && activePanel === 'orders' && (
                <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ประวัติออเดอร์ ({memberOrders.length})</p>
                  {memberOrders.length > 0 ? memberOrders.map(o => {
                    const isEditingThis = editingOrderId === o.id
                    const statusColors: Record<string, string> = {
                      pending: 'text-yellow-500', paid: 'text-blue-500',
                      processing: 'text-purple-500', delivered: 'text-emerald-500', cancelled: 'text-muted-foreground'
                    }
                    const statusTH: Record<string, string> = {
                      pending: 'รอตรวจสลิป', paid: 'ชำระแล้ว',
                      processing: 'กำลังจัดส่ง', delivered: 'ส่งแล้ว', cancelled: 'ยกเลิก'
                    }
                    return (
                      <div key={o.id} className="rounded-xl border border-border bg-background/50 overflow-hidden">
                        {/* Row */}
                        <div className="flex items-center justify-between px-3 py-2.5 text-sm gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-mono font-bold text-xs">#{o.order_code}</p>
                            <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString('th-TH')} · <span className={statusColors[o.status]}>{statusTH[o.status]}</span>{o.source === 'admin_gift' ? ' · 🎁' : o.source === 'free_claim' ? ' · 🆓' : ''}</p>
                          </div>
                          <p className="font-bold text-primary text-xs shrink-0">{o.total_amount > 0 ? formatMoney(o.total_amount) : 'ฟรี'}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                if (isEditingThis) { setEditingOrderId(null); return }
                                setEditingOrderId(o.id)
                                setEditOrderStatus(o.status)
                                setEditOrderLink(o.delivery_link || '')
                              }}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isEditingThis ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                              title="แก้ไข"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`ลบออเดอร์ #${o.order_code}?`)) {
                                  deleteOrder(o.id)
                                  toast.success('ลบออเดอร์แล้ว')
                                }
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors"
                              title="ลบ"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {/* Inline edit */}
                        {isEditingThis && (
                          <div className="px-3 pb-3 pt-1 border-t border-border/40 space-y-2 bg-primary/[0.02]">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground font-medium">สถานะ</p>
                                <Select value={editOrderStatus} onValueChange={v => setEditOrderStatus(v as Order['status'])}>
                                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">รอตรวจสลิป</SelectItem>
                                    <SelectItem value="paid">ชำระแล้ว</SelectItem>
                                    <SelectItem value="processing">กำลังจัดส่ง</SelectItem>
                                    <SelectItem value="delivered">ส่งแล้ว</SelectItem>
                                    <SelectItem value="cancelled">ยกเลิก</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground font-medium">ลิงก์สินค้า</p>
                                <Input value={editOrderLink} onChange={e => setEditOrderLink(e.target.value)} placeholder="https://..." className="h-7 text-xs" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="h-7 text-xs gap-1 flex-1" onClick={() => {
                                updateOrder(o.id, { status: editOrderStatus, delivery_link: editOrderLink })
                                setEditingOrderId(null)
                                toast.success('อัปเดตออเดอร์แล้ว')
                              }}>
                                <Check className="w-3 h-3" /> บันทึก
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingOrderId(null)}>ยกเลิก</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }) : (
                    <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีออเดอร์</p>
                  )}
                </div>
              )}
            </div>
          )
        })
      ) : (
        <div className="text-center py-16 rounded-2xl border border-border bg-card/50">
          <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">ยังไม่มีสมาชิก</p>
        </div>
      )}
    </div>
  )
}

async function sha256Member(text: string): Promise<string> {
  if (typeof window !== 'undefined' && crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return btoa(unescape(encodeURIComponent(text))).split('').reverse().join('')
}

// Promo Codes Tab
function PromoCodesTab() {
  const { promoCodes, createPromoCode, updatePromoCode, deletePromoCode, formatMoney } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '', type: 'percent' as 'percent' | 'flat', value: 10,
    min_amount: 0, max_uses: 0, expires_at: '', is_active: true,
  })

  const handleCreate = () => {
    if (!form.code.trim()) { toast.error('กรุณากรอกโค้ด'); return }
    if (form.value <= 0) { toast.error('ส่วนลดต้องมากกว่า 0'); return }
    if (promoCodes.some(c => c.code.toUpperCase() === form.code.toUpperCase())) {
      toast.error('โค้ดนี้มีอยู่แล้ว'); return
    }
    createPromoCode({ ...form, code: form.code.toUpperCase() })
    setForm({ code: '', type: 'percent', value: 10, min_amount: 0, max_uses: 0, expires_at: '', is_active: true })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
        <div>
          <p className="font-medium">{promoCodes.length} โค้ดส่วนลด</p>
          <p className="text-xs text-muted-foreground">สร้างโค้ดสำหรับลูกค้า ลด % หรือลดราคาคงที่</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          สร้างโค้ด
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> สร้างโค้ดใหม่</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>โค้ด (ตัวพิมพ์ใหญ่อัตโนมัติ)</Label>
              <Input
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="เช่น DISCOUNT20"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>ประเภทส่วนลด</Label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as 'percent' | 'flat' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">% (เปอร์เซ็นต์)</SelectItem>
                  <SelectItem value="flat">฿ (ราคาคงที่)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ค่าส่วนลด {form.type === 'percent' ? '(%)' : '(฿)'}</Label>
              <Input
                type="number" min={1}
                value={form.value}
                onChange={e => setForm(p => ({ ...p, value: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>ยอดขั้นต่ำ (฿, 0 = ไม่กำหนด)</Label>
              <Input
                type="number" min={0}
                value={form.min_amount}
                onChange={e => setForm(p => ({ ...p, min_amount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>จำกัดการใช้ (0 = ไม่จำกัด)</Label>
              <Input
                type="number" min={0}
                value={form.max_uses}
                onChange={e => setForm(p => ({ ...p, max_uses: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>วันหมดอายุ (ว่าง = ไม่มี)</Label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreate} className="gap-2">
              <Check className="w-4 h-4" /> สร้างโค้ด
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>ยกเลิก</Button>
          </div>
        </div>
      )}

      {/* Code List */}
      {promoCodes.length > 0 ? (
        promoCodes.map(code => {
          const isExpired = code.expires_at && new Date(code.expires_at) < new Date()
          const isMaxed = code.max_uses > 0 && code.uses >= code.max_uses
          const isEffective = code.is_active && !isExpired && !isMaxed
          return (
            <div key={code.id} className={`p-5 rounded-2xl border bg-card/50 ${isEffective ? 'border-emerald-500/30' : 'border-border opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-mono font-black text-lg tracking-wider">{code.code}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${isEffective ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
                      {isExpired ? 'หมดอายุ' : isMaxed ? 'ใช้ครบแล้ว' : code.is_active ? 'ใช้งานได้' : 'ปิดใช้งาน'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    ลด {code.type === 'percent' ? `${code.value}%` : formatMoney(code.value)}
                    {code.min_amount > 0 && ` · ขั้นต่ำ ${formatMoney(code.min_amount)}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ใช้แล้ว {code.uses}/{code.max_uses > 0 ? code.max_uses : '∞'} ครั้ง
                    {code.expires_at && ` · หมดอายุ ${new Date(code.expires_at).toLocaleDateString('th-TH')}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={code.is_active}
                    onCheckedChange={v => updatePromoCode(code.id, { is_active: v })}
                  />
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => { navigator.clipboard.writeText(code.code); toast.success('คัดลอกโค้ดแล้ว') }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => { if (confirm('ลบโค้ดนี้?')) deletePromoCode(code.id) }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-16 rounded-2xl border border-border bg-card/50">
          <Tag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="font-semibold">ยังไม่มีโค้ดส่วนลด</p>
          <p className="text-sm text-muted-foreground mt-1">สร้างโค้ดเพื่อให้ลูกค้ากรอกตอนชำระเงิน</p>
        </div>
      )}
    </div>
  )
}

// Complete Settings Tab
function SettingsTab() {
  const { settings, updateSettings } = useStore()
  const [form, setForm] = useState<StoreSettings>(settings)
  const [activeSection, setActiveSection] = useState('brand')

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const handleSave = () => {
    updateSettings(form)
  }

  const sections = [
    { id: 'brand', label: 'Brand', icon: Sparkles },
    { id: 'icons', label: 'ไอคอน/รูป', icon: Package },
    { id: 'home', label: 'หน้าแรก', icon: Home },
    { id: 'store', label: 'ร้านค้า', icon: Store },
    { id: 'contact', label: 'ติดต่อ', icon: MessageCircle },
    { id: 'payment', label: 'ชำระเงิน', icon: CreditCard },
    { id: 'pages', label: 'หน้าอื่นๆ', icon: FileText },
    { id: 'stats', label: 'สถิติหน้าแรก', icon: TrendingUp },
    { id: 'visibility', label: 'การแสดงผล', icon: Eye },
    { id: 'slipApi', label: 'API สลิป', icon: Key },
    { id: 'security', label: 'ความปลอดภัย', icon: Shield },
  ]

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      {/* Settings Sidebar */}
      <div className="space-y-1 p-4 rounded-2xl border border-border bg-card/50 h-fit lg:sticky lg:top-4">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* Brand Settings */}
        {activeSection === 'brand' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Brand Settings
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อร้าน</Label>
                <Input 
                  value={form.brand.storeName}
                  onChange={e => setForm(prev => ({ ...prev, brand: { ...prev.brand, storeName: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input 
                  value={form.brand.tagline}
                  onChange={e => setForm(prev => ({ ...prev, brand: { ...prev.brand, tagline: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>โดเมน</Label>
                <Input 
                  value={form.brand.domain}
                  onChange={e => setForm(prev => ({ ...prev, brand: { ...prev.brand, domain: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Logo (ไอคอนมุมซ้ายบน) <span className="text-xs text-muted-foreground font-normal">— แนะนำ 160×160px หรือ 200×200px สี่เหลี่ยมจัตุรัส (PNG พื้นหลังโปร่งใส)</span></Label>
                <ImageInput
                  value={form.brand.logoUrl || ''}
                  onChange={v => setForm(prev => ({ ...prev, brand: { ...prev.brand, logoUrl: v } }))}
                  placeholder="URL หรืออัปโหลดโลโก้จากเครื่อง"
                  previewHeight="h-16"
                />
              </div>
            </div>
          </div>
        )}

        {/* Icons Settings */}
        {activeSection === 'icons' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              ตั้งค่าไอคอน/รูปภาพ
            </h3>
            <p className="text-sm text-muted-foreground mb-6">วาง URL หรือกด <strong>อัปโหลด</strong> เพื่อเลือกไฟล์จากเครื่อง</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Favicon <span className="text-xs text-muted-foreground font-normal">— 32×32px หรือ 64×64px (ICO/PNG)</span></Label>
                <ImageInput
                  value={form.brand.faviconUrl || ''}
                  onChange={v => setForm(prev => ({ ...prev, brand: { ...prev.brand, faviconUrl: v } }))}
                  placeholder="URL หรืออัปโหลด Favicon"
                  previewHeight="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>LINE Icon <span className="text-xs text-muted-foreground font-normal">— 64×64px (PNG/JPG)</span></Label>
                <ImageInput
                  value={form.icons?.lineIconUrl || ''}
                  onChange={v => setForm(prev => ({ ...prev, icons: { ...prev.icons, lineIconUrl: v } }))}
                  placeholder="URL หรืออัปโหลด LINE Icon"
                  previewHeight="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Cart Icon <span className="text-xs text-muted-foreground font-normal">— 64×64px (PNG โปร่งใส)</span></Label>
                <ImageInput
                  value={form.icons?.cartIconUrl || ''}
                  onChange={v => setForm(prev => ({ ...prev, icons: { ...prev.icons, cartIconUrl: v } }))}
                  placeholder="URL หรืออัปโหลด Cart Icon"
                  previewHeight="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Background <span className="text-xs text-muted-foreground font-normal">— 1920×1080px หรือ 1280×720px (JPG/PNG)</span></Label>
                <ImageInput
                  value={form.icons?.heroIconUrl || ''}
                  onChange={v => setForm(prev => ({ ...prev, icons: { ...prev.icons, heroIconUrl: v } }))}
                  placeholder="URL หรืออัปโหลด Hero Background"
                  previewHeight="h-20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Home Settings */}
        {activeSection === 'home' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              หน้าแรก
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kicker</Label>
                <Input 
                  value={form.home.kicker}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, kicker: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Welcome Text</Label>
                <Input 
                  value={form.home.welcome}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, welcome: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Hero Title (ใช้ {'{store}'} แทนชื่อร้าน)</Label>
                <Input 
                  value={form.home.heroTitle}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, heroTitle: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Hero Subtitle</Label>
                <Textarea 
                  value={form.home.heroSubtitle}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, heroSubtitle: e.target.value } }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>ปุ่มหลัก</Label>
                <Input 
                  value={form.home.primaryButton}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, primaryButton: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>ปุ่มรอง</Label>
                <Input 
                  value={form.home.secondaryButton}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, secondaryButton: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>ข้อความประกาศ</Label>
                <Textarea 
                  value={form.home.announcement}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, announcement: e.target.value } }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>หัวข้อหมวดหมู่</Label>
                <Input 
                  value={form.home.categoryTitle}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, categoryTitle: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>หัวข้อวิธีสั่งซื้อ</Label>
                <Input 
                  value={form.home.guideTitle}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, guideTitle: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>คำบรรยายวิธีสั่งซื้���</Label>
                <Input 
                  value={form.home.guideSubtitle}
                  onChange={e => setForm(prev => ({ ...prev, home: { ...prev.home, guideSubtitle: e.target.value } }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Store Settings */}
        {activeSection === 'store' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              หน้าร้านค้า
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>หัวข้อ</Label>
                <Input 
                  value={form.store.title}
                  onChange={e => setForm(prev => ({ ...prev, store: { ...prev.store, title: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>คำบรรยาย</Label>
                <Textarea 
                  value={form.store.subtitle}
                  onChange={e => setForm(prev => ({ ...prev, store: { ...prev.store, subtitle: e.target.value } }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Badges (คั่นด้วย , )</Label>
                <Input 
                  value={form.store.badges.join(', ')}
                  onChange={e => setForm(prev => ({ 
                    ...prev, 
                    store: { ...prev.store, badges: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } 
                  }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeSection === 'contact' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              ข้อมูลติดต่อ
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LINE ID</Label>
                <Input 
                  value={form.contact.lineId}
                  onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, lineId: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>LINE URL</Label>
                <Input 
                  value={form.contact.lineUrl}
                  onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, lineUrl: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>อีเมล</Label>
                <Input 
                  value={form.contact.email}
                  onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>เบอร์โทร</Label>
                <Input 
                  value={form.contact.phone}
                  onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>หัวข้อหน้าติดต่อ</Label>
                <Input 
                  value={form.contact.title}
                  onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, title: e.target.value } }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>คำนำหน้าติดต่อ</Label>
                <Textarea 
                  value={form.contact.lead}
                  onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, lead: e.target.value } }))}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeSection === 'payment' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              ช่องทางชำระเงิน
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ธนาคาร/วอลเล็ต</Label>
                <Input 
                  value={form.payment.bankName}
                  onChange={e => setForm(prev => ({ ...prev, payment: { ...prev.payment, bankName: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>ชื่อบัญชี</Label>
                <Input 
                  value={form.payment.accountName}
                  onChange={e => setForm(prev => ({ ...prev, payment: { ...prev.payment, accountName: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>เลขบัญชี</Label>
                <Input 
                  value={form.payment.accountNumber}
                  onChange={e => setForm(prev => ({ ...prev, payment: { ...prev.payment, accountNumber: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>QR Code พร้อมเพย์ / PromptPay <span className="text-xs text-muted-foreground font-normal">— 400×400px (JPG/PNG)</span></Label>
                <ImageInput
                  value={form.payment.qrImageUrl || ''}
                  onChange={v => setForm(prev => ({ ...prev, payment: { ...prev.payment, qrImageUrl: v } }))}
                  placeholder="URL หรืออัปโหลดรูป QR Code จากเครื่อง"
                  previewHeight="h-36"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>หมายเหตุชำระเงิน</Label>
                <Textarea
                  value={form.payment.note}
                  onChange={e => setForm(prev => ({ ...prev, payment: { ...prev.payment, note: e.target.value } }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="flex items-center gap-1.5">
                  <span className="text-indigo-400">🔔</span> Discord Webhook (แจ้งเตือนสลิปใหม่)
                </Label>
                <Input
                  value={form.payment.discordWebhook || ''}
                  onChange={e => setForm(prev => ({ ...prev, payment: { ...prev.payment, discordWebhook: e.target.value } }))}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">เมื่อลูกค้าส่งสลิป ระบบจะแจ้งเตือนไปที่ Discord channel นี้ พร้อมรูปสลิปและข้อมูลออเดอร์</p>
              </div>
            </div>
          </div>
        )}

        {/* Pages Settings */}
        {activeSection === 'pages' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              หน้าเพจอื่นๆ
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">เกี่ยวกับเรา</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>หัวข้อ</Label>
                    <Input 
                      value={form.pages.aboutTitle}
                      onChange={e => setForm(prev => ({ ...prev, pages: { ...prev.pages, aboutTitle: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>คำนำ</Label>
                    <Textarea 
                      value={form.pages.aboutLead}
                      onChange={e => setForm(prev => ({ ...prev, pages: { ...prev.pages, aboutLead: e.target.value } }))}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">นโยบายความเป็นส่วนตัว</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>หัวข้อ</Label>
                    <Input 
                      value={form.pages.privacyTitle}
                      onChange={e => setForm(prev => ({ ...prev, pages: { ...prev.pages, privacyTitle: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>คำนำ</Label>
                    <Textarea 
                      value={form.pages.privacyLead}
                      onChange={e => setForm(prev => ({ ...prev, pages: { ...prev.pages, privacyLead: e.target.value } }))}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">นโยบายคืนเงิน</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>หัวข้อ</Label>
                    <Input 
                      value={form.pages.refundTitle}
                      onChange={e => setForm(prev => ({ ...prev, pages: { ...prev.pages, refundTitle: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>คำนำ</Label>
                    <Textarea 
                      value={form.pages.refundLead}
                      onChange={e => setForm(prev => ({ ...prev, pages: { ...prev.pages, refundLead: e.target.value } }))}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Stats Settings */}
        {activeSection === 'stats' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              ตั้งค่าสถิติหน้าแรก
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              ตัวเลขฐานที่จะบวกเพิ่มกับจำนวนจริงในระบบ — เช่น ตั้ง 500 จะแสดง 500 + สมาชิกจริง
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  ฐานจำนวนสมาชิก
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.heroStats?.baseMembers ?? 0}
                  onChange={e => setForm(prev => ({ ...prev, heroStats: { ...prev.heroStats, baseMembers: Number(e.target.value) } }))}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">แสดงผล: {((form.heroStats?.baseMembers ?? 0)).toLocaleString('th-TH')} + สมาชิกจริง</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  ฐานจำนวนคำสั่งซื้อ
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.heroStats?.baseOrders ?? 0}
                  onChange={e => setForm(prev => ({ ...prev, heroStats: { ...prev.heroStats, baseOrders: Number(e.target.value) } }))}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">แสดงผล: {((form.heroStats?.baseOrders ?? 0)).toLocaleString('th-TH')} + ออเดอร์จริง</p>
              </div>
            </div>
          </div>
        )}

        {/* Visibility Settings */}
        {activeSection === 'visibility' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              การแสดงผล
            </h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'homeHero', label: 'Hero หน้าแรก' },
                  { key: 'homeAnnouncement', label: 'ประกาศหน้าแรก' },
                  { key: 'homeStats', label: 'สถิติหน้าแรก' },
                  { key: 'homeCategories', label: 'หมวดหมู่หน้าแรก' },
                  { key: 'homeGuide', label: 'วิธีสั่งซื้อหน้าแรก' },
                  { key: 'storeHero', label: 'Hero ร้านค้า' },
                  { key: 'storeToolbar', label: 'Toolbar ร้านค้า' },
                  { key: 'storeBadges', label: 'Badges ร้านค้า' },
                  { key: 'cartFab', label: 'ปุ่มตะกร้าลอย' },
                  { key: 'footerAdmin', label: 'ลิงก์ Admin ใน Footer' },
                  { key: 'footerPolicies', label: 'ลิงก์นโยบายใน Footer' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
                    <Label className="cursor-pointer">{item.label}</Label>
                    <Switch 
                      checked={form.visibility[item.key as keyof typeof form.visibility]}
                      onCheckedChange={checked => setForm(prev => ({ 
                        ...prev, 
                        visibility: { ...prev.visibility, [item.key]: checked } 
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slip API Settings */}
        {activeSection === 'slipApi' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API ตรวจสลิปอัตโนมัติ
            </h3>
            <p className="text-sm text-muted-foreground -mt-4">
              กรอก API Key อย่างน้อย 1 ตัว — ระบบจะลอง Tabscanner ก่อน แล้ว fallback ไป EasySlip
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">PRIMARY</span>
                  Tabscanner API Key
                </Label>
                <Input
                  type="password"
                  placeholder="ยJg2o62x... (จาก tabscanner.com)"
                  value={form.slipApi?.tabscannerKey || ''}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    slipApi: { ...prev.slipApi, tabscannerKey: e.target.value }
                  }))}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">สมัครที่ <a href="https://tabscanner.com" target="_blank" rel="noopener noreferrer" className="underline text-primary">tabscanner.com</a></p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">FALLBACK</span>
                  EasySlip API Key
                </Label>
                <Input
                  type="password"
                  placeholder="Bearer token จาก easyslip.com"
                  value={form.slipApi?.easyslipKey || ''}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    slipApi: { ...prev.slipApi, easyslipKey: e.target.value }
                  }))}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">สมัครที่ <a href="https://easyslip.com" target="_blank" rel="noopener noreferrer" className="underline text-primary">easyslip.com</a></p>
              </div>
            </div>
            <div className="pt-2 border-t border-border space-y-3">
              <p className="text-sm font-bold">ตัวเลือกการตรวจสอบ</p>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
                <div>
                  <p className="text-sm font-medium">ตรวจสลิปอัตโนมัติเมื่อลูกค้าสั่งซื้อ</p>
                  <p className="text-xs text-muted-foreground">เรียก API ทันทีที่ลูกค้ากดยืนยันออเดอร์</p>
                </div>
                <Switch
                  checked={form.slipApi?.autoVerify ?? false}
                  onCheckedChange={v => setForm(prev => ({
                    ...prev,
                    slipApi: { ...prev.slipApi, autoVerify: v }
                  }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                  <p className="text-sm font-medium text-red-400">ยกเลิกออเดอร์อัตโนมัติหากสลิปไม่ผ่าน</p>
                  <p className="text-xs text-muted-foreground">เปิดเมื่อต้องการให้ระบบ Reject สลิปปลอมทันที</p>
                </div>
                <Switch
                  checked={form.slipApi?.autoReject ?? false}
                  onCheckedChange={v => setForm(prev => ({
                    ...prev,
                    slipApi: { ...prev.slipApi, autoReject: v }
                  }))}
                />
              </div>
            </div>
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <p className="text-xs text-amber-400 font-bold mb-1">🔒 ความปลอดภัย</p>
              <p className="text-xs text-muted-foreground">
                API Key ถูกเก็บใน Redis (เข้ารหัสด้วย Upstash) ไม่ใช่ใน Source Code — แต่ถ้าต้องการ Security สูงสุด
                ให้ใส่ Key ใน Vercel Environment Variables แทน (ระบบจะใช้ Env Vars ก่อนเสมอ)
              </p>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeSection === 'security' && (
          <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              ความปลอดภัย
            </h3>
            {(form.security.adminPassword === 'index999+' || settings.security.adminPassword === 'index999+') && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10">
                <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-400 text-sm">⚠️ คุณยังใช้ Password เริ่มต้น!</p>
                  <p className="text-xs text-red-300/80 mt-1">
                    Password <span className="font-mono bg-red-500/20 px-1 rounded">index999+</span> เป็น Default Password ที่ทุกคนรู้ได้
                    — <strong>เปลี่ยนเดี๋ยวนี้</strong> เพื่อป้องกันคนอื่นเข้าถึงแผงแอดมิน
                  </p>
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Admin Username</Label>
                <Input
                  value={form.security.adminUsername}
                  onChange={e => setForm(prev => ({ ...prev, security: { ...prev.security, adminUsername: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Password</Label>
                <Input
                  type="password"
                  value={form.security.adminPassword}
                  onChange={e => setForm(prev => ({ ...prev, security: { ...prev.security, adminPassword: e.target.value } }))}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              เปลี่ยน Username/Password แล้วต้อง Logout และ Login ใหม่
            </p>
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="w-4 h-4" />
          บันทึกการตั้งค่าทั้งหมด
        </Button>
      </div>
    </div>
  )
}



// Home Page Editor Tab
function HomePageTab() {
  const { settings, updateSettings, products, updateProducts, activeProducts } = useStore()

  const [homeForm, setHomeForm] = useState({ ...settings.home })
  const [visibility, setVisibility] = useState({ ...settings.visibility })
  const [imgEditing, setImgEditing] = useState<string | null>(null)
  const [imgValue, setImgValue] = useState('')
  const [section, setSection] = useState<'content' | 'products' | 'guide' | 'visibility'>('content')

  useEffect(() => {
    setHomeForm({ ...settings.home })
    setVisibility({ ...settings.visibility })
  }, [settings])

  const saveContent = () => {
    updateSettings({ home: homeForm })
    toast.success('บันทึกเนื้อหาหน้าแรกแล้ว')
  }

  const featuredIds: string[] = homeForm.featuredProductIds || []

  const toggleFeatured = (id: string) => {
    const updated = featuredIds.includes(id)
      ? featuredIds.filter(f => f !== id)
      : [...featuredIds, id]
    setHomeForm(prev => ({ ...prev, featuredProductIds: updated }))
  }

  const moveFeatured = (id: string, dir: 'up' | 'down') => {
    const arr = [...featuredIds]
    const i = arr.indexOf(id)
    if (dir === 'up' && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
    if (dir === 'down' && i < arr.length - 1) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
    setHomeForm(prev => ({ ...prev, featuredProductIds: arr }))
  }

  const saveProductImage = (productId: string) => {
    const updated = products.map(p => p.id === productId ? { ...p, image_url: imgValue } : p)
    updateProducts(updated)
    setImgEditing(null)
    toast.success('บันทึกรูปภาพแล้ว')
  }

  const toggleVisibility = (key: keyof typeof visibility) => {
    const updated = { ...visibility, [key]: !visibility[key] }
    setVisibility(updated)
    updateSettings({ visibility: updated })
    toast.success(`${visibility[key] ? 'ซ่อน' : 'แสดง'}แล้ว`)
  }

  const updateGuideStep = (idx: number, field: 0 | 1 | 2, value: string) => {
    const steps = homeForm.guideSteps.map((s, i) => {
      if (i !== idx) return s
      const updated = [...s] as [string, string, string]
      updated[field] = value
      return updated
    })
    setHomeForm(prev => ({ ...prev, guideSteps: steps as [string, string, string][] }))
  }

  const sectionBtns = [
    { id: 'content', label: 'ข้อความ Hero', icon: Type },
    { id: 'products', label: 'สินค้าในหน้าแรก', icon: Package },
    { id: 'guide', label: 'ขั้นตอน', icon: FileText },
    { id: 'visibility', label: 'แสดง/ซ่อน', icon: Eye },
  ] as const

  return (
    <div className="space-y-6">
      {/* Section Nav */}
      <div className="flex flex-wrap gap-2">
        {sectionBtns.map(s => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                section === s.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Content: Hero Text */}
      {section === 'content' && (
        <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> ข้อความหน้าแรก
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Kicker Badge</Label>
              <Input
                value={homeForm.kicker}
                onChange={e => setHomeForm(p => ({ ...p, kicker: e.target.value }))}
                placeholder="Premium Digital Store"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Banner Image (ไม่บังคับ)</Label>
              <ImageInput
                value={homeForm.bannerImageUrl || ''}
                onChange={v => setHomeForm(p => ({ ...p, bannerImageUrl: v }))}
                placeholder="URL หรืออัปโหลดรูป Banner"
                previewHeight="h-16"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hero Title ({'{store}'} = ชื่อร้าน)</Label>
            <Input
              value={homeForm.heroTitle}
              onChange={e => setHomeForm(p => ({ ...p, heroTitle: e.target.value }))}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hero Subtitle</Label>
            <Textarea
              value={homeForm.heroSubtitle}
              onChange={e => setHomeForm(p => ({ ...p, heroSubtitle: e.target.value }))}
              className="text-sm min-h-[70px]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">ปุ่มหลัก</Label>
              <Input
                value={homeForm.primaryButton}
                onChange={e => setHomeForm(p => ({ ...p, primaryButton: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">ปุ่มรอง</Label>
              <Input
                value={homeForm.secondaryButton}
                onChange={e => setHomeForm(p => ({ ...p, secondaryButton: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">ข้อความประกาศ (วิ่งใต้ Hero)</Label>
            <Input
              value={homeForm.announcement}
              onChange={e => setHomeForm(p => ({ ...p, announcement: e.target.value }))}
              className="h-9 text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">หัวข้อหมวดหมู่</Label>
              <Input
                value={homeForm.categoryTitle}
                onChange={e => setHomeForm(p => ({ ...p, categoryTitle: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Welcome Text</Label>
              <Input
                value={homeForm.welcome}
                onChange={e => setHomeForm(p => ({ ...p, welcome: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <Button onClick={saveContent} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4" /> บันทึกข้อความ
          </Button>
        </div>
      )}

      {/* Featured Products */}
      {section === 'products' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-border bg-card/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> สินค้าในหน้าแรก
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {featuredIds.length === 0
                    ? 'แสดง 4 สินค้าแรกอัตโนมัติ — เลือกสินค้าด้านล่างเพื่อปักหมุด'
                    : `ปักหมุด ${featuredIds.length} สินค้า`}
                </p>
              </div>
              {featuredIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHomeForm(p => ({ ...p, featuredProductIds: [] }))}
                  className="text-xs"
                >
                  รีเซ็ต (อัตโนมัติ)
                </Button>
              )}
            </div>

            {/* Pinned order preview */}
            {featuredIds.length > 0 && (
              <div className="mb-4 p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-xs font-bold text-primary mb-2">ลำดับที่แสดงหน้าแรก</p>
                {featuredIds.map((id, idx) => {
                  const p = products.find(p => p.id === id)
                  if (!p) return null
                  return (
                    <div key={id} className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/50">
                      <span className="w-6 h-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveFeatured(id, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveFeatured(id, 'down')}
                          disabled={idx === featuredIds.length - 1}
                          className="p-1 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleFeatured(id)}
                          className="p-1 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Product grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeProducts.map(p => {
                const isPinned = featuredIds.includes(p.id)
                const isEditingImg = imgEditing === p.id
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-3 transition-all ${
                      isPinned
                        ? 'border-primary/50 bg-primary/5 shadow-sm shadow-primary/10'
                        : 'border-border/50 bg-card/50 hover:border-border'
                    }`}
                  >
                    {/* Image area */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3 group">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground/40">
                          <Package className="w-8 h-8" />
                          <span className="text-[10px]">ยังไม่มีรูป</span>
                        </div>
                      )}
                      {/* Edit image overlay */}
                      <button
                        onClick={() => { setImgEditing(p.id); setImgValue(p.image_url || '') }}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold"
                      >
                        <Pencil className="w-4 h-4" />
                        แก้รูป
                      </button>
                    </div>

                    {/* Image editor */}
                    {isEditingImg && (
                      <div className="mb-3 space-y-2">
                        <ImageInput
                          value={imgValue}
                          onChange={setImgValue}
                          placeholder="URL หรืออัปโหลดรูปจากเครื่อง"
                          previewHeight="h-20"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveProductImage(p.id)} className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-700">
                            <Save className="w-3 h-3 mr-1" /> บันทึกรูป
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setImgEditing(null)} className="h-7 text-xs">
                            ยกเลิก
                          </Button>
                        </div>
                      </div>
                    )}

                    <p className="text-sm font-semibold truncate mb-2">{p.name}</p>

                    <button
                      onClick={() => toggleFeatured(p.id)}
                      className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isPinned
                          ? 'border-primary/50 bg-primary text-primary-foreground hover:bg-primary/80'
                          : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {isPinned ? (
                        <><Check className="w-3.5 h-3.5" /> ปักหมุดแล้ว</>
                      ) : (
                        <><Plus className="w-3.5 h-3.5" /> ปักหมุดหน้าแรก</>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => { updateSettings({ home: homeForm }); toast.success('บันทึกการตั้งค่าสินค้าหน้าแรกแล้ว') }} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4" /> บันทึก
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Steps */}
      {section === 'guide' && (
        <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> ขั้นตอนวิธีสั่งซื้อ
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">หัวข้อ</Label>
              <Input
                value={homeForm.guideTitle}
                onChange={e => setHomeForm(p => ({ ...p, guideTitle: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">คำอธิบายใต้หัวข้อ</Label>
              <Input
                value={homeForm.guideSubtitle}
                onChange={e => setHomeForm(p => ({ ...p, guideSubtitle: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            {homeForm.guideSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-border/50 bg-secondary/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-primary">{step[0]}</span>
                  </div>
                  <div className="flex-1 grid sm:grid-cols-2 gap-2">
                    <Input
                      value={step[0]}
                      onChange={e => updateGuideStep(idx, 0, e.target.value)}
                      placeholder="หมายเลข (01)"
                      className="h-8 text-xs"
                    />
                    <Input
                      value={step[1]}
                      onChange={e => updateGuideStep(idx, 1, e.target.value)}
                      placeholder="ชื่อขั้นตอน"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
                <Textarea
                  value={step[2]}
                  onChange={e => updateGuideStep(idx, 2, e.target.value)}
                  placeholder="คำอธิบายขั้นตอน"
                  className="text-xs min-h-[50px]"
                />
              </div>
            ))}
          </div>

          <Button onClick={saveContent} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Save className="w-4 h-4" /> บันทึกขั้นตอน
          </Button>
        </div>
      )}

      {/* Visibility */}
      {section === 'visibility' && (
        <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-2">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-primary" /> แสดง/ซ่อนส่วนต่างๆ ของหน้าแรก
          </h3>
          {([
            ['homeHero', 'Hero Section', Home],
            ['homeAnnouncement', 'ข้อความประกาศวิ่ง', Sparkles],
            ['homeStats', 'สถิติ (ผู้ใช้/สินค้า/ออเดอร์)', TrendingUp],
            ['homeCategories', 'หมวดหมู่สินค้า', Tag],
            ['homeGuide', 'วิธีสั่งซื้อ', FileText],
          ] as const).map(([key, label, Icon]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                {visibility[key as keyof typeof visibility] ? (
                  <Eye className="w-4 h-4 text-emerald-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground/50" />
                )}
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className={`font-semibold text-sm ${!visibility[key as keyof typeof visibility] ? 'text-muted-foreground' : ''}`}>
                  {label}
                </span>
              </div>
              <Switch
                checked={!!visibility[key as keyof typeof visibility]}
                onCheckedChange={() => toggleVisibility(key as keyof typeof visibility)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Admin Page
export default function AdminPage() {
  const router = useRouter()
  const { settings, isAdmin, adminLogout, isLoaded, adminLogin } = useStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginForm.username.trim()) {
      toast.error('กรุณากรอก Username')
      return
    }
    
    if (!loginForm.password) {
      toast.error('กรุณากรอก Password')
      return
    }
    
    setLoginLoading(true)
    try {
      adminLogin(loginForm.username, loginForm.password)
    } finally {
      setLoginLoading(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'ภาพรวม', sublabel: 'ยอดขาย/สถิติ', icon: LayoutDashboard },
    { id: 'orders', label: 'ออเดอร์', sublabel: 'ตรวจสลิป/ส่งสินค้า', icon: Receipt },
    { id: 'products', label: 'สินค้า', sublabel: 'เพิ่ม/แก้ไข/ลบ', icon: Package },
    { id: 'home', label: 'หน้าแรก', sublabel: 'แก้ไขเนื้อหา/รูปภาพ', icon: Home },
    { id: 'members', label: 'สมาชิก', sublabel: 'จัดการลูกค้า', icon: Users },
    { id: 'promoCodes', label: 'โค้ดส่วนลด', sublabel: 'สร้าง/จัดการโค้ด', icon: Tag },
    { id: 'settings', label: 'ตั้งค่า', sublabel: 'Brand/ติดต่อ/ชำระ', icon: Settings },
  ]

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md p-8 rounded-3xl border border-border bg-card">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4">
            <Lock className="w-3.5 h-3.5" />
            ADMIN PANEL
          </div>
          <h1 className="text-3xl font-black mb-2">เข้าสู่ระบบแอดมิน</h1>
          <p className="text-muted-foreground mb-6">กรอก Username และ Password เพื่อเข้าหลังบ้าน</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={loginForm.username}
                onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="admin"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="ใส่ password"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'เข้าสู่ระบบ'}
            </Button>
          </form>
          
          <p className="text-sm text-muted-foreground text-center mt-6">
            <Link href="/" className="text-primary hover:underline">กลับหน้าหลัก</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">{settings.brand.storeName}</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-[73px] animate-fade-in">
          <div className="p-4 h-full overflow-auto">
            <nav className="space-y-2 mb-4">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted/50 border border-transparent active:scale-[0.98]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">{tab.label}</p>
                      <p className="text-sm text-muted-foreground">{tab.sublabel}</p>
                    </div>
                  </button>
                )
              })}
            </nav>

            <div className="space-y-2 pt-4 border-t border-border">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                  <ExternalLink className="w-5 h-5" />
                  ดูหน้าเว็บ
                </Button>
              </Link>
              <Button variant="destructive" className="w-full justify-start gap-2 h-12" onClick={() => { adminLogout(); setMobileMenuOpen(false) }}>
                <LogOut className="w-5 h-5" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen p-4 border-r border-border bg-card/50 overflow-auto">
        {/* Brand */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/50 mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border bg-primary/10 flex items-center justify-center">
            {settings.brand.logoUrl ? (
              <Image src={settings.brand.logoUrl} alt="Logo" fill className="object-cover" />
            ) : (
              <Sparkles className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <p className="font-bold">{settings.brand.storeName}</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Local Storage
        </span>

        {/* Tabs */}
        <nav className="space-y-2 mb-4">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover-scale ${
                  activeTab === tab.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{tab.label}</p>
                  <p className="text-xs text-muted-foreground">{tab.sublabel}</p>
                </div>
              </button>
            )
          })}
        </nav>

        <div className="space-y-2 pt-4 border-t border-border">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ExternalLink className="w-4 h-4" />
              ดูหน้าเว็บ
            </Button>
          </Link>
          <Button variant="destructive" className="w-full justify-start gap-2" onClick={adminLogout}>
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        <header className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-black">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            {tabs.find(t => t.id === activeTab)?.sublabel}
          </p>
        </header>

        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'home' && <HomePageTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'promoCodes' && <PromoCodesTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  )
}
