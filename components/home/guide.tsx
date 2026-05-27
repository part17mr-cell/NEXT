'use client'

import { motion } from 'framer-motion'
import { HelpCircle, MousePointer, ShoppingCart, CreditCard, Package } from 'lucide-react'
import { useStore } from '@/lib/store-context'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
}

const stepIcons = [MousePointer, ShoppingCart, CreditCard, Package]

export function HomeGuide() {
  const { settings } = useStore()

  if (!settings.visibility.homeGuide) return null

  return (
    <section id="guide" className="py-20 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            HOW TO ORDER
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">{settings.home.guideTitle}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{settings.home.guideSubtitle}</p>
        </motion.div>

        {/* Guide Steps */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {settings.home.guideSteps.map((step, index) => {
            const Icon = stepIcons[index] || HelpCircle
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative group"
              >
                {/* Connector line (hidden on last item and mobile) */}
                {index < settings.home.guideSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="relative p-6 rounded-2xl border border-border/50 bg-card/30 glass card-shine h-full gpu-accelerate">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {step[1]}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step[2]}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            มีคำถามเพิ่มเติม? <a href="/contact" className="text-primary font-semibold hover:underline">ติดต่อเราได้เลย</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
