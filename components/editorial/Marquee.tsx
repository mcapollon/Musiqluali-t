'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = { items: { label: string; meta?: string }[]; speed?: number; ariaLabel: string }

export function Marquee({ items, speed = 40, ariaLabel }: Props) {
  const reduced = useReducedMotion()
  const doubled = [...items, ...items]
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className="relative overflow-hidden border-y border-[color:var(--color-rule)] py-4"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap [&:hover]:[animation-play-state:paused] [&:hover_*]:[animation-play-state:paused]"
        {...(reduced
          ? {}
          : {
              animate: { x: ['0%', '-50%'] },
              transition: { duration: speed, repeat: Infinity, ease: 'linear' },
            })}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-display-m text-bone tracking-tight">
            {item.label}
            {item.meta && (
              <span className="ml-3 text-mono-meta text-bone-mute align-middle">{item.meta}</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
