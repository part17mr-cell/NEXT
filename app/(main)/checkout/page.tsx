'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, Upload, Check, Loader2, Building, FileText, Image as ImageIcon, Tag, X, MessageCircle, Copy, ChevronRight, Package, LogIn, UserPlus } from 'lucide-react'

import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { CartItem, PromoCode } from '@/lib/store-data'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  
  const {
    settings,
    cart,
    orders,
    getProductById,
    currentMember,
    createOrder,
    updateOrder,
    clearCart,
    formatMoney,
    isLoaded,
    applyPromoCode,
    updatePromoCode,
  } = useStore()
  
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'passed' | 'failed'>('idle')
  const [success, setSuccess] = useState<string | null>(null)
  const [slipPreview, setSlipPreview] = useState<string | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ discount: number; promoCode: PromoCode } | null>(null)

  const [form, setForm] = useState({
    slip: null as File | null,
  })

  useEffect(() => {
    if (!isLoaded) return

    // If product ID is provided, use single product checkout
    if (productId) {
      const product = getProductById(productId)
      if (product) {
        setItems([{
          id: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: product.sale_price != null && product.sale_price >= 0 ? product.sale_price : product.price,
          qty: 1,
          delivery_note: product.delivery_note
        }])
      }
    } else {
      setItems(cart)
    }
  }, [productId, cart, getProductById, isLoaded])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discount = appliedPromo?.discount ?? 0
  const total = Math.max(subtotal - discount, 0)

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return
    const result = applyPromoCode(promoInput.trim(), subtotal)
    if (!result) {
      toast.error('โค้ดไม่ถูกต้อง หมดอายุ หรือใช้ครบแล้ว')
      return
    }
    setAppliedPromo(result)
    toast.success(`ใช้โค้ด ${result.promoCode.code} ลด ${formatMoney(result.discount)} แล้ว`)
  }

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาแนบรูปสลิป')
      return
    }
    
    setForm(prev => ({ ...prev, slip: file }))
    
    const reader = new FileReader()
    reader.onload = () => setSlipPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!items.length) {
      toast.error('ไม่มีสินค้าในออเดอร์')
      return
    }

    if (!form.slip) {
      toast.error('กรุณาแนบสลิป')
      return
    }

    // Block re-purchase: 1 product per person
    if (currentMember) {
      const alreadyOwned = items.filter(item =>
        orders.some(o =>
          o.status !== 'cancelled' &&
          (o.member_id === currentMember.id || o.customer_username === currentMember.username) &&
          o.items.some(i => i.id === item.id)
        )
      )
      if (alreadyOwned.length > 0) {
        toast.error(`คุณมีสินค้าเหล่านี้อยู่แล้ว: ${alreadyOwned.map(i => i.name).join(', ')}`)
        setLoading(false)
        return
      }
    }
    
    setLoading(true)
    
    try {
      // Convert slip to base64
      const slipData = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(form.slip!)
      })
      
      const order = createOrder({
        status: 'pending',
        customer_name: currentMember?.username || 'Guest',
        customer_username: currentMember?.username || 'Guest',
        phone: '',
        line_id: '',
        note: '',
        paid_amount: total,
        paid_at: new Date().toISOString(),
        total_amount: total,
        items,
        slip_data: slipData,
        member_id: currentMember?.id || '',
        source: 'web',
        delivery_link: '',
        admin_note: '',
        promo_code: appliedPromo?.promoCode.code || '',
        discount_amount: discount,
      })

      // Increment promo code usage
      if (appliedPromo) {
        updatePromoCode(appliedPromo.promoCode.id, { uses: appliedPromo.promoCode.uses + 1 })
      }

      // Auto-verify slip — server decides whether API keys are configured (503 = no keys)
      setVerifyStatus('verifying')
      try {
        const verifyRes = await fetch('/api/verify-slip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slip_data: slipData }),
        })
        if (verifyRes.status === 503) {
          // No API keys configured — skip silently
          setVerifyStatus('idle')
        } else {
          const verifyData = await verifyRes.json() as { ok: boolean; verified?: boolean; error?: string }
          if (verifyData.ok && verifyData.verified) {
            updateOrder(order.id, { status: 'paid' })
            setVerifyStatus('passed')
            toast.success('สลิปผ่านการตรวจสอบอัตโนมัติ!')
          } else {
            setVerifyStatus('failed')
            if (settings.slipApi?.autoReject) {
              updateOrder(order.id, { status: 'cancelled' })
              toast.error('ตรวจสลิปไม่ผ่าน — ออเดอร์ถูกยกเลิกอัตโนมัติ กรุณาติดต่อแอดมิน')
              setLoading(false)
              return
            }
          }
        }
      } catch {
        setVerifyStatus('idle')
      }

      // Send Discord webhook notification (fire-and-forget)
      const webhookUrl = settings.payment.discordWebhook
      if (webhookUrl) {
        try {
          const productList = items.map(i => `**${i.name}** x${i.qty} — ${formatMoney(i.price * i.qty)}`).join('\n')
          const embed = {
            title: `🧾 สลิปใหม่! ออเดอร์ #${order.order_code}`,
            color: 0xFF4500,
            fields: [
              { name: '📦 สินค้า', value: productList, inline: false },
              { name: '💰 ยอดชำระ', value: formatMoney(total), inline: true },
              { name: '👤 ผู้ซื้อ', value: currentMember?.username || 'Guest', inline: true },
              { name: '🔗 ยืนยันออเดอร์', value: `${window.location.origin}/admin`, inline: false },
            ],
            image: { url: 'attachment://slip.jpg' },
            timestamp: new Date().toISOString(),
            footer: { text: 'NEXT THON Store' },
          }
          const formData = new FormData()
          const slipBlob = await fetch(slipData).then(r => r.blob())
          formData.append('files[0]', slipBlob, 'slip.jpg')
          formData.append('payload_json', JSON.stringify({
            embeds: [embed],
            attachments: [{ id: 0, filename: 'slip.jpg' }],
          }))
          fetch(webhookUrl, { method: 'POST', body: formData }).catch(() => {})
        } catch {
          // webhook failure must not block order
        }
      }

      // Clear cart if using cart items
      if (!productId) {
        clearCart()
      }

      setSuccess(order.order_code)
      toast.success('ส่งออเดอร์สำเร็จ')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // ต้อง login ก่อนชำระเงิน
  if (!currentMember) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-sm mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <LogIn className="w-9 h-9 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black mb-2">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground text-sm">ต้องเข้าสู่ระบบก่อนทำการชำระเงิน เพื่อให้แอดมินส่งสินค้าได้ถูกต้อง</p>
          </div>
          <div className="grid gap-3">
            <Link href="/login?next=/checkout">
              <Button className="w-full gap-2 h-11 font-semibold">
                <LogIn className="w-4 h-4" />
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link href="/register?next=/checkout">
              <Button variant="outline" className="w-full gap-2 h-11 font-semibold">
                <UserPlus className="w-4 h-4" />
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (success) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Success Header */}
          <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black mb-1">ส่งออเดอร์สำเร็จ!</h2>
            <p className="text-muted-foreground text-sm">บันทึกเลขออเดอร์ไว้ติดตามสถานะ</p>
          </div>

          {/* Order Code Box */}
          <div className="p-6 rounded-3xl border border-border bg-card/50">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">เลขออเดอร์ของคุณ</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-black text-primary flex-1 font-mono">{success}</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(success)
                  toast.success('คัดลอกแล้ว!')
                }}
              >
                <Copy className="w-4 h-4" />
                คัดลอก
              </Button>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-3">
            <p className="text-sm font-bold mb-4">ขั้นตอนต่อไป</p>
            {[
              { step: '1', label: 'รอแอดมินตรวจสอบสลิป', sub: 'ปกติภายใน 5-30 นาที', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
              { step: '2', label: 'รับสินค้าในหน้าติดตาม', sub: 'แอดมินส่งลิงก์สินค้าให้ทันที', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
            ].map(s => (
              <div key={s.step} className={`flex items-center gap-3 p-3 rounded-2xl border ${s.color}`}>
                <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-black shrink-0">{s.step}</span>
                <div>
                  <p className="text-sm font-bold">{s.label}</p>
                  <p className="text-xs opacity-70">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href={`/track?code=${encodeURIComponent(success)}`} className="col-span-2">
              <Button className="w-full gap-2 h-12 text-base font-bold shadow-lg shadow-primary/20">
                <Package className="w-5 h-5" />
                ติดตามออเดอร์
              </Button>
            </Link>
            {settings.contact.lineUrl && (
              <a href={settings.contact.lineUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  <MessageCircle className="w-4 h-4" />
                  LINE แอดมิน
                </Button>
              </a>
            )}
            <Link href="/store">
              <Button variant="outline" className="w-full gap-2">
                ช้อปต่อ
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            CHECKOUT
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">ยืนยันออเดอร์</h1>
          <p className="text-muted-foreground">โอนเงินตามช่องทางด้านล่าง แล้วแนบสลิปเพื่อยืนยัน</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-16 border border-border rounded-2xl sm:rounded-3xl bg-card/50">
            <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold mb-2">ไม่มีสินค้าในออเดอร์</h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-4">เพิ่มสินค้าลงตะกร้าก่อนทำการสั่งซื้อ</p>
            <Link href="/store">
              <Button>ไปหน้าร้านค้า</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[380px_1fr] gap-4 sm:gap-6 items-stretch">
            {/* Sidebar - Moved to top/left and sticky */}
            <aside className="space-y-4 order-first">
              {/* Order Summary */}
              <div className="p-6 rounded-3xl border border-border bg-card/50">
                <h2 className="font-bold text-lg mb-4">สรุปคำสั่งซื้อ</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background/50">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.qty}</p>
                      </div>
                      <p className="font-bold text-primary shrink-0">{formatMoney(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
                {/* Promo Code */}
                <div className="pt-3 border-t border-border space-y-2">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-500">{appliedPromo.promoCode.code}</span>
                        <span className="text-sm text-emerald-400">-{formatMoney(discount)}</span>
                      </div>
                      <button onClick={() => setAppliedPromo(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="โค้ดส่วนลด"
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value.toUpperCase())}
                        className="font-mono text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo} className="shrink-0">
                        ใช้โค้ด
                      </Button>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border space-y-1.5">
                  {discount > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ราคาสินค้า</span>
                        <span>{formatMoney(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-emerald-500">
                        <span>ส่วนลด</span>
                        <span>-{formatMoney(discount)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-muted-foreground">รวมทั้งหมด</span>
                    <span className="text-2xl font-bold text-primary">{formatMoney(total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-6 rounded-3xl border border-border bg-card/50">
                <h2 className="font-bold text-lg mb-4">ช่องทางชำระเงิน</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/50">
                    <Building className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{settings.payment.bankName}</p>
                      <p className="text-xs text-muted-foreground">{settings.payment.accountName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/50">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium font-mono">{settings.payment.accountNumber}</p>
                      <p className="text-xs text-muted-foreground">เลขบัญชี</p>
                    </div>
                  </div>
                  {settings.payment.note && (
                    <p className="text-xs text-muted-foreground p-3 rounded-xl border border-border bg-background/50">
                      {settings.payment.note}
                    </p>
                  )}
                </div>
                {settings.payment.qrImageUrl && (
                  <img 
                    src={settings.payment.qrImageUrl} 
                    alt="QR Code" 
                    className="w-full h-auto rounded-2xl mt-4"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                )}
              </div>
            </aside>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border bg-card/50">
              <h2 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2 shrink-0">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                แนบหลักฐานการโอนเงิน
              </h2>

              <div className="flex flex-col flex-1 mb-6 space-y-2">
                <Label className="shrink-0">แนบสลิป *</Label>
                <div className="relative flex-1 min-h-[200px]">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipChange}
                    required
                    className="hidden"
                    id="slip-upload"
                  />
                  <label
                    htmlFor="slip-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors overflow-hidden"
                  >
                    {slipPreview ? (
                      <img
                        src={slipPreview}
                        alt="Slip preview"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                          <Upload className="w-7 h-7 text-muted-foreground/50" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">คลิกเพื่ออัปโหลดสลิป</p>
                          <p className="text-sm text-muted-foreground">รองรับไฟล์รูปภาพ JPG, PNG</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {slipPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 self-start"
                    onClick={() => {
                      setSlipPreview(null)
                      setForm(prev => ({ ...prev, slip: null }))
                    }}
                  >
                    เปลี่ยนรูป
                  </Button>
                )}
              </div>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                {loading && verifyStatus === 'verifying' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังตรวจสลิปอัตโนมัติ...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    ส่งสลิปเพื่อยืนยัน
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
