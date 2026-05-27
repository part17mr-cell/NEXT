'use client'

import { useRef, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  previewHeight?: string
}

/** Compress an image data-URL to JPEG at max 1024px, 80% quality (~100-300 KB result) */
function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 1024
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1)
      const w = Math.round(img.width * ratio)
      const h = Math.round(img.height * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(dataUrl); return }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.80))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export function ImageInput({
  value,
  onChange,
  placeholder = 'วาง URL หรืออัปโหลดจากเครื่อง',
  previewHeight = 'h-24',
}: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 10 * 1024 * 1024) {
        toast.error('รูปภาพต้องมีขนาดไม่เกิน 10MB')
        e.target.value = ''
        return
      }
      const reader = new FileReader()
      reader.onload = async ev => {
        try {
          const raw = ev.target?.result as string
          const compressed = await compressImage(raw)
          onChange(compressed)
        } catch {
          onChange(ev.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    },
    [onChange],
  )

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value.startsWith('data:') ? '(รูปจากเครื่อง — อัปโหลดแล้ว)' : value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-9 text-sm"
          readOnly={value.startsWith('data:')}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-3.5 h-3.5" />
          อัปโหลด
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 px-2 text-muted-foreground hover:text-destructive"
            onClick={() => onChange('')}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {value && (
        <div
          className={`relative ${previewHeight} rounded-xl overflow-hidden bg-muted border border-border/50`}
        >
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={e => ((e.currentTarget as HTMLImageElement).style.opacity = '0.3')}
          />
        </div>
      )}
    </div>
  )
}
