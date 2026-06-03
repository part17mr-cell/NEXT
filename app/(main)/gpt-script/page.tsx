'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, CheckCircle2, Star, Shield, Clock,
  ArrowRight, Sparkles, TrendingUp, Brain,
  ChevronDown, MessageCircle, Flame, Bot,
  Play, BarChart3, Lock,
} from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

const INCLUDES = [
  { text: 'ระบบ Viral Spoil Script Engine 12 ไฟล์ (Hook / Build / Reveal / Retention / TOS / CTA)', hot: true },
  { text: 'สคริปต์ดิบ 180+ ตัวอย่างจากช่องจริงที่ได้แสนวิว', hot: true },
  { text: '72 Power Words + Headline Swipe File — คำที่ทำให้คนหยุดดู' },
  { text: 'ไฟล์ใช้คำทำเงิน — ถอดจากโฆษณาที่ขายได้จริง' },
  { text: 'วิธีใช้กับ ChatGPT Plus ทีละขั้นตอน พร้อม prompt สำเร็จรูป' },
  { text: 'อัปเดตฟรีตลอด — สูตรใหม่ได้ทันทีโดยไม่ต้องซื้อซ้ำ' },
]

const FAQS = [
  { q: 'ต้องมีช่อง YouTube ก่อนไหม?', a: 'ไม่ต้องครับ เริ่มจาก 0 ได้เลย ซื้อแล้วตั้งช่องวันเดียวกันก็ได้' },
  { q: 'ต้องออกกล้องไหม?', a: 'ไม่ต้อง ทำได้ด้วย voiceover + AI สร้างภาพ ไม่ต้องโชว์หน้าเลยสักครั้ง' },
  { q: 'ใช้กับ ChatGPT ฟรีได้ไหม?', a: 'แนะนำ ChatGPT Plus ครับ ถ้าใช้ฟรีก็ยังได้ผล แต่ Plus จะเร็วและละเอียดกว่า' },
  { q: 'ได้ของทันทีเลยไหม?', a: 'ส่งสลิป → แอดมิน approve → ได้ลิงก์ทันที ปกติภายใน 5–30 นาที' },
  { q: 'ถ้าทำแล้วไม่ได้วิวขึ้น ทำยังไง?', a: 'ติดต่อผมทาง Line OA ได้เลยครับ จะดู feedback ให้ทีละสคริปต์จนกว่าจะได้ผล' },
]

export default function GptScriptLandingPage() {
  const { activeProducts, formatMoney, settings } = useStore()

  const product = useMemo(() =>
    activeProducts.find(p =>
      p.name?.toLowerCase().includes('gpt') ||
      p.name?.includes('สคริปต์ไวรัล') ||
      p.sku?.toLowerCase().includes('gpt')
    ) ?? activeProducts.find(p => (p.sale_price ?? p.price) === 199),
    [activeProducts]
  )

  const price     = product ? (product.sale_price ?? product.price) : 199
  const origPrice = product?.price ?? 990
  const pct       = origPrice > price ? Math.round((1 - price / origPrice) * 100) : 80
  const checkoutHref = product
    ? `/checkout?product=${encodeURIComponent(product.id)}`
    : '/store'
  const lineUrl   = settings?.contact?.lineUrl

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative py-14 sm:py-22 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-[350px] h-[350px] bg-blue-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">

          {/* badge row */}
          <motion.div {...fadeUp(0)} className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" /> FLASH SALE 24/7
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> ขายแล้ว 174 ชิ้น
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-400" /> 4.5 · 1,295 ยอดดู
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1 {...fadeUp(0.05)}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-5"
          >
            <span className="bg-gradient-to-r from-primary via-violet-400 to-blue-400 bg-clip-text text-transparent">
              GPT สคริปต์ไวรัล
            </span>
            <br />
            <span className="text-foreground">ทำ 10K → 10M วิว</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl">บนช่องสปอยการ์ตูน / อนิเมะ</span>
          </motion.h1>

          {/* sub */}
          <motion.p {...fadeUp(0.1)}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            ระบบ AI เขียนสคริปต์ไวรัล 12 ไฟล์ สำหรับช่อง Shorts / TikTok / Reels
            <br />
            <span className="text-foreground font-semibold">
              กรอกชื่อการ์ตูน 1 อย่าง — ได้ Hook + สคริปต์ + CTA ทันที
            </span>
          </motion.p>

          {/* product image */}
          {product?.image_url && (
            <motion.div {...fadeUp(0.12)} className="mb-8 flex justify-center">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/20">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* price overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
                  <div>
                    <del className="text-xs text-white/50">{formatMoney(origPrice)}</del>
                    <p className="text-xl font-black text-primary leading-none">{formatMoney(price)}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black">
                    -{pct}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href={checkoutHref}>
              <Button size="lg"
                className="gap-2 font-black text-base sm:text-lg h-14 px-10 shadow-2xl shadow-primary/40 group w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                ซื้อเลย {formatMoney(price)}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            {lineUrl && (
              <a href={lineUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"
                  className="gap-2 font-bold h-14 px-8 w-full sm:w-auto border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <MessageCircle className="w-5 h-5" />
                  ถามก่อน
                </Button>
              </a>
            )}
          </motion.div>

          {/* trust */}
          <motion.div {...fadeUp(0.18)} className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            {[
              { icon: Shield, text: 'ปลอดภัย 100%' },
              { icon: Clock,  text: 'ได้ของภายใน 30 นาที' },
              { icon: Lock,   text: 'ซื้อครั้งเดียว อัปเดตฟรีตลอด' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-emerald-500" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section className="py-8 px-4 border-y border-border/40 bg-card/30">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val: '174',    label: 'ชิ้นขายแล้ว', color: 'text-emerald-400' },
            { val: '⭐ 4.5', label: 'คะแนนรีวิว',  color: 'text-yellow-400' },
            { val: '180+',   label: 'สคริปต์ดิบ',  color: 'text-blue-400'   },
            { val: '100K',   label: 'วิว การันตี',  color: 'text-primary'    },
          ].map(({ val, label, color }, i) => (
            <motion.div key={label} {...fadeUp(i * 0.06)}>
              <div className={`text-2xl sm:text-3xl font-black mb-1 ${color}`}>{val}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW GPT WORKS ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Bot className="w-3.5 h-3.5" /> ทำงานยังไง?
            </span>
          </motion.div>
          <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-black text-center mb-10">
            กรอก 1 ช่อง — ได้สคริปต์เต็ม
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', icon: Brain,      title: 'paste ไฟล์ GPT', desc: 'เปิด ChatGPT Plus → วาง System Prompt ที่ได้รับ' },
              { step: '2', icon: Play,       title: 'กรอกชื่อการ์ตูน', desc: 'ใส่ชื่อเรื่อง + เหตุการณ์ที่อยากทำ กด Enter' },
              { step: '3', icon: BarChart3,  title: 'ได้สคริปต์ทันที', desc: 'Hook + Voiceover + TOS + CTA + Cover Text พร้อมอัด' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div key={step} {...fadeUp(i * 0.08)}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/40 bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center mb-3">
                  {step}
                </div>
                <h3 className="font-bold mb-2 text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-card/20 border-y border-border/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black text-center mb-3">
            ได้อะไรบ้าง?
          </motion.h2>
          <motion.p {...fadeUp(0.04)} className="text-center text-muted-foreground text-sm mb-8">
            ทุกอย่างที่ต้องใช้ทำช่องสปอยการ์ตูน / อนิเมะ ให้ได้วิวสูง
          </motion.p>

          <div className="space-y-2.5">
            {INCLUDES.map(({ text, hot }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.04)}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
                  hot
                    ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                    : 'border-border/40 bg-card/60 hover:border-border/70'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${hot ? 'text-primary' : 'text-emerald-500'}`} />
                <span className="text-sm font-medium leading-relaxed">{text}</span>
                {hot && (
                  <span className="ml-auto shrink-0 px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-bold">
                    HOT
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* bonus */}
          <motion.div {...fadeUp(0.3)}
            className="mt-5 p-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-400 mb-0.5">Bonus: อัปเดตฟรีตลอดชีพ</p>
              <p className="text-xs text-muted-foreground">
                สูตรถูกปรับปรุงเมื่อไหร่ — ลูกค้าทุกคนได้รับทันที ไม่ต้องจ่ายซ้ำ
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICE CALLOUT ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp()}
            className="p-8 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-violet-500/5 to-blue-500/5 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold mb-5">
              <Flame className="w-3.5 h-3.5" /> FLASH SALE ลด {pct}%
            </div>

            <div className="mb-2">
              <del className="text-muted-foreground text-lg">{formatMoney(origPrice)}</del>
            </div>
            <div className="text-6xl sm:text-7xl font-black text-primary mb-2">
              {formatMoney(price)}
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              จ่ายครั้งเดียว · ไม่มีรายเดือน · อัปเดตฟรีตลอด
            </p>

            <Link href={checkoutHref}>
              <Button size="lg"
                className="gap-2 font-black text-lg h-14 px-12 shadow-2xl shadow-primary/40 group w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                ซื้อเลย {formatMoney(price)}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Shield, text: 'ปลอดภัย' },
                { icon: Clock,  text: '≤ 30 นาที' },
                { icon: Lock,   text: 'ซื้อครั้งเดียว' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="w-4 h-4 text-emerald-500" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-card/20 border-y border-border/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black text-center mb-10">
            คำถามที่พบบ่อย
          </motion.h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <motion.details key={i} {...fadeUp(i * 0.05)}
                className="group p-5 rounded-2xl border border-border/40 bg-card/50 cursor-pointer open:border-primary/30 transition-colors"
              >
                <summary className="flex items-center justify-between font-semibold text-sm list-none gap-4">
                  {q}
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[130px]" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp()} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-sm font-bold">
              <Flame className="w-4 h-4" /> อย่ารอครับ — ราคานี้อาจขึ้นทุกเมื่อ
            </span>
          </motion.div>
          <motion.h2 {...fadeUp(0.05)} className="text-4xl sm:text-5xl font-black mb-4">
            เริ่มต้นเพียง <span className="text-primary">{formatMoney(price)}</span>
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-muted-foreground mb-8">
            ถ้าทำแล้วไม่ได้วิว — ผมดู feedback ให้ฟรีจนกว่าจะได้ผล
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={checkoutHref}>
              <Button size="lg"
                className="gap-2 font-black text-lg h-14 px-12 shadow-2xl shadow-primary/40 group w-full sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                ซื้อเลย {formatMoney(price)}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            {lineUrl && (
              <a href={lineUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"
                  className="gap-2 font-bold h-14 px-8 w-full sm:w-auto border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <MessageCircle className="w-5 h-5" />
                  Line แอดมิน
                </Button>
              </a>
            )}
          </motion.div>
          <motion.p {...fadeUp(0.2)} className="mt-5 text-xs text-muted-foreground">
            ส่งสลิป → ได้ของภายใน 30 นาที · ไม่ต้องสมัครสมาชิกก่อน
          </motion.p>
        </div>
      </section>

    </div>
  )
}
