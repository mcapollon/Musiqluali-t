'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function MagneticCTA({ children, radius = 80, dampen = 0.2 }: { children: ReactNode; radius?: number; dampen?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const reduced = useReducedMotion()
  const isTouch = useMediaQuery('(pointer: coarse)')

  if (reduced || isTouch) return <>{children}</>

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > radius) { x.set(0); y.set(0); return }
    x.set(dx * dampen)
    y.set(dy * dampen)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x, y }} className="inline-block">
      {children}
    </motion.div>
  )
}
