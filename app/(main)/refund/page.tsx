'use client'

import { RotateCcw } from 'lucide-react'
import { useStore } from '@/lib/store-context'

export default function RefundPage() {
  const { settings } = useStore()

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl border border-border bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4">
            <RotateCcw className="w-3.5 h-3.5" />
            REFUND
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{settings.pages.refundTitle}</h1>
          <p className="text-muted-foreground mb-8">{settings.pages.refundLead}</p>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-background/50">
              <h2 className="text-xl font-bold mb-2">เงื่อนไขการคืนเงิน</h2>
              <p className="text-muted-foreground">{settings.pages.refundLead}</p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-background/50">
              <h2 className="text-xl font-bold mb-2">ขั้นตอนการขอคืนเงิน</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>ติดต่อแอดมินพร้อมเลขออเดอร์</li>
                <li>แจ้งเหตุผลและหลักฐานประกอบ</li>
                <li>รอการตรวจสอบภายใน 24-48 ชั่วโมง</li>
                <li>รับเงินคืนตามช่องทางที่ตกลง</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
