'use client'

import { motion } from 'framer-motion'
import { HomeHero } from '@/components/home/hero'
import { HomeCategories } from '@/components/home/categories'
import { HomeGuide } from '@/components/home/guide'

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HomeHero />
      <HomeCategories />
      <HomeGuide />
    </motion.div>
  )
}
