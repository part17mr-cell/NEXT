'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, CheckCircle2, Star, Shield, Clock, Users,
  ArrowRight, Play, Sparkles, TrendingUp, Brain,
  ChevronDown, MessageCircle, BarChart3, Flame,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'

// ─── animation helpers ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

// ─── static copy ─────────────────────────────────────────────────────────────
const INCLUDES = [
  'ระบบ Viral Spoil 12 ไฟล์ (Hook / Build / Reveal / Retention / TOS / CTA)',
  'สคริปต์ดิบ 180+ ตัวอย่างจากช่องจริงที่ได้แสนวิว',
  '72 Power Words + Headline Swipe File',
  'ไฟล์ใช้คำทำเงิน (ถอดจากโฆษณาที่ขายได้จริง)',
  'วิธีใช้กับ ChatGPT Plus ทีละขั้นตอน',
  'อัปเดตฟรีตลอด — ได้ของใหม่เมื่อสูตรปรับ',
]

const RESULTS = [
  { stat: '174', label: 'ชิ้นขายแล้ว', icon: TrendingUp, color: 'text-emerald-400' },
  { stat: '⭐ 5.0', label: 'คะแนนเต็ม', icon: Star, color: 'text-yellow-400' },
  { stat: '180+', label: 'สคริปต์ดิบ', icon: Brain, color: 'text-blue-400' },
  { stat: '12', label: 'ไฟล์ระบบ', icon: BarChart3, color: 'text-violet-400' },
]

const FAQS = [
  {
    q: 'ต้องมีช่อง YouTube ก่อนไหม?',
    a: 'ไม่ต้องครับ เริ่มจาก 0 ได้เลย ซื้อแล้วตั้งช่องวันเดียวกันก็ได้',
  },
  {
    q: 'ต้องออกกล้องไหม?',
    a: 'ไม่ต้อง ทำได้ด้วย voiceover + AI สร้างภาพ ไม่ต้องโชว์หน้าเลย',
  },
  {
    q: 'ใช้กับ ChatGPT ฟรีได้ไหม?',
    a: 'แนะนำ ChatGPT Plus ครับ แต่ถ้าใช้ฟรีก็ยังได้ผล เพียงแต่ Plus จะเร็วและละเอียดกว่า',
  },
  {
    q: 'ได้ของทันทีเลยไหม?',
    a: 'ซื้อ → โอน → ส่งสลิป → แอดมิน approve แล้วได้ลิงก์ทันที ปกติภายใน 5–30 นาที',
  },
  {
    q: 'ถ้าทำแล้วไม่ได้วิวขึ้น ทำยังไง?',
    a: 'ติดต่อผมทาง Line OA ได้เลยครับ จะดู feedback ให้ทีละสคริปต์จนกว่าจะได้ผล',
  },
]

// ─── component ───────────────────────────────────────────────────────────────
export default function GptScriptLandingPage() {
  // อ่านข้อมูลสินค้าจาก store แบบ read-only — ไม่แตะ orders/members
  const { activeProducts, formatMoney, settings } = useStore()

  // หาสินค้าตัวนี้จากชื่อหรือ sku (อ่านอย่างเดียว)
  const product = useMemo(
    () =>
      activeProducts.find(
        p =>
          p.name?.toLowerCase().includes('gpt') ||
          p.name?.toLowerCase().includes('สคริปต์') ||
          p.sku?.toLowerCase().includes('gpt'),
      ) ?? activeProducts.find(p => p.price === 199 || p.sale_price === 199),
    [activeProducts],
  )

  const price    = product ? (product.sale_price ?? product.price) : 199
  const origPrice = product?.price ?? 199
  const hasDiscount = origPrice > price
  const checkoutHref = product
    ? `/checkout?product=${encodeURIComponent(product.id)}`
    : '/store'

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
        {/* glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/25 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* kicker */}
          <motion.div {...fadeUp(0)} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-bold">
              <Flame className="w-4 h-4 text-orange-400" />
              ขายแล้ว 174 ชิ้น ⭐ 5.0 จากลูกค้าจริง
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            {...fadeUp(0.05)}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6"
          >
            สูตรทำ YouTube Shorts{' '}
            <span className="bg-gradient-to-r from-primary via-violet-400 to-blue-400 bg-clip-text text-transparent">
              แสนวิว
            </span>
            <br />จากช่องที่ทำได้จริง
          </motion.h1>

          {/* sub */}
          <motion.p
            {...fadeUp(0.1)}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            GPT ระบบ AI เขียนสคริปต์ไวรัล สำหรับช่องสปอยการ์ตูน / อนิเมะ / เล่าเรื่อง
            <br />
            <span className="text-foreground font-semibold">
              เคยขายคอร์สได้วันละแสน — ตอนนี้เอาสูตรมาขายให้คุณ 199 บาท
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href={checkoutHref}>
              <Button
                size="lg"
                className="gap-2 font-black text-lg h-14 px-10 shadow-2xl shadow-primary/40 group w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                ซื้อเลย {formatMoney(price)}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/store">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-bold h-14 px-8 w-full sm:w-auto"
              >
                <Play className="w-5 h-5" />
                ดูสินค้าทั้งหมด
              </Button>
            </Link>
          </motion.div>

          {/* price note */}
          {hasDiscount && (
            <motion.p {...fadeUp(0.18)} className="text-sm text-muted-foreground">
              ราคาปกติ{' '}
              <del className="text-muted-foreground/60">{formatMoney(origPrice)}</del>
              {' '}→{' '}
              <span className="text-primary font-bold">{formatMoney(price)} เท่านั้น</span>
            </motion.p>
          )}

          {/* trust row */}
          <motion.div
            {...fadeUp(0.2)}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: Shield,  text: 'ปลอดภัย 100%' },
              { icon: Clock,   text: 'ได้ของภายใน 30 นาที' },
              { icon: Users,   text: 'ใช้แล้ว 174+ คน' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 text-emerald-500" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 border-y border-border/40 bg-card/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {RESULTS.map(({ stat, label, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.06)}
              className="text-center"
            >
              <div className={`text-3xl sm:text-4xl font-black mb-1 ${color}`}>{stat}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROOF (Kevin story) ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              เรื่องจริง ไม่ใช่แค่โฆษณา
            </span>
          </motion.div>

          <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-black text-center mb-10">
            ทำไมต้องเชื่อสูตรนี้?
          </motion.h2>

          <motion.div
            {...fadeUp(0.1)}
            className="p-6 sm:p-8 rounded-3xl border border-border/50 bg-card/60 space-y-5 text-base leading-relaxed"
          >
            <p>
              ผมชื่อ <span className="font-bold text-foreground">Kevin</span> อายุ 21
              ทำช่อง YouTube แนวสปอยการ์ตูน / จิตวิทยา
              จน<span className="text-primary font-bold"> ได้แสนวิวจากสูตรที่พัฒนาขึ้นมาเอง</span>
            </p>
            <p>
              ก่อนหน้านี้ผมขายคอร์สออนไลน์และทำได้{' '}
              <span className="font-bold text-foreground">วันละแสนบาทจริงๆ</span>{' '}
              โดยไม่ต้องออกกล้องสักครั้ง
            </p>
            <p>
              สูตรที่ผมใช้ทำวิวนั้น ผมเอามาถอดออกมาทั้งหมด —
              Hook, Build, Reveal, Retention, CTA, Cover Text
              แล้วโปรแกรมไว้ใน <span className="text-primary font-bold">ChatGPT</span>{' '}
              ให้คุณกรอกชื่อการ์ตูน ได้สคริปต์ทันที
            </p>
            <p className="text-muted-foreground text-sm">
              มีคนซื้อไปแล้ว 174 คน รีวิว 5.0 ดาวทุกคน
              ถ้าสูตรไม่ได้ผล ผมจะดู feedback ให้ฟรีจนกว่าจะได้วิวครับ
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-card/20 border-y border-border/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black text-center mb-3">
            ซื้อแล้วได้อะไรบ้าง?
          </motion.h2>
          <motion.p {...fadeUp(0.05)} className="text-center text-muted-foreground mb-10">
            ทุกอย่างที่ต้องใช้ทำช่องสปอยการ์ตูน / อนิเมะ ให้ได้วิวสูง
          </motion.p>

          <div className="space-y-3">
            {INCLUDES.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.05)}
                className="flex items-start gap-3 p-4 rounded-2xl border border-border/40 bg-card/60 hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* bonus callout */}
          <motion.div
            {...fadeUp(INCLUDES.length * 0.05 + 0.1)}
            className="mt-6 p-5 rounded-2xl border border-primary/30 bg-primary/5 flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-primary mb-0.5">Bonus: ได้อัปเดตฟรีตลอดชีพ</p>
              <p className="text-sm text-muted-foreground">
                เมื่อสูตรถูก update ใหม่ ลูกค้าทุกคนที่ซื้อแล้วได้รับของใหม่ทันที — ไม่ต้องซื้อซ้ำ
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black text-center mb-10">
            ใช้งานยังไง?
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'ซื้อ & โอนเงิน', desc: 'จ่าย 199฿ ส่งสลิปในเว็บ ไม่ต้องแอด Line ก่อน' },
              { step: '2', title: 'รับ GPT ใน 30 นาที', desc: 'แอดมินส่งลิงก์ไฟล์ให้ทาง Line หรือในเว็บ' },
              { step: '3', title: 'กรอก → ได้สคริปต์', desc: 'เปิด ChatGPT → paste ไฟล์ → กรอกชื่อการ์ตูน → ได้สคริปต์ทันที' },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                {...fadeUp(i * 0.08)}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/40 bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-black text-xl mb-4">
                  {step}
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS placeholder ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-card/20 border-y border-border/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black text-center mb-3">
            คนที่ใช้แล้วบอกว่าไง?
          </motion.h2>
          <motion.p {...fadeUp(0.05)} className="text-center text-muted-foreground mb-10">
            174 คนที่ซื้อแล้ว — 5.0 ดาวทุกรีวิว
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: 'ลูกค้าจริง ⭐⭐⭐⭐⭐',
                text: 'สูตรชัดมาก ใช้งานได้จริง ทำสคริปต์ได้เร็วกว่าเดิม 10 เท่า',
              },
              {
                name: 'ลูกค้าจริง ⭐⭐⭐⭐⭐',
                text: 'ก่อนหน้านี้นึกหัวข้อไม่ออกเลย พอใช้ระบบนี้ทำได้ทุกวัน',
              },
            ].map(({ name, text }, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                className="p-5 rounded-2xl border border-border/40 bg-card/60"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                    K
                  </div>
                  <span className="text-sm font-semibold">{name}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp(0.2)} className="text-center text-xs text-muted-foreground mt-6">
            * รีวิวทั้งหมดมาจากลูกค้าที่ซื้อจริงในเว็บ
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black text-center mb-10">
            คำถามที่พบบ่อย
          </motion.h2>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <motion.details
                key={i}
                {...fadeUp(i * 0.05)}
                className="group p-5 rounded-2xl border border-border/40 bg-card/50 cursor-pointer open:border-primary/30 transition-colors"
              >
                <summary className="flex items-center justify-between font-semibold text-sm list-none">
                  {q}
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp()} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-sm font-bold">
              <Flame className="w-4 h-4" />
              ราคาเปิดตัว — อาจขึ้นราคาทุกเมื่อ
            </span>
          </motion.div>

          <motion.h2 {...fadeUp(0.05)} className="text-4xl sm:text-5xl font-black mb-4">
            เริ่มต้นเพียง{' '}
            <span className="text-primary">{formatMoney(price)}</span>
          </motion.h2>

          <motion.p {...fadeUp(0.1)} className="text-muted-foreground mb-8 text-lg">
            ถ้าใช้สูตรนี้แล้วไม่ได้ผล — ผมดู feedback ให้ฟรีจนกว่าจะได้วิว
          </motion.p>

          <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={checkoutHref}>
              <Button
                size="lg"
                className="gap-2 font-black text-lg h-14 px-12 shadow-2xl shadow-primary/40 group w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                ซื้อเลย {formatMoney(price)}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            {settings?.contact?.lineUrl && (
              <a href={settings.contact.lineUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 font-bold h-14 px-8 w-full sm:w-auto border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
                  <MessageCircle className="w-5 h-5" />
                  ถามก่อน Line แอดมิน
                </Button>
              </a>
            )}
          </motion.div>

          <motion.p {...fadeUp(0.2)} className="mt-6 text-xs text-muted-foreground">
            ซื้อแล้วได้ลิงก์ภายใน 5–30 นาที · ไม่ต้องสมัครสมาชิกก่อน
          </motion.p>
        </div>
      </section>

    </div>
  )
}
