'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function EqualizerBars({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const bars = isMobile ? 24 : 48
  return (
    <div
      className={`flex items-end justify-between gap-[2px] w-full h-full ${className ?? ''}`}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (i * 37) % 9
        const tint = i % 3 === 0 ? 'bg-saffron/40' : 'bg-bone/15'
        return (
          <motion.span
            key={i}
            className={`flex-1 ${tint} rounded-t-sm`}
            initial={{ height: '12%' }}
            animate={
              reduced
                ? { height: `${20 + seed * 5}%` }
                : { height: ['12%', `${30 + seed * 7}%`, '20%', `${60 + seed * 4}%`, '15%'] }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    duration: 1.4 + seed * 0.15,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                    delay: i * 0.04,
                  }
            }
          />
        )
      })}
    </div>
  )
}
