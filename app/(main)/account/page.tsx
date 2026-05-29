'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, LogOut, Package, Clock, CheckCircle, XCircle, Truck, Key, Eye, EyeOff, ExternalLink, Gift } from 'lucide-react'
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
  pending:    { label: 'รอตรวจสลิป',   icon: Clock,         color: 'text-yellow-500' },
  paid:       { label: 'ชำระแล้ว',      icon: CheckCircle,   color: 'text-blue-500' },
  processing: { label: 'กำลังจัดส่ง',  icon: Truck,         color: 'text-primary' },
  delivered:  { label: 'ส่งสินค้าแล้ว', icon: CheckCircle,   color: 'text-emerald-500' },
  cancelled:  { label: 'ยกเลิก',        icon: XCircle,       color: 'text-muted-foreground' },
}

export default function AccountPage() {
  const { currentMember, orders, members, updateMembers, logout, formatMoney } = useStore()

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
          <div className="p-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 text-center">
            <User className="w-16 h-16 mx-auto text-yellow-500/50 mb-4" />
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

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3">
              <User className="w-3.5 h-3.5" />
              ACCOUNT
            </div>
            <h1 className="text-3xl font-black">@{currentMember.username}</h1>
            <p className="text-muted-foreground text-sm">
              สมัครเมื่อ {new Date(currentMember.created_at).toLocaleDateString('th-TH')}
              {currentMember.rank && <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">{currentMember.rank}</span>}
            </p>
          </div>
          <Button variant="destructive" className="gap-2 shrink-0" onClick={logout}>
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Member Info */}
          <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-4">
            <h3 className="font-bold text-lg">ข้อมูลสมาชิก</h3>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={currentMember.username} readOnly className="bg-secondary/30" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                <p className="text-2xl font-black text-primary">{memberOrders.length}</p>
                <p className="text-[10px] text-muted-foreground">ออเดอร์</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                <p className="text-2xl font-black text-emerald-400">{deliveredWithLinks.length}</p>
                <p className="text-[10px] text-muted-foreground">รับแล้ว</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/50">
                <p className="text-lg font-black text-amber-400">
                  {formatMoney(memberOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0))}
                </p>
                <p className="text-[10px] text-muted-foreground">ยอดรวม</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
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
                    className="h-9 pr-9 bg-secondary/30"
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
                    className="h-9 pr-9 bg-secondary/30"
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
                  className="h-9 bg-secondary/30"
                  onKeyDown={e => e.key === 'Enter' && handleChangePassword()}
                />
                {confirmPass && newPass !== confirmPass && (
                  <p className="text-[10px] text-destructive">Password ไม่ตรงกัน</p>
                )}
              </div>
            </div>
            <Button
              className="w-full gap-2 h-9 text-sm"
              onClick={handleChangePassword}
              disabled={changing || !oldPass || !newPass || !confirmPass}
            >
              {changing ? 'กำลังบันทึก...' : 'เปลี่ยน Password'}
            </Button>
          </div>
        </div>

        {/* My Products — delivered orders with links */}
        {deliveredWithLinks.length > 0 && (
          <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-400">
              <Gift className="w-5 h-5" />
              สินค้าของคุณ ({deliveredWithLinks.length} ออเดอร์)
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
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
          </div>
        )}

        {/* Order History */}
        <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-3">
          <h3 className="font-bold text-lg">ประวัติออเดอร์</h3>
          {memberOrders.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-auto pr-1">
              {memberOrders.map(order => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                const StatusIcon = status.icon
                return (
                  <Link
                    key={order.id}
                    href={`/track?code=${encodeURIComponent(order.order_code)}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background/50 hover:border-primary/50 transition-colors"
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
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>ยังไม่มีออเดอร์</p>
              <Link href="/store">
                <Button variant="outline" size="sm" className="mt-3">ไปช้อปเลย</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
