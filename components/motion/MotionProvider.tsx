'use client'
import { useEffect, useLayoutEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from '@/lib/i18n/navigation'
import { setLenis } from '@/lib/motion/lenis'
import { LENIS } from '@/lib/motion/tokens'
import { initMotion } from './motionSystem'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth scroll + the scroll scenes, for every page.
 *
 * Lenis runs on GSAP's ticker (one clock), so ScrollTrigger reads the same
 * scroll position Lenis just rendered. It stays off on touch (native momentum
 * is better there) and with reduced motion. Scenes are rebuilt per route.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const off = window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)')
    let lenis: Lenis | null = null
    const tick = (time: number) => lenis?.raf(time * 1000)

    const start = () => {
      if (off.matches || lenis) return
      lenis = new Lenis({
        ...LENIS,
        autoRaf: false,
        anchors: true, // honours each section's scroll-margin
        // Dialogs and sideways scrollers keep their own wheel.
        prevent: (node) => Boolean(node.closest('[role="dialog"], [data-lenis-prevent]')),
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      setLenis(lenis)
    }
    const stop = () => {
      if (!lenis) return
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenis = null
      setLenis(null)
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      // Scenes paint their opening frame from CSS under html[data-motion] (set pre-paint).
      if (reduce.matches) delete document.documentElement.dataset.motion
      else document.documentElement.dataset.motion = 'on'
      if (off.matches) stop()
      else start()
    }

    sync()
    off.addEventListener('change', sync)
    return () => {
      off.removeEventListener('change', sync)
      stop()
    }
  }, [])

  // Layout effect: hidden "from" states are applied before the new route paints.
  useLayoutEffect(() => {
    let mm = initMotion(document.body)
    let live = true
    const refresh = () => ScrollTrigger.refresh()
    // Late fonts change line breaks, so whether a scene fits its stage (motionSystem's fit check):
    // if they were still loading at first build, rebuild once they land. Late images only move triggers.
    if (document.fonts && document.fonts.status !== 'loaded') {
      void document.fonts.ready.then(() => {
        if (!live) return
        mm.revert()
        mm = initMotion(document.body)
      })
    }
    window.addEventListener('load', refresh)
    return () => {
      live = false
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [pathname])

  return <>{children}</>
}
