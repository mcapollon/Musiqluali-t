'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ChapterMark({ number, title }: { number: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className="flex items-center gap-6">
      <span className="text-mono-meta text-bone-mute whitespace-nowrap">
        CH. {number} — {title}
      </span>
      <motion.span
        aria-hidden
        className="h-px bg-[color:var(--color-rule)] origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ flex: 1 }}
      />
    </div>
  )
}
