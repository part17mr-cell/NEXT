'use client'

import Link from 'next/link'
import { Headset, MessageSquare, Mail, ExternalLink, Phone } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Mascot } from '@/components/mascot'

export default function ContactPage() {
  const { settings } = useStore()

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header + mascot */}
        <div className="flex items-start justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
              <Headset className="w-3.5 h-3.5" />
              CONTACT
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">{settings.contact.title}</h1>
            <p className="text-muted-foreground">{settings.contact.lead}</p>
          </div>
          <div className="hidden sm:block shrink-0 mt-2">
            <Mascot page="contact" size={160} message="ทักมาได้เลย!" float />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Line OA */}
          {settings.contact.lineUrl && (
            <a href={settings.contact.lineUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-emerald-300">Line OA</p>
                <p className="text-sm text-muted-foreground truncate">{settings.contact.lineId || 'ติดต่อทาง Line'}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          )}

          {/* Email */}
          {settings.contact.email && (
            <a href={`mailto:${settings.contact.email}`}
              className="flex items-center gap-4 p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-blue-300">Email</p>
                <p className="text-sm text-muted-foreground truncate">{settings.contact.email}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          )}

          {/* Phone */}
          {settings.contact.phone && (
            <a href={`tel:${settings.contact.phone}`}
              className="flex items-center gap-4 p-5 rounded-2xl border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-violet-300">โทรศัพท์</p>
                <p className="text-sm text-muted-foreground">{settings.contact.phone}</p>
              </div>
            </a>
          )}

          {/* Hours */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/40 bg-card/40">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">เวลาให้บริการ</p>
              <p className="text-sm text-muted-foreground">{settings.contact.hours || 'ตอบกลับภายใน 24 ชม.'}</p>
            </div>
          </div>
        </div>

        {/* note */}
        {settings.contact.note && (
          <div className="mt-6 p-5 rounded-2xl border border-border/30 bg-card/30">
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{settings.contact.note}</p>
          </div>
        )}

        {/* FAQ link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ดูคำถามที่พบบ่อยได้ที่{' '}
            <Link href="/faq" className="text-primary font-semibold hover:underline">หน้า FAQ</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
