'use client'

import Link from 'next/link'
import { User, LogOut, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const statusConfig = {
  pending: { label: 'รอตรวจสลิป', icon: Clock, color: 'text-yellow-500' },
  paid: { label: 'ชำระแล้ว', icon: CheckCircle, color: 'text-blue-500' },
  processing: { label: 'กำลังจัดส่ง', icon: Truck, color: 'text-primary' },
  delivered: { label: 'ส่งสินค้าแล้ว', icon: CheckCircle, color: 'text-emerald-500' },
  cancelled: { label: 'ยกเลิก', icon: XCircle, color: 'text-muted-foreground' },
}

export default function AccountPage() {
  const { currentMember, orders, logout, formatMoney } = useStore()

  if (!currentMember) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="p-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 text-center">
            <User className="w-16 h-16 mx-auto text-yellow-500/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground mb-6">เข้าสู่ระบบด้วย Username/Password เพื่อดูประวัติออเดอร์</p>
            <div className="flex justify-center gap-3">
              <Link href="/login">
                <Button>เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">สมัครสมาชิก</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const memberOrders = orders.filter(o => 
    o.member_id === currentMember.id || 
    o.customer_username?.toLowerCase() === currentMember.username.toLowerCase()
  )

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3">
              <User className="w-3.5 h-3.5" />
              ACCOUNT
            </div>
            <h1 className="text-3xl font-black">@{currentMember.username}</h1>
            <p className="text-muted-foreground">บัญชีสมาชิกใช้ Username + Password เท่านั้น</p>
          </div>
          <Button variant="destructive" className="gap-2" onClick={logout}>
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Member Info */}
          <div className="p-6 rounded-3xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4">ข้อมูลสมาชิก</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={currentMember.username} readOnly />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 p-3 rounded-xl border border-border bg-background/50">
              ไม่มีช่องอีเมล และไม่มีข้อมูลส่วนตัวเกินจำเป็น
            </p>
          </div>

          {/* Order History */}
          <div className="p-6 rounded-3xl border border-border bg-card/50">
            <h3 className="font-bold text-lg mb-4">ประวัติออเดอร์</h3>
            {memberOrders.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-auto">
                {memberOrders.map(order => {
                  const status = statusConfig[order.status] || statusConfig.pending
                  return (
                    <Link 
                      key={order.id} 
                      href={`/track?code=${encodeURIComponent(order.order_code)}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50 hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">#{order.order_code}</p>
                        <p className={`text-xs ${status.color}`}>{status.label}</p>
                      </div>
                      <p className="font-bold text-primary">{formatMoney(order.total_amount)}</p>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ยังไม่มีออเดอร์</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
