'use client'

import { motion } from 'framer-motion'

/**
 * page-mascots.png — 5 cols × 3 rows
 * Row 0: Home(0,0) | Product(1,0) | ProductDetail(2,0) | Cart(3,0) | Checkout(4,0)
 * Row 1: OrderTracking(0,1) | Login(1,1) | Register(2,1) | Contact(3,1) | FAQ(4,1)
 * Row 2: MemberDashboard(0,2) | Coupon(1,2) | Security(2,2) | Admin(3,2)
 */
export type MascotPage =
  | 'home' | 'product' | 'productDetail' | 'cart' | 'checkout'
  | 'orderTracking' | 'login' | 'register' | 'contact' | 'faq'
  | 'dashboard' | 'coupon' | 'security' | 'admin'

const COLS = 5
const ROWS = 3

const POS: Record<MascotPage, [number, number]> = {
  home:          [0, 0],
  product:       [1, 0],
  productDetail: [2, 0],
  cart:          [3, 0],
  checkout:      [4, 0],
  orderTracking: [0, 1],
  login:         [1, 1],
  register:      [2, 1],
  contact:       [3, 1],
  faq:           [4, 1],
  dashboard:     [0, 2],
  coupon:        [1, 2],
  security:      [2, 2],
  admin:         [3, 2],
}

interface MascotProps {
  page: MascotPage
  size?: number
  float?: boolean
  className?: string
  message?: string
}

export function Mascot({ page, size = 180, float = true, className = '', message }: MascotProps) {
  const [col, row] = POS[page]

  // CSS background-image sprite — แสดงทีละ 1 ตัว
  const bgX = col === 0 ? 0 : (col / (COLS - 1)) * 100
  const bgY = row === 0 ? 0 : (row / (ROWS - 1)) * 100

  const spriteDiv = (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size }}>
      {/* speech bubble */}
      {message && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          <div className="px-3 py-1.5 rounded-2xl rounded-bl-none bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/30">
            {message}
          </div>
          <div className="w-0 h-0 ml-4
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[7px] border-t-primary" />
        </div>
      )}

      {/* sprite window — clip ล่าง 18% ที่มี label text */}
      <div style={{ width: size, height: size * 0.82, overflow: 'hidden' }}>
        <div
          style={{
            width: size,
            height: size,
            backgroundImage: 'url(/mascot/page-mascots.png)',
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
    </div>
  )

  if (!float) return spriteDiv

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block' }}
    >
      {spriteDiv}
    </motion.div>
  )
}
