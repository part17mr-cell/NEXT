'use client'

import { Palette, Check, Sun, Circle, Moon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { StoreSettings } from '@/lib/store-data'

type ThemeConfig = StoreSettings['theme']

const BASES = [
  { id: 'cream' as const, label: 'ครีมอุ่น', sub: 'สไตล์ Claude', Icon: Sun,    swatch: '#F7F3EC', ring: '#E6DECF' },
  { id: 'white' as const, label: 'ขาวสะอาด', sub: 'มินิมอล',     Icon: Circle, swatch: '#FFFFFF', ring: '#E7E7EA' },
  { id: 'dark'  as const, label: 'มืดพรีเมียม', sub: 'โหมดกลางคืน', Icon: Moon,   swatch: '#0A0A12', ring: '#272739' },
]

const SWATCHES = [
  '#D97757', '#EF4444', '#F59E0B', '#10B981',
  '#06B6D4', '#3B82F6', '#7C3AED', '#EC4899',
]

export function ThemeCustomizer({
  value,
  onChange,
}: {
  value: ThemeConfig
  onChange: (next: ThemeConfig) => void
}) {
  const base = value?.base ?? 'cream'
  const primary = value?.primary ?? '#D97757'

  return (
    <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-7">
      <div>
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          ปรับสีเว็บ
        </h3>
        <p className="text-sm text-muted-foreground mt-1">เลือกโทนพื้นหลังและสีหลักของแบรนด์ เปลี่ยนทั้งเว็บทันที</p>
      </div>

      {/* Base palette */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">โทนพื้นหลัง</Label>
        <div className="grid grid-cols-3 gap-3">
          {BASES.map(b => {
            const active = base === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onChange({ ...value, base: b.id })}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                  active ? 'border-primary shadow-md' : 'border-border hover:border-primary/40'
                }`}
              >
                <div
                  className="w-full h-12 rounded-xl mb-3 border"
                  style={{ background: b.swatch, borderColor: b.ring }}
                />
                <div className="flex items-center gap-1.5">
                  <b.Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-bold text-sm">{b.label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{b.sub}</p>
                {active && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent color */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">สีหลัก (ปุ่ม / ลิงก์ / ไฮไลต์)</Label>

        <div className="flex flex-wrap gap-2">
          {SWATCHES.map(c => {
            const active = primary.toLowerCase() === c.toLowerCase()
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ ...value, primary: c })}
                aria-label={c}
                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                  active ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                style={{ background: c }}
              >
                {active && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primary}
            onChange={e => onChange({ ...value, primary: e.target.value })}
            className="w-12 h-11 rounded-xl border border-border bg-transparent cursor-pointer p-1"
          />
          <Input
            value={primary}
            onChange={e => onChange({ ...value, primary: e.target.value })}
            placeholder="#D97757"
            className="w-32 h-11 font-mono uppercase"
            maxLength={7}
          />
          <span className="text-xs text-muted-foreground">เลือกจากวงล้อ หรือพิมพ์โค้ดสีเอง</span>
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">ตัวอย่าง</Label>
        <div className="p-5 rounded-2xl border border-border bg-background flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm">ปุ่มหลัก</button>
          <button className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold">ปุ่มรอง</button>
          <span className="text-primary font-bold text-sm">ลิงก์สีหลัก</span>
          <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/25">ป้ายไฮไลต์</span>
          <span className="text-sm text-muted-foreground">ข้อความปกติ</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">กด <strong>บันทึกการตั้งค่าทั้งหมด</strong> ด้านล่างเพื่อใช้สีนี้กับลูกค้าทุกคน</p>
    </div>
  )
}
