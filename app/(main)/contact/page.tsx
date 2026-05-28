'use client'

import Link from 'next/link'
import { Headset, MessageSquare, Phone, Package, Mail, ExternalLink } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const { settings } = useStore()

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl border border-border bg-card/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4">
            <Headset className="w-3.5 h-3.5" />
            CONTACT
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{settings.contact.title}</h1>
          <p className="text-muted-foreground mb-8">{settings.contact.lead}</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* LINE */}
            <div className="p-6 rounded-2xl border border-border bg-background/50 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
                LINE
              </span>
              <h3 className="text-xl font-bold mb-3">{settings.contact.lineId}</h3>
              {settings.contact.lineUrl && (
                <a 
                  href={settings.contact.lineUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <MessageSquare className="w-4 h-4" />
                    ทัก LINE
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              )}
            </div>

            {/* Track Order */}
            <div className="p-6 rounded-2xl border border-border bg-background/50 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3">
                TRACK
              </span>
              <h3 className="text-xl font-bold mb-3">ติดตามออเดอร์</h3>
              <Link href="/track">
                <Button variant="outline" className="gap-2">
                  <Package className="w-4 h-4" />
                  ไปหน้าติดตาม
                </Button>
              </Link>
            </div>

            {/* Phone */}
            <div className="p-6 rounded-2xl border border-border bg-background/50 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-500" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-3">
                PHONE
              </span>
              {settings.contact.phone && settings.contact.phone !== '-'
                ? <h3 className="text-xl font-bold mb-3">{settings.contact.phone}</h3>
                : <p className="text-lg font-medium text-muted-foreground mb-3">ไม่ระบุ</p>
              }
              <p className="text-sm text-muted-foreground">ช่องทางสำรอง</p>
            </div>
          </div>

          {/* Email section */}
          {settings.contact.email && (
            <div className="mt-6 p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">อีเมล</p>
                  <p className="font-medium">{settings.contact.email}</p>
                </div>
              </div>
              <a href={`mailto:${settings.contact.email}`}>
                <Button variant="ghost" size="sm">
                  ส่งอีเมล
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
