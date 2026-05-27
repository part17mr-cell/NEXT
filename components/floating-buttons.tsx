'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Package, X, ChevronRight, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export function FloatingButtons() {
  const { settings, cart, cartTotal, cartCount, updateCartItem, removeFromCart, clearCart, formatMoney } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const hasItems = cartCount > 0

  return (
    <>
      {/* Cart Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md border-border/50 flex flex-col p-0 bg-card">
          <SheetHeader className="p-5 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent">
            <SheetTitle className="text-left">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">เธ•เธฐเธเธฃเนเธฒเธชเธดเธเธเนเธฒ</div>
                  <p className="text-sm text-muted-foreground font-normal">{cartCount} เธฃเธฒเธขเธเธฒเธฃ - {formatMoney(cartTotal)}</p>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                    <Package className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="font-semibold text-foreground">เธ•เธฐเธเธฃเนเธฒเธงเนเธฒเธเน€เธเธฅเนเธฒ</p>
                  <p className="text-sm mt-1">เน€เธฅเธทเธญเธเธชเธดเธเธเนเธฒเธเธฒเธเธฃเนเธฒเธเธเนเธฒเธเธญเธเน€เธฃเธฒ</p>
                  <Link href="/store">
                    <Button variant="outline" className="mt-4 gap-2">
                      <Sparkles className="w-4 h-4" />เนเธเธฃเนเธฒเธเธเนเธฒ
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category} - {formatMoney(item.price)} / เธเธดเนเธ</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateCartItem(item.id, item.qty - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateCartItem(item.id, item.qty + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-bold text-primary">{formatMoney(item.price * item.qty)}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {cart.length > 0 && (
            <div className="border-t border-border/30 p-5 space-y-4 bg-card/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">เธฃเธงเธกเธ—เธฑเนเธเธซเธกเธ”</span>
                <motion.span key={cartTotal} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="text-2xl font-bold text-primary">
                  {formatMoney(cartTotal)}
                </motion.span>
              </div>
              <div className="grid gap-2">
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gap-2 font-semibold h-12 text-base shadow-lg shadow-primary/30">
                    <CreditCard className="w-5 h-5" />เธเธณเธฃเธฐเน€เธเธดเธ
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-destructive" onClick={clearCart}>
                  <Trash2 className="w-4 h-4 mr-2" />เธฅเนเธฒเธเธ•เธฐเธเธฃเนเธฒ
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* FAB โ€” เนเธชเธ”เธเน€เธเธเธฒเธฐเน€เธกเธทเนเธญเธกเธตเธชเธดเธเธเนเธฒเนเธเธ•เธฐเธเธฃเนเธฒ เนเธฅเธฐ sheet เธเธดเธ”เธญเธขเธนเน */}
      <AnimatePresence>
        {hasItems && !isOpen && (
          <motion.div
            key="cart-fab"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-4 sm:right-6 z-[100]"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl font-semibold shadow-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-primary/40 touch-manipulation"
            >
              {settings.icons?.cartIconUrl ? (
                <img src={settings.icons.cartIconUrl} alt="Cart" className="w-6 h-6 object-contain" />
              ) : (
                <ShoppingCart className="w-6 h-6" />
              )}
              <AnimatePresence mode="wait">
                <motion.div key={cartCount} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-start">
                  <span className="text-sm font-bold leading-tight">{cartCount} เธฃเธฒเธขเธเธฒเธฃ</span>
                  <span className="text-xs opacity-90 leading-tight">{formatMoney(cartTotal)}</span>
                </motion.div>
              </AnimatePresence>
              <ChevronRight className="w-4 h-4 opacity-60" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <span className="relative w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-black text-white leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <MiniCartNotification />
    </>
  )
}

function MiniCartNotification() {
  const { cart, cartCount, formatMoney, cartTotal } = useStore()
  const [showNotification, setShowNotification] = useState(false)
  const lastCountRef = useRef<number>(-1)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (lastCountRef.current !== -1 && cartCount > lastCountRef.current) {
      setShowNotification(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setShowNotification(false), 3000)
    }
    lastCountRef.current = cartCount
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [cartCount])

  if (!showNotification || cart.length === 0) return null
  const lastItem = cart[cart.length - 1]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30, x: 30 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -30 }}
        className="fixed top-24 right-4 sm:right-6 z-[99] max-w-sm"
      >
        <div className="bg-card border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
              <ShoppingCart className="w-6 h-6 text-emerald-500" />
            </motion.div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-emerald-500" />
              เน€เธเธดเนเธกเนเธเธ•เธฐเธเธฃเนเธฒเนเธฅเนเธง
            </p>
            <p className="text-sm font-semibold truncate mt-0.5">{lastItem?.name}</p>
            <p className="text-xs text-muted-foreground">เธฃเธงเธก {cartCount} เธฃเธฒเธขเธเธฒเธฃ - {formatMoney(cartTotal)}</p>
          </div>
          <button onClick={() => setShowNotification(false)} className="shrink-0 p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
