'use client'

import { Info } from 'lucide-react'
import { useStore } from '@/lib/store-context'

export default function AboutPage() {
  const { settings } = useStore()

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl border border-border bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4">
            <Info className="w-3.5 h-3.5" />
            ABOUT
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{settings.pages.aboutTitle}</h1>
          <p className="text-muted-foreground mb-8">{settings.pages.aboutLead}</p>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-background/50">
              <h2 className="text-xl font-bold mb-2">รายละเอียด</h2>
              <p className="text-muted-foreground">{settings.pages.aboutLead}</p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-background/50">
              <h2 className="text-xl font-bold mb-2">คำแนะนำ</h2>
              <p className="text-muted-foreground">
                เก็บเลขออเดอร์ไว้ทุกครั้ง และติดต่อร้านพร้อมหลักฐานเมื่อต้องการให้ตรวจสอบ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
