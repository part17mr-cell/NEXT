'use client'

import { useMemo, useState } from 'react'
import { Wand2, Loader2, CheckCircle2, AlertTriangle, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store-context'
import { toast } from 'sonner'
import type { Product } from '@/lib/store-data'

/** Re-encode one data-URI image to a small JPEG (max 800px, target < ~80 KB). */
function recompress(dataUrl: string): Promise<string> {
  const TARGET = 80_000
  const bytes = (d: string) => Math.ceil((d.length - (d.indexOf(',') + 1)) * 0.75)
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const MAX = 800
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * ratio)
      c.height = Math.round(img.height * ratio)
      const ctx = c.getContext('2d')
      if (!ctx) { resolve(dataUrl); return }
      ctx.drawImage(img, 0, 0, c.width, c.height)
      let q = 0.72
      let out = c.toDataURL('image/jpeg', q)
      while (bytes(out) > TARGET && q > 0.38) { q -= 0.1; out = c.toDataURL('image/jpeg', q) }
      resolve(out)
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

const isHeavyDataUri = (s?: string) => !!s && s.startsWith('data:image') && s.length > 60_000

export function ImageOptimizer() {
  const { products, updateProducts, settings, orders, members } = useStore()
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)

  // estimate the current synced payload size (the thing that hits the 1 MB cap)
  const sizeKB = useMemo(() => {
    try {
      const blob = JSON.stringify({ settings, products, orders, members })
      return Math.round(new TextEncoder().encode(blob).length / 1024)
    } catch { return 0 }
  }, [settings, products, orders, members])

  const over = sizeKB > 1000

  const handleOptimize = async () => {
    setRunning(true)
    setDone(false)
    try {
      const optimized: Product[] = []
      for (const p of products) {
        const next: Product = { ...p }
        if (isHeavyDataUri(p.image_url)) next.image_url = await recompress(p.image_url!)
        if (Array.isArray(p.gallery_images) && p.gallery_images.length) {
          next.gallery_images = await Promise.all(
            p.gallery_images.map(g => (isHeavyDataUri(g) ? recompress(g) : Promise.resolve(g))),
          )
        }
        optimized.push(next)
      }
      updateProducts(optimized) // persists locally + triggers server sync
      setDone(true)
      toast.success('บีบอัดรูปสินค้าทั้งหมดแล้ว — ระบบกำลังซิงค์')
    } catch {
      toast.error('บีบอัดไม่สำเร็จ ลองใหม่อีกครั้ง')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-primary" />
        ซ่อมการซิงค์ / บีบอัดรูปสินค้า
      </h3>

      <div className={`flex items-center gap-3 p-4 rounded-xl border ${over ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
        <Database className={`w-5 h-5 shrink-0 ${over ? 'text-red-500' : 'text-emerald-500'}`} />
        <div className="text-sm">
          <p className="font-semibold">
            ขนาดข้อมูลที่ต้องซิงค์ตอนนี้: <span className={over ? 'text-red-500' : 'text-emerald-500'}>{sizeKB.toLocaleString()} KB</span>
            <span className="text-muted-foreground"> / 1,000 KB</span>
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">
            {over
              ? 'เกินลิมิต — นี่คือสาเหตุที่ซิงค์ล้มเหลว กดปุ่มด้านล่างเพื่อบีบอัดรูปให้เล็กลง'
              : 'อยู่ในเกณฑ์ปกติ ซิงค์ได้'}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        ปุ่มนี้จะบีบอัด <strong className="text-foreground">รูปสินค้าทุกตัวที่อัปโหลดเป็นไฟล์</strong> ให้เล็กลง (สูงสุด 800px)
        โดยไม่แตะข้อมูลออเดอร์/สมาชิก/ยอดโอน — ช่วยให้ซิงค์ผ่านอีกครั้ง
        <br />
        <span className="text-xs">เคล็ดลับระยะยาว: ถ้าสินค้าเยอะมาก ใช้ <strong>ลิงก์ URL รูป</strong> แทนการอัปโหลดไฟล์ จะไม่ชนลิมิตเลย</span>
      </p>

      <Button onClick={handleOptimize} disabled={running} className="gap-2">
        {running ? <Loader2 className="w-4 h-4 animate-spin" /> : done ? <CheckCircle2 className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
        {running ? 'กำลังบีบอัด...' : done ? 'บีบอัดเสร็จแล้ว — บีบซ้ำได้' : 'บีบอัดรูปสินค้าทั้งหมด'}
      </Button>

      {over && !running && (
        <p className="text-xs text-amber-500 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          แนะนำให้กดบีบอัดก่อน แล้วค่อยบันทึกการตั้งค่า/พื้นหลัง
        </p>
      )}
    </div>
  )
}
