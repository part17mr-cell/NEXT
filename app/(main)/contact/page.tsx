'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Headset, MessageSquare, Mail, ExternalLink, Clock, ShieldCheck } from 'lucide-react'
import { useStore } from '@/lib/store-context'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function ContactPage() {
  const { settings } = useStore()
  const { contact } = settings

  return (
    <section className="relative py-14 px-4 overflow-hidden">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold mb-4">
            <Headset className="w-3.5 h-3.5" />
            ติดต่อเรา
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">{contact.title}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{contact.lead}</p>
        </motion.div>

        {/* Contact channels */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Line OA */}
          {contact.lineUrl && (
            <motion.a
              {...fadeUp(0.05)}
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-emerald-300">Line OA</p>
                <p className="text-sm text-muted-foreground truncate">{contact.lineId || 'ติดต่อทาง Line'}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </motion.a>
          )}

          {/* Discord */}
          <motion.a
            {...fadeUp(0.1)}
            href="https://discord.gg/Bnp7sR3uf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-indigo-300">Discord</p>
              <p className="text-sm text-muted-foreground truncate">เข้าร่วมเซิร์ฟเวอร์ Discord</p>
            </div>
            <ExternalLink className="w-4 h-4 text-indigo-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </motion.a>

          {/* Email */}
          {contact.email && (
            <motion.a
              {...fadeUp(0.1)}
              href={`mailto:${contact.email}`}
              className="flex items-center gap-4 p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-blue-300">Email</p>
                <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </motion.a>
          )}

          {/* Service hours */}
          <motion.div
            {...fadeUp(0.2)}
            className="flex items-center gap-4 p-5 rounded-2xl border border-border/40 bg-card/40"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground">เวลาให้บริการ</p>
              <p className="text-sm text-muted-foreground">ตอบกลับภายใน 24 ชม. ทุกวัน</p>
            </div>
          </motion.div>
        </div>

        {/* Reassurance strip */}
        <motion.div
          {...fadeUp(0.25)}
          className="mt-6 flex items-center gap-3 p-5 rounded-2xl border border-primary/20 bg-primary/5"
        >
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            สั่งซื้อแล้วของยังไม่มา? ส่ง<strong className="text-foreground"> เลขออเดอร์ </strong>
            และ<strong className="text-foreground"> สลิป </strong>มาทาง Line หรือ Discord ได้เลย แอดมินตรวจสอบและส่งของให้ทันที
          </p>
        </motion.div>

        {/* FAQ link */}
        <motion.div {...fadeUp(0.3)} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ดูคำถามที่พบบ่อยได้ที่{' '}
            <Link href="/faq" className="text-primary font-semibold hover:underline">หน้า FAQ</Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
