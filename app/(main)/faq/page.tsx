'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle, Search, ChevronDown, ShoppingCart, CreditCard,
  Package, User, MessageCircle
} from 'lucide-react'

const categories = [
  { id: 'ordering', label: 'การสั่งซื้อ', icon: ShoppingCart },
  { id: 'payment', label: 'การชำระเงิน', icon: CreditCard },
  { id: 'delivery', label: 'การรับสินค้า', icon: Package },
  { id: 'account', label: 'บัญชีและสมาชิก', icon: User },
  { id: 'other', label: 'อื่นๆ', icon: MessageCircle },
]

const faqs = [
  // ordering
  {
    cat: 'ordering',
    q: 'วิธีสั่งซื้อสินค้าทำอย่างไร?',
    a: 'เลือกสินค้าที่ต้องการ → เพิ่มลงตะกร้า → กรอกข้อมูล → ชำระเงิน → อัปโหลดสลิป → รอยืนยัน เพียงเท่านี้ก็รับสินค้าได้ทันที',
  },
  {
    cat: 'ordering',
    q: 'ต้องสมัครสมาชิกก่อนซื้อไหม?',
    a: 'ไม่จำเป็น สามารถซื้อในฐานะแขกได้เลย แต่ถ้าสมัครสมาชิกจะได้รับสิทธิ์ดูประวัติออเดอร์และไฟล์ของตัวเองได้ง่ายขึ้น',
  },
  {
    cat: 'ordering',
    q: 'สั่งซื้อสินค้าได้ตลอด 24 ชั่วโมงไหม?',
    a: 'ได้เลย ระบบของเราทำงานตลอด 24 ชั่วโมง สั่งซื้อได้ทุกเมื่อ และระบบจะส่งสินค้าให้อัตโนมัติหลังยืนยันการชำระเงิน',
  },
  {
    cat: 'ordering',
    q: 'สามารถสั่งซื้อหลายชิ้นพร้อมกันได้ไหม?',
    a: 'ได้ เพิ่มสินค้าหลายชิ้นลงตะกร้าก่อนชำระเงินได้เลย ระบบจะคำนวณยอดรวมให้อัตโนมัติ',
  },
  // payment
  {
    cat: 'payment',
    q: 'มีช่องทางชำระเงินอะไรบ้าง?',
    a: 'รองรับการโอนเงินผ่านธนาคาร พร้อมเพย์ และ QR Code ตามที่แสดงในหน้าชำระเงิน',
  },
  {
    cat: 'payment',
    q: 'หลังโอนเงินต้องทำอะไรต่อ?',
    a: 'อัปโหลดสลิปโอนเงินในหน้า Checkout และกรอก Email หรือ Username เพื่อให้ทีมงานตรวจสอบ จะได้รับสินค้าภายใน 5-15 นาที',
  },
  {
    cat: 'payment',
    q: 'ยืนยันการชำระเงินใช้เวลาเท่าไหร่?',
    a: 'โดยทั่วไปภายใน 5-15 นาทีในชั่วโมงทำการ ในช่วงเวลาอื่นอาจนานสูงสุด 1 ชั่วโมง ขึ้นอยู่กับปริมาณออเดอร์',
  },
  // delivery
  {
    cat: 'delivery',
    q: 'รับสินค้าดิจิทัลอย่างไร?',
    a: 'หลังยืนยันการชำระเงินแล้ว สินค้าจะถูกส่งผ่าน Link ดาวน์โหลด ซึ่งปรากฏในหน้าติดตามออเดอร์และแจ้งผ่าน Email ที่ให้ไว้',
  },
  {
    cat: 'delivery',
    q: 'ดาวน์โหลดสินค้าได้กี่ครั้ง?',
    a: 'ขึ้นอยู่กับแต่ละสินค้า โดยทั่วไปสามารถดาวน์โหลดได้ไม่จำกัดครั้งผ่าน Link ที่รับมา ตลอดระยะเวลาที่ Link ยังใช้งานได้',
  },
  {
    cat: 'delivery',
    q: 'ไม่ได้รับสินค้าหลังชำระเงินแล้วต้องทำอย่างไร?',
    a: 'ตรวจสอบหน้าติดตามออเดอร์ก่อน ถ้ายังไม่ได้รับภายใน 1 ชั่วโมง ติดต่อทีมงานผ่านหน้าติดต่อพร้อมแนบสลิปและรหัสออเดอร์',
  },
  // account
  {
    cat: 'account',
    q: 'ลืมรหัสผ่านทำอย่างไร?',
    a: 'ติดต่อทีมงานผ่านหน้าติดต่อ พร้อมแจ้ง Username และยืนยันตัวตน ทีมงานจะรีเซ็ตรหัสผ่านให้ภายใน 24 ชั่วโมง',
  },
  {
    cat: 'account',
    q: 'ดูประวัติออเดอร์ได้ที่ไหน?',
    a: 'เข้าสู่ระบบแล้วไปที่หน้า "บัญชีของฉัน" หรือใช้หน้า "ติดตามออเดอร์" โดยกรอกรหัสออเดอร์เพื่อดูสถานะได้โดยไม่ต้องล็อกอิน',
  },
  // other
  {
    cat: 'other',
    q: 'มีนโยบายคืนเงินไหม?',
    a: 'เนื่องจากเป็นสินค้าดิจิทัล โดยทั่วไปไม่รองรับการคืนเงินหลังได้รับสินค้าแล้ว หากมีปัญหาจากทางร้าน เช่น ไฟล์เสียหรือ Link ใช้งานไม่ได้ ติดต่อทีมงานได้ทันที',
  },
  {
    cat: 'other',
    q: 'ซื้อสินค้าแล้วใช้ส่วนตัวได้เลยไหม?',
    a: 'ได้เลย สินค้าทุกชิ้นมีลิขสิทธิ์ใช้งานส่วนตัว ไม่อนุญาตให้นำไปขายต่อหรือแจกจ่ายโดยไม่ได้รับอนุญาต',
  },
  {
    cat: 'other',
    q: 'ติดต่อทีมงานได้ทางไหน?',
    a: 'ผ่านหน้าติดต่อบนเว็บไซต์ หรือช่องทาง Line/Facebook ที่ระบุไว้ในหน้าติดต่อ ทีมงานพร้อมตอบคำถามในชั่วโมงทำการ',
  },
]

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState('ordering')
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = faqs.filter(f => {
    const matchCat = search ? true : f.cat === activeCat
    const matchSearch = search
      ? f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
      : true
    return matchCat && matchSearch
  })

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h1 className="text-4xl font-black mb-3">คำถามพบบ่อย</h1>
          <p className="text-muted-foreground">รวมคำตอบสำหรับคำถามที่ถามบ่อย ครบทุกเรื่อง</p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 max-w-xl mx-auto"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาคำถาม..."
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-card/60 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar: categories */}
          {!search && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:w-56 shrink-0"
            >
              <div className="lg:sticky lg:top-24 p-4 rounded-2xl border border-border/50 bg-card/60 glass space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-3">หมวดหมู่</p>
                {categories.map(cat => {
                  const Icon = cat.icon
                  const isActive = activeCat === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCat(cat.id); setOpenIndex(null) }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                        ${isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* FAQ accordion */}
          <div className="flex-1 min-w-0 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>ไม่พบคำถามที่ตรงกัน</p>
              </div>
            ) : (
              filtered.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-sm hover:text-primary transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-black shrink-0">
                          Q
                        </span>
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0">
                            <div className="pl-9 text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30">
                              {faq.a}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 rounded-2xl border border-border/50 bg-card/40"
        >
          <p className="font-bold mb-2">ยังไม่เจอคำตอบที่ต้องการ?</p>
          <p className="text-sm text-muted-foreground mb-4">ติดต่อทีมงานได้เลย เราพร้อมช่วยเหลือ</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            <MessageCircle className="w-4 h-4" />
            ติดต่อทีมงาน
          </a>
        </motion.div>
      </div>
    </section>
  )
}
