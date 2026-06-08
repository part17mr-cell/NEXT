'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, X, Plus, Link as LinkIcon, ImageIcon, Film, Power, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useStore } from '@/lib/store-context'
import type { StoreSettings } from '@/lib/store-data'

type BackgroundConfig = StoreSettings['background']

const BASE_HEX: Record<string, string> = { cream: '#F7F3EC', white: '#FFFFFF', dark: '#0A0A12' }

const svgUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`

/** On-brand background presets generated from the current accent + base colors. */
function buildPresets(accent: string, base: string) {
  const mesh = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs><filter id='b' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='90'/></filter></defs>
    <rect width='1200' height='800' fill='${base}'/>
    <g filter='url(#b)'>
      <circle cx='210' cy='170' r='270' fill='${accent}' opacity='0.85'/>
      <circle cx='1010' cy='120' r='230' fill='${accent}' opacity='0.55'/>
      <circle cx='670' cy='760' r='320' fill='${accent}' opacity='0.45'/>
    </g>
  </svg>`

  const gradient = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${accent}' stop-opacity='0.9'/>
      <stop offset='0.55' stop-color='${base}'/>
      <stop offset='1' stop-color='${accent}' stop-opacity='0.5'/>
    </linearGradient></defs>
    <rect width='1200' height='800' fill='url(#g)'/>
  </svg>`

  const dots = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <rect width='1200' height='800' fill='${base}'/>
    <defs><pattern id='d' width='44' height='44' patternUnits='userSpaceOnUse'>
      <circle cx='6' cy='6' r='4' fill='${accent}' opacity='0.9'/>
    </pattern></defs>
    <rect width='1200' height='800' fill='url(#d)'/>
  </svg>`

  return [
    { id: 'mesh', label: 'ออโรร่า', uri: svgUri(mesh), opacity: 55, blur: 0 },
    { id: 'gradient', label: 'ไล่เฉด', uri: svgUri(gradient), opacity: 65, blur: 0 },
    { id: 'dots', label: 'จุดไล่', uri: svgUri(dots), opacity: 45, blur: 0 },
  ]
}

/** Compress a non-animated image to JPEG (max 1280px) targeting < ~140 KB. */
function compressImage(dataUrl: string): Promise<string> {
  const TARGET_BYTES = 140_000
  const estimateBytes = (d: string) => Math.ceil((d.length - (d.indexOf(',') + 1)) * 0.75)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 1280
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(dataUrl); return }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      let q = 0.82
      let out = canvas.toDataURL('image/jpeg', q)
      while (estimateBytes(out) > TARGET_BYTES && q > 0.4) {
        q -= 0.1
        out = canvas.toDataURL('image/jpeg', q)
      }
      resolve(out)
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export function BackgroundManager({
  value,
  onChange,
}: {
  value: BackgroundConfig
  onChange: (next: BackgroundConfig) => void
}) {
  const { settings } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [urlDraft, setUrlDraft] = useState('')
  const images = value?.images ?? []
  const presets = buildPresets(settings.theme?.primary || '#D97757', BASE_HEX[settings.theme?.base ?? 'cream'] ?? BASE_HEX.cream)

  const patch = useCallback(
    (p: Partial<BackgroundConfig>) => onChange({ ...value, ...p }),
    [value, onChange],
  )

  const addImage = useCallback(
    (src: string) => {
      if (!src) return
      onChange({ ...value, images: [...(value.images ?? []), src] })
    },
    [value, onChange],
  )

  const removeImage = (idx: number) =>
    onChange({ ...value, images: images.filter((_, i) => i !== idx) })

  const handleFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      e.target.value = ''
      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(`${file.name}: ใหญ่เกิน 15MB`)
          continue
        }
        const isGif = file.type === 'image/gif'
        const raw: string = await new Promise((res, rej) => {
          const r = new FileReader()
          r.onload = ev => res(ev.target?.result as string)
          r.onerror = rej
          r.readAsDataURL(file)
        })
        if (isGif) {
          // Keep GIF animated (no canvas re-encode). Warn if heavy — it bloats sync.
          if (file.size > 800 * 1024) {
            toast.warning('GIF ไฟล์ใหญ่อาจซิงค์ไม่สำเร็จ — แนะนำใช้ลิงก์ URL ของ GIF แทน')
          }
          addImage(raw)
        } else {
          try {
            addImage(await compressImage(raw))
          } catch {
            addImage(raw)
          }
        }
      }
      toast.success('เพิ่มพื้นหลังแล้ว — กดบันทึกเพื่อใช้งาน')
    },
    [addImage],
  )

  return (
    <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          พื้นหลังเว็บ (เปลี่ยนอัตโนมัติ)
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <Power className={`w-4 h-4 ${value?.enabled ? 'text-emerald-500' : 'text-muted-foreground'}`} />
          <span className="text-sm font-medium">{value?.enabled ? 'เปิดใช้งาน' : 'ปิดอยู่'}</span>
          <Switch checked={!!value?.enabled} onCheckedChange={v => patch({ enabled: v })} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        อัปโหลดรูปหรือ GIF ได้หลายไฟล์ ระบบจะสลับพื้นหลังให้อัตโนมัติตามเวลาที่ตั้งไว้
        <br />
        <span className="text-xs">เคล็ดลับ: GIF ไฟล์ใหญ่ให้ใช้ลิงก์ URL (เช่นจาก Giphy/Tenor) จะลื่นกว่าและไม่ทำให้ซิงค์ช้า</span>
      </p>

      {/* Upload + URL row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="outline" className="gap-2 shrink-0" onClick={() => fileRef.current?.click()}>
          <Upload className="w-4 h-4" />
          อัปโหลดรูป / GIF
        </Button>
        <input ref={fileRef} type="file" accept="image/*,image/gif" multiple className="hidden" onChange={handleFiles} />

        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={urlDraft}
              onChange={e => setUrlDraft(e.target.value)}
              placeholder="วางลิงก์รูป/GIF แล้วกด +"
              className="pl-9 h-10"
              onKeyDown={e => {
                if (e.key === 'Enter') { addImage(urlDraft.trim()); setUrlDraft('') }
              }}
            />
          </div>
          <Button
            type="button"
            className="gap-1 shrink-0"
            onClick={() => { addImage(urlDraft.trim()); setUrlDraft('') }}
            disabled={!urlDraft.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* On-brand presets (match the chosen theme color) */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          พื้นหลังสำเร็จรูป (เข้ากับธีมอัตโนมัติ)
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {presets.map(p => {
            const active = images.length === 1 && images[0] === p.uri
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ ...value, enabled: true, images: [p.uri], opacity: p.opacity, blur: p.blur })}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${active ? 'border-primary shadow-md' : 'border-border hover:border-primary/40'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.uri} alt={p.label} className="w-full h-16 object-cover" />
                <span className="block text-[11px] font-bold py-1 bg-card">{p.label}</span>
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-muted-foreground">สร้างจากสีหลักของคุณ — เปลี่ยนสีในแท็บ &quot;สีเว็บ&quot; แล้วกดพรีเซ็ตใหม่เพื่ออัปเดตสี</p>
      </div>

      {/* Thumbnail grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((src, i) => {
            const isGif = src.startsWith('data:image/gif') || /\.gif(\?|$)/i.test(src)
            return (
              <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`background ${i + 1}`} className="w-full h-full object-cover" />
                {isGif && (
                  <span className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                    <Film className="w-2.5 h-2.5" /> GIF
                  </span>
                )}
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                  #{i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-10 rounded-xl border border-dashed border-border text-center text-muted-foreground text-sm">
          ยังไม่มีพื้นหลัง — อัปโหลดหรือวางลิงก์เพื่อเริ่ม
        </div>
      )}

      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-5 pt-2 border-t border-border">
        <div className="space-y-2">
          <Label className="text-sm">สลับทุก (วินาที)</Label>
          <Input
            type="number" min={0} max={120}
            value={value?.intervalSec ?? 8}
            onChange={e => patch({ intervalSec: Math.max(0, +e.target.value) })}
            className="h-10"
          />
          <p className="text-[11px] text-muted-foreground">0 = ไม่สลับ (ใช้รูปเดียว)</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">ความเข้ม {value?.opacity ?? 18}%</Label>
          <input
            type="range" min={0} max={100}
            value={value?.opacity ?? 18}
            onChange={e => patch({ opacity: +e.target.value })}
            className="w-full accent-primary"
          />
          <p className="text-[11px] text-muted-foreground">ยิ่งสูงพื้นหลังยิ่งชัด</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">เบลอ {value?.blur ?? 2}px</Label>
          <input
            type="range" min={0} max={20}
            value={value?.blur ?? 2}
            onChange={e => patch({ blur: +e.target.value })}
            className="w-full accent-primary"
          />
          <p className="text-[11px] text-muted-foreground">เบลอช่วยให้อ่านง่ายขึ้น</p>
        </div>
      </div>
    </div>
  )
}
