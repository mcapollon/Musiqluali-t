'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type Props = { sources: { src: string; alt: string }[]; intervalMs?: number; className?: string }

export function KenBurnsImage({ sources, intervalMs = 6000, className }: Props) {
  const reduced = useReducedMotion()
  const isTouch = useMediaQuery('(pointer: coarse)')
  const disabled = reduced || isTouch
  const [idx, setIdx] = useState(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // next-themes SSR hydration guard: intentional one-shot setState on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  const isLight = mounted && resolvedTheme === 'light'

  useEffect(() => {
    if (disabled) return
    const t = setInterval(() => setIdx((i) => (i + 1) % sources.length), intervalMs)
    return () => clearInterval(t)
  }, [disabled, intervalMs, sources.length])

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="sync">
        {sources.map((s, i) =>
          i === idx ? (
            <motion.div
              key={s.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLight ? 0.55 : 0.4, scale: disabled ? 1 : 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.1 }, scale: { duration: intervalMs / 1000, ease: 'linear' } }}
              className="absolute inset-0"
              style={{ mixBlendMode: isLight ? 'multiply' : 'screen' }}
            >
              <Image src={s.src} alt={s.alt} fill className="object-cover" priority={i === 0} sizes="100vw" />
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>
    </div>
  )
}
