'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = { bars?: number; active?: boolean; className?: string; label?: string }

export function Waveform({ bars = 24, active = false, className, label = 'Audio waveform' }: Props) {
  const reduced = useReducedMotion()
  return (
    <div role="img" aria-label={label} className={`flex items-end gap-[2px] h-6 ${className ?? ''}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2px] bg-saffron rounded-sm"
          initial={{ height: '20%' }}
          animate={
            reduced
              ? { height: active ? '60%' : '20%' }
              : active
              ? { height: ['20%', '90%', '40%', '70%', '30%'] }
              : { height: '20%' }
          }
          transition={
            reduced
              ? { duration: 0.2 }
              : active
              ? { duration: 0.9 + (i % 5) * 0.1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * 0.02 }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  )
}
