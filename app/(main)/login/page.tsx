'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, LogIn, Check, Loader2, Sparkles, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mascot } from '@/components/mascot'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account'
  
  const { login, adminLogin, settings } = useStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.username.trim()) {
      toast.error('กรุณากรอก Username')
      return
    }
    
    if (!form.password) {
      toast.error('กรุณากรอก Password')
      return
    }
    
    setLoading(true)
    
    try {
      // Try admin login first
      if (adminLogin(form.username, form.password)) {
        router.push(next === '/account' ? '/admin' : next)
        return
      }
      
      // Then try member login
      const success = await login(form.username, form.password)
      if (success) {
        router.push(next)
      }
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'ดูประวัติออเดอร์ย้อนหลัง',
    'ติดตามสถานะแบบ Real-time',
    'รับการแจ้งเตือนอัตโนมัติ',
    'สิทธิพิเศษสำหรับสมาชิก',
  ]

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 items-stretch"
        >
          {/* Left - Info */}
          <aside className="p-8 rounded-2xl border border-border/50 bg-card/30 glass card-shine relative overflow-visible">
            {/* mascot */}
            <div className="absolute -top-16 right-4">
              <Mascot page="login" size={140} message="กลับมาแล้วเหรอ!" float />
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <Shield className="w-3.5 h-3.5" />
              SECURE LOGIN
            </span>
            
            <h1 className="text-3xl font-display font-bold tracking-tight mb-4">
              ยินดีต้อนรับกลับสู่ <span className="text-gradient">{settings.brand.storeName}</span>
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              เข้าสู่ระบบเพื่อจัดการออเดอร์ ดูประวัติการซื้อ และรับสิทธิพิเศษสำหรับสมาชิก
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Decorative element */}
            <div className="mt-10 p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-semibold">Note:</span> Admin และ Member ใช้หน้า Login เดียวกัน ระบบจะนำทางอัตโนมัติ
              </p>
            </div>
          </aside>
          
          {/* Right - Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} 
            className="p-8 rounded-2xl border border-border/50 bg-card/50 glass"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">เข้าสู่ระบบ</h2>
                <p className="text-sm text-muted-foreground">กรอก Username ที่สมัครไว้</p>
              </div>
            </div>
            
            <div className="space-y-5 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Username</Label>
                <Input
                  value={form.username}
                  onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="ใส่ username ของคุณ"
                  required
                  autoComplete="username"
                  className="h-11 bg-secondary/30 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="ใส่ password ของคุณ"
                    required
                    autoComplete="current-password"
                    className="h-11 bg-secondary/30 border-border/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full gap-2 h-11 font-semibold shadow-lg shadow-primary/20 group" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card/50 px-3 text-muted-foreground">หรือ</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              ยังไม่มีบัญชี?{' '}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                สมัครสมาชิกฟรี
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
