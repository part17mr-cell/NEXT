'use client'

import { Shield } from 'lucide-react'
import { useStore } from '@/lib/store-context'

export default function PrivacyPage() {
  const { settings } = useStore()

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl border border-border bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4">
            <Shield className="w-3.5 h-3.5" />
            PRIVACY
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{settings.pages.privacyTitle}</h1>
          <p className="text-muted-foreground mb-8">{settings.pages.privacyLead}</p>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-background/50">
              <h2 className="text-xl font-bold mb-2">การเก็บข้อมูล</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>เก็บเฉพาะ Username และรหัสผ่านที่เข้ารหัสแล้ว</li>
                <li>ไม่มีการเก็บอีเมล หมายเลขโทรศัพท์ หรือข้อมูลส่วนตัวเกิน</li>
                <li>ข้อมูลออเดอร์ถูกบันทึกเพื่อการส่งมอบสินค้าเท่านั้น</li>
                <li>ไม่มีการแชร์ข้อมูลกับบุคคลที่สาม</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-background/50">
              <h2 className="text-xl font-bold mb-2">วัตถุประสงค์</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>ยืนยันตัวตนและออเดอร์</li>
                <li>ตรวจสอบการชำระเงิน</li>
                <li>ส่งมอบสินค้าและบริการ</li>
                <li>ให้บริการหลังการขาย</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
