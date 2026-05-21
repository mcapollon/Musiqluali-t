'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function VinylDisc({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const spin = reduced
    ? {}
    : {
        animate: { rotate: 360 },
        transition: { duration: 24, repeat: Infinity, ease: 'linear' as const },
      }
  return (
    <motion.svg viewBox="0 0 400 400" className={className} {...spin} aria-hidden>
      <defs>
        <radialGradient id="vinyl-sheen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="195" fill="#0B0B0C" />
      <circle cx="200" cy="200" r="195" fill="url(#vinyl-sheen)" />
      {Array.from({ length: 36 }).map((_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={60 + i * 3.7}
          fill="none"
          stroke="rgba(242,235,221,0.06)"
          strokeWidth="0.5"
        />
      ))}
      <circle cx="200" cy="200" r="62" fill="#E3A23A" />
      <circle cx="200" cy="200" r="60" fill="#0B0B0C" />
      <circle cx="200" cy="200" r="55" fill="#E3A23A" />
      <text
        x="200"
        y="195"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="0.15em"
        fill="#0B0B0C"
      >
        MUSIQL·T
      </text>
      <text
        x="200"
        y="210"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="6"
        letterSpacing="0.2em"
        fill="#0B0B0C"
      >
        MTL · EST. 2017
      </text>
      <circle cx="200" cy="200" r="3" fill="#0B0B0C" />
    </motion.svg>
  )
}
