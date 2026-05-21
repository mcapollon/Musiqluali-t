'use client'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const isTouch = useMediaQuery('(pointer: coarse)')
  const reduced = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (isTouch || reduced) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    lenisRef.current = lenis
    let raf = 0
    const tick = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [isTouch, reduced])

  return <>{children}</>
}
