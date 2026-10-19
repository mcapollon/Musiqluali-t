'use client'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

export function ChapterMark({ number, title, as: As = 'h2' }: { number: string; title: string; as?: 'h2' | 'div' }) {
  const t = useTranslations('common')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className="flex items-baseline gap-4 md:gap-6">
      <As className="flex items-baseline gap-3 whitespace-nowrap font-normal">
        <span className="text-mono-micro text-bone-mute">{t('chapter')}</span>
        <span className="font-display text-3xl italic leading-none text-gold md:text-4xl">{number}</span>
        <span aria-hidden className="text-gold">—</span>
        <span className="text-mono-meta text-bone">{title}</span>
      </As>
      <motion.span
        aria-hidden
        className="h-px self-center bg-rule origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ flex: 1 }}
      />
    </div>
  )
}
