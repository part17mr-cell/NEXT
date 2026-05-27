'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, Shield, Loader2, Lock, Check, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const { register, settings } = useStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm_password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.username.trim()) {
      toast.error('กรุณากรอก Username')
      return
    }
    
    if (form.username.trim().length < 3) {
      toast.error('Username ต้องมีอย่างน้อย 3 ตัวอักษร')
      return
    }
    
    if (!form.password) {
      toast.error('กรุณากรอก Password')
      return
    }
    
    if (form.password !== form.confirm_password) {
      toast.error('Password ไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง')
      return
    }
    
    if (form.password.length < 6) {
      toast.error('Password ต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }
    
    setLoading(true)
    
    try {
      const success = await register(form.username, form.password)
      if (success) {
        router.push('/account')
      }
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    { icon: Shield, label: 'ปลอดภัย 100%', desc: 'ข้อมูลถูกเข้ารหัส' },
    { icon: Lock, label: 'ไม่มีข้อมูลเกิน', desc: 'ใช้แค่ Username' },
    { icon: Sparkles, label: 'สิทธิพิเศษ', desc: 'สำหรับสมาชิก' },
  ]

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 items-stretch"
        >
          {/* Left - Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit} 
            className="p-8 rounded-2xl border border-border/50 bg-card/50 glass order-2 md:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">สมัครสมาชิก</h2>
                <p className="text-sm text-muted-foreground">สร้างบัญชีใหม่ฟรี</p>
              </div>
            </div>
            
            <div className="space-y-5 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Username</Label>
                <Input
                  value={form.username}
                  onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="ใช้ a-z, 0-9, . _ -"
                  required
                  minLength={3}
                  maxLength={32}
                  autoComplete="username"
                  className="h-11 bg-secondary/30 border-border/50"
                />
                <p className="text-xs text-muted-foreground">อย่างน้อย 3 ตัวอักษร</p>
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
                    minLength={6}
                    autoComplete="new-password"
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
                <p className="text-xs text-muted-foreground">อย่างน้อย 6 ตัวอักษร</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">ยืนยัน Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirm_password}
                    onChange={e => setForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                    placeholder="ใส่ password อีกครั้ง"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="h-11 bg-secondary/30 border-border/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirm_password && form.password !== form.confirm_password && (
                  <p className="text-xs text-destructive">Password ไม่ตรงกัน</p>
                )}
                {form.confirm_password && form.password === form.confirm_password && (
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Password ตรงกัน
                  </p>
                )}
              </div>
            </div>
            
            <Button type="submit" className="w-full gap-2 h-11 font-semibold shadow-lg shadow-primary/20 group" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังสมัคร...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  สมัครสมาชิก
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
              มีบัญชีแล้ว?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                เข้าสู่ระบบ
              </Link>
            </p>
          </motion.form>
          
          {/* Right - Info */}
          <aside className="p-8 rounded-2xl border border-border/50 bg-card/30 glass card-shine order-1 md:order-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <Shield className="w-3.5 h-3.5" />
              MEMBER
            </span>
            
            <h1 className="text-3xl font-display font-bold tracking-tight mb-4">
              เข้าร่วม <span className="text-gradient">{settings.brand.storeName}</span>
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              สมัครสมาชิกด้วย Username และ Password เท่านั้น ไม่มีอีเมล ไม่มีข้อมูลเกินจำเป็น เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
            </p>
            
            {/* Benefits */}
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{benefit.label}</p>
                    <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  )
}
