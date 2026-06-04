'use client'

import { motion } from 'framer-motion'

/**
 * page-mascots.png layout — 5 cols × 3 rows
 * Row 1: Home | Product | ProductDetail | Cart | Checkout
 * Row 2: OrderTracking | Login | Register | Contact | FAQ
 * Row 3: MemberDashboard | Coupon | Security | Admin | (empty)
 */
export type MascotPage =
  | 'home' | 'product' | 'productDetail' | 'cart' | 'checkout'
  | 'orderTracking' | 'login' | 'register' | 'contact' | 'faq'
  | 'dashboard' | 'coupon' | 'security' | 'admin'

const MASCOT_POSITIONS: Record<MascotPage, [number, number]> = {
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
  size?: number       // px, default 200
  float?: boolean     // floating animation
  className?: string
  message?: string    // speech bubble text
}

export function Mascot({ page, size = 200, float = true, className = '', message }: MascotProps) {
  const [col, row] = MASCOT_POSITIONS[page]
  const cols = 5
  const rows = 3

  // sprite crop via CSS
  const spriteStyle: React.CSSProperties = {
    position: 'absolute',
    width:  `${cols * 100}%`,
    height: `${rows * 100}%`,
    left:   `-${col * 100}%`,
    top:    `-${row * 100}%`,
    imageRendering: 'auto',
  }

  const wrapper = (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size }}>
      {/* speech bubble */}
      {message && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
            px-3 py-1.5 rounded-2xl rounded-bl-none bg-primary text-primary-foreground
            text-xs font-black shadow-lg shadow-primary/30 z-10"
        >
          {message}
          {/* triangle */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-[6px] border-l-transparent
            border-r-[6px] border-r-transparent
            border-t-[8px] border-t-primary" />
        </div>
      )}

      {/* sprite window */}
      <div
        className="w-full h-full overflow-hidden"
        style={{ position: 'relative' }}
      >
        <img
          src="/mascot/page-mascots.png"
          alt={page}
          style={spriteStyle}
          draggable={false}
        />
      </div>
    </div>
  )

  if (!float) return wrapper

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block' }}
    >
      {wrapper}
    </motion.div>
  )
}

/** Full sticker sheet — ใช้เป็น decoration */
export function MascotSheet({ className = '' }: { className?: string }) {
  return (
    <motion.img
      src="/mascot/mascot-stickers.png"
      alt="JOB mascot collection"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none pointer-events-none ${className}`}
      draggable={false}
    />
  )
}
