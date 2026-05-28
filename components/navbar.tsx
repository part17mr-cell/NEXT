'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, ShoppingBag, Headset, UserPlus, LogIn, User, LogOut, Settings, Sparkles } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navbar() {
  const pathname = usePathname()
  const { settings, currentMember, isAdmin, logout, adminLogout, orders } = useStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const pendingCount = isAdmin ? orders.filter(o => o.status === 'pending').length : 0

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'หน้าหลัก', icon: Home },
    { href: '/store', label: 'ร้านค้า', icon: ShoppingBag },
    { href: '/contact', label: 'ติดต่อ', icon: Headset },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-4 z-50 mx-auto max-w-6xl px-4"
    >
      <div className={`
        rounded-2xl border transition-all duration-500 ease-out
        ${scrolled 
          ? 'border-border/60 glass-strong shadow-xl shadow-black/10' 
          : 'border-border/40 glass'
        }
      `}>
        <div className="flex h-16 items-center justify-between px-5 gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center overflow-hidden shrink-0"
            >
              {settings.brand.logoUrl ? (
                <img src={settings.brand.logoUrl} alt={settings.brand.storeName} className="w-full h-full object-contain" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                </>
              )}
            </motion.div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-base tracking-tight">{settings.brand.storeName}</p>
              <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">{settings.brand.tagline}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 p-1.5 rounded-xl bg-secondary/50 border border-border/50">
            {navLinks.map(link => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                      ${active
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary rounded-lg"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Auth Nav */}
          <div className="hidden md:flex items-center gap-2">
            {currentMember ? (
              <>
                <Link href="/account">
                  <Button variant="ghost" size="sm" className="gap-2 font-semibold">
                    <User className="w-4 h-4" />
                    @{currentMember.username}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : isAdmin ? (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 font-semibold relative">
                    <Settings className="w-4 h-4" />
                    Admin
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={adminLogout} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="sm" className="gap-2 font-semibold shadow-lg shadow-primary/20">
                    <UserPlus className="w-4 h-4" />
                    สมัครสมาชิก
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="gap-2 font-semibold">
                    <LogIn className="w-4 h-4" />
                    เข้าสู่ระบบ
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 glass-strong border-border p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border/50">
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.brand.logoUrl ? (
                        <img src={settings.brand.logoUrl} alt={settings.brand.storeName} className="w-full h-full object-contain" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-display font-bold">{settings.brand.storeName}</p>
                      <p className="text-xs text-primary font-semibold uppercase tracking-wider">{settings.brand.tagline}</p>
                    </div>
                  </Link>
                </div>

                {/* Nav Links */}
                <div className="flex-1 p-4 space-y-1">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const active = isActive(link.href)
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                            ${active
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Auth Section */}
                <div className="p-4 border-t border-border/50 space-y-2">
                  {currentMember ? (
                    <>
                      <Link href="/account" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full justify-start gap-3 font-semibold">
                          <User className="w-5 h-5" />
                          @{currentMember.username}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground"
                        onClick={() => { logout(); setOpen(false) }}
                      >
                        <LogOut className="w-5 h-5" />
                        ออกจากระบบ
                      </Button>
                    </>
                  ) : isAdmin ? (
                    <>
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full justify-between gap-3 font-semibold">
                          <span className="flex items-center gap-3">
                            <Settings className="w-5 h-5" />
                            Admin Panel
                          </span>
                          {pendingCount > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                              {pendingCount > 9 ? '9+' : pendingCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground"
                        onClick={() => { adminLogout(); setOpen(false) }}
                      >
                        <LogOut className="w-5 h-5" />
                        ออกจากระบบ (แอดมิน)
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/register" onClick={() => setOpen(false)}>
                        <Button className="w-full justify-start gap-3 font-semibold shadow-lg shadow-primary/20">
                          <UserPlus className="w-5 h-5" />
                          สมัครสมาชิก
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full justify-start gap-3 font-semibold">
                          <LogIn className="w-5 h-5" />
                          เข้าสู่ระบบ
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  )
}
