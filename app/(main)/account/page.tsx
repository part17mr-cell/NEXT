'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User, LogOut, Package, Clock, CheckCircle, XCircle, Truck, Key,
  Eye, EyeOff, ExternalLink, Gift, BarChart, ClipboardList, Download,
  Shield, Tag
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

async function sha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return btoa(unescape(encodeURIComponent(text))).split('').reverse().join('')
}

const statusConfig = {
  pending:    { label: 'รอตรวจสลิป',   icon: Clock,         color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  paid:       { label: 'ชำระแล้ว',      icon: CheckCircle,   color: 'text-blue-500',   bg: 'bg-blue-500/10 border-blue-500/20' },
  processing: { label: 'กำลังจัดส่ง',  icon: Truck,         color: 'text-primary',    bg: 'bg-primary/10 border-primary/20' },
  delivered:  { label: 'ส่งสินค้าแล้ว', icon: CheckCircle,   color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  cancelled:  { label: 'ยกเลิก',        icon: XCircle,       color: 'text-muted-foreground', bg: 'bg-secondary/40 border-border/40' },
}

type NavItem = 'overview' | 'orders' | 'files' | 'security' | 'coupons'

export default function AccountPage() {
  const { currentMember, orders, members, updateMembers, logout, formatMoney } = useStore()

  const [activeTab, setActiveTab] = useState<NavItem>('overview')
  const [oldPass, setOldPass]       = useState('')
  const [newPass, setNewPass]       = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showOld, setShowOld]       = useState(false)
  const [showNew, setShowNew]       = useState(false)
  const [changing, setChanging]     = useState(false)

  if (!currentMember) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="p-8 rounded-3xl border border-primary/20 bg-primary/5 text-center">
            <div className="text-6xl mb-4">😎</div>
            <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">เข้าสู่ระบบด้วย Username/Password เพื่อดูประวัติออเดอร์</p>
            <div className="flex justify-center gap-3">
              <Link href="/login"><Button>เข้าสู่ระบบ</Button></Link>
              <Link href="/register"><Button variant="outline">สมัครสมาชิก</Button></Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const memberOrders = orders
    .filter(o => o.member_id === currentMember.id || o.customer_username?.toLowerCase() === currentMember.username.toLowerCase())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const deliveredWithLinks = memberOrders.filter(o => o.status === 'delivered' && o.delivery_link)
  const pendingOrders      = memberOrders.filter(o => o.status === 'pending')
  const deliveredOrders    = memberOrders.filter(o => o.status === 'delivered')
  const totalSpent         = memberOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0)

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) { toast.error('กรอกข้อมูลให้ครบ'); return }
    if (newPass.length < 6)                   { toast.error('Password ใหม่ต้องมีอย่างน้อย 6 ตัว'); return }
    if (newPass !== confirmPass)               { toast.error('Password ใหม่ไม่ตรงกัน'); return }

    setChanging(true)
    try {
      const oldHash = await sha256(oldPass)
      if (oldHash !== currentMember.password_hash) {
        toast.error('Password เดิมไม่ถูกต้อง')
        return
      }
      const newHash = await sha256(newPass)
      updateMembers(members.map(m => m.id === currentMember.id ? { ...m, password_hash: newHash } : m))
      setOldPass(''); setNewPass(''); setConfirmPass('')
      toast.success('เปลี่ยน Password สำเร็จ')
    } finally {
      setChanging(false)
    }
  }

  const sidebarItems: { id: NavItem; label: string; icon: typeof BarChart }[] = [
    { id: 'overview', label: 'ภาพรวม', icon: BarChart },
    { id: 'orders', label: 'ประวัติออเดอร์', icon: ClipboardList },
    { id: 'files', label: 'ไฟล์ของฉัน', icon: Download },
    { id: 'security', label: 'ความปลอดภัย', icon: Shield },
    { id: 'coupons', label: 'คูปองของฉัน', icon: Tag },
  ]

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT SIDEBAR */}
          <div className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 p-5 rounded-2xl border border-border/60 bg-card/80 glass space-y-2">
              {/* Avatar + info */}
              <div className="text-center pb-5 border-b border-border/40 mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-3 text-3xl">
                  😎
                </div>
                <p className="font-bold text-base">@{currentMember.username}</p>
                {currentMember.rank && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {currentMember.rank}
                  </span>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  สมัครเมื่อ {new Date(currentMember.created_at).toLocaleDateString('th-TH')}
                </p>
              </div>

              {/* Nav items */}
              {sidebarItems.map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                )
              })}

              {/* Logout */}
              <div className="pt-2 border-t border-border/40 mt-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Overview */}
            {activeTab === 'overview' && (
              <>
                <div>
                  <h1 className="text-2xl font-black mb-1">ภาพรวมบัญชี</h1>
                  <p className="text-muted-foreground text-sm">สรุปข้อมูลและสถิติของคุณ</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'ออเดอร์ทั้งหมด', value: memberOrders.length, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                    { label: 'รอดำเนินการ', value: pendingOrders.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                    { label: 'สำเร็จ', value: deliveredOrders.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'ยอดใช้จ่าย', value: formatMoney(totalSpent), color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl border bg-card/60 text-center ${s.bg}`}>
                      <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    ออเดอร์ล่าสุด
                  </h3>
                  {memberOrders.length > 0 ? (
                    <div className="space-y-2">
                      {memberOrders.slice(0, 5).map(order => {
                        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                        const StatusIcon = status.icon
                        return (
                          <Link
                            key={order.id}
                            href={`/track?code=${encodeURIComponent(order.order_code)}`}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors hover:border-primary/50 ${status.bg}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <StatusIcon className={`w-4 h-4 shrink-0 ${status.color}`} />
                              <div className="min-w-0">
                                <p className="font-medium text-sm font-mono">#{order.order_code}</p>
                                <p className={`text-xs ${status.color}`}>{status.label}</p>
                              </div>
                            </div>
                            <p className="font-bold text-primary shrink-0 text-sm">
                              {order.total_amount > 0 ? formatMoney(order.total_amount) : 'ฟรี'}
                            </p>
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">ยังไม่มีออเดอร์</p>
                      <Link href="/store">
                        <Button variant="outline" size="sm" className="mt-3">ไปช้อปเลย</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Order History */}
            {activeTab === 'orders' && (
              <>
                <div>
                  <h1 className="text-2xl font-black mb-1">ประวัติออเดอร์</h1>
                  <p className="text-muted-foreground text-sm">ออเดอร์ทั้งหมดของคุณ ({memberOrders.length} รายการ)</p>
                </div>
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                  {memberOrders.length > 0 ? (
                    <div className="space-y-2 max-h-[600px] overflow-auto pr-1">
                      {memberOrders.map(order => {
                        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                        const StatusIcon = status.icon
                        return (
                          <Link
                            key={order.id}
                            href={`/track?code=${encodeURIComponent(order.order_code)}`}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors hover:border-primary/50 ${status.bg}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <StatusIcon className={`w-4 h-4 shrink-0 ${status.color}`} />
                              <div className="min-w-0">
                                <p className="font-medium text-sm font-mono">#{order.order_code}</p>
                                <p className={`text-xs ${status.color}`}>{status.label}</p>
                              </div>
                            </div>
                            <p className="font-bold text-primary shrink-0 text-sm">
                              {order.total_amount > 0 ? formatMoney(order.total_amount) : 'ฟรี'}
                            </p>
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p>ยังไม่มีออเดอร์</p>
                      <Link href="/store">
                        <Button variant="outline" size="sm" className="mt-3">ไปช้อปเลย</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* My Files */}
            {activeTab === 'files' && (
              <>
                <div>
                  <h1 className="text-2xl font-black mb-1">ไฟล์ของฉัน</h1>
                  <p className="text-muted-foreground text-sm">สินค้าดิจิทัลที่คุณได้รับ ({deliveredWithLinks.length} รายการ)</p>
                </div>
                {deliveredWithLinks.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {deliveredWithLinks.map(o => (
                      <a
                        key={o.id}
                        href={o.delivery_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-emerald-100 truncate">{o.items.map(i => i.name).join(', ')}</p>
                          <p className="text-[11px] text-emerald-400/70 font-mono">#{o.order_code}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0 group-hover:text-emerald-200 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl border border-border/50 bg-card/50 text-center text-muted-foreground">
                    <Gift className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>ยังไม่มีไฟล์สินค้า</p>
                    <p className="text-xs mt-1">ไฟล์จะปรากฏหลังออเดอร์ถูกจัดส่ง</p>
                  </div>
                )}
              </>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <>
                <div>
                  <h1 className="text-2xl font-black mb-1">ความปลอดภัย</h1>
                  <p className="text-muted-foreground text-sm">จัดการรหัสผ่านของคุณ</p>
                </div>
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50 max-w-md space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    เปลี่ยน Password
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Password เดิม</Label>
                      <div className="relative">
                        <Input
                          type={showOld ? 'text' : 'password'}
                          value={oldPass}
                          onChange={e => setOldPass(e.target.value)}
                          placeholder="ใส่ password ปัจจุบัน"
                          className="h-10 pr-9 bg-secondary/30"
                        />
                        <button type="button" onClick={() => setShowOld(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showOld ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Password ใหม่ (อย่างน้อย 6 ตัว)</Label>
                      <div className="relative">
                        <Input
                          type={showNew ? 'text' : 'password'}
                          value={newPass}
                          onChange={e => setNewPass(e.target.value)}
                          placeholder="ใส่ password ใหม่"
                          className="h-10 pr-9 bg-secondary/30"
                        />
                        <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ยืนยัน Password ใหม่</Label>
                      <Input
                        type="password"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        placeholder="ใส่อีกครั้ง"
                        className="h-10 bg-secondary/30"
                        onKeyDown={e => e.key === 'Enter' && handleChangePassword()}
                      />
                      {confirmPass && newPass !== confirmPass && (
                        <p className="text-[10px] text-destructive">Password ไม่ตรงกัน</p>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full gap-2"
                    onClick={handleChangePassword}
                    disabled={changing || !oldPass || !newPass || !confirmPass}
                  >
                    {changing ? 'กำลังบันทึก...' : 'เปลี่ยน Password'}
                  </Button>
                </div>
              </>
            )}

            {/* Coupons */}
            {activeTab === 'coupons' && (
              <>
                <div>
                  <h1 className="text-2xl font-black mb-1">คูปองของฉัน</h1>
                  <p className="text-muted-foreground text-sm">คูปองส่วนลดที่คุณมี</p>
                </div>
                <div className="p-12 rounded-2xl border border-border/50 bg-card/50 text-center text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>ยังไม่มีคูปอง</p>
                  <p className="text-xs mt-1">คูปองจะถูกส่งให้คุณเมื่อมีโปรโมชั่นพิเศษ</p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
