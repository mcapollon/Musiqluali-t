'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Wordmark } from './Wordmark'
import { INTRO_STORAGE_KEY } from './logoIntroScript'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const SWEEP_EASE = 'cubic-bezier(0.45, 0, 0.2, 1)'
const CURTAIN_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)' // power4.inOut, as EASE.curtain in lib/motion/tokens.ts

// Timeline (ms from navigation start). Keep FLY_AT in sync with --reveal-delay in globals.css.
const SWEEP_AT = 350
const SWEEP_MS = 1300
const FLY_AT = 2050 // logo holds on its own for a beat before the hand-off
const FLY_MS = 1100

/** Native Web Animations API: no library, transform/opacity only, holds its end state. */
function play(el: HTMLElement, keyframes: Keyframe[], opts: KeyframeAnimationOptions) {
  return el.animate(keyframes, { fill: 'forwards', ...opts })
}
const WORDMARK_SIZE = 'text-[clamp(3.25rem,13vw,11rem)] pb-[0.15em]'

/**
 * The overture: "Ce soir" on black, a count from 00 to 100 and a gold
 * hairline filling as the house settles (all CSS, from first paint), a band
 * of light crosses the wordmark, then the curtain parts in two as the mark
 * glides into the header. ≈ 3.2 s,
 * skippable by any click, key, wheel or touch, once per session, never with
 * reduced motion (gated by INTRO_SCRIPT before first paint). CSS failsafes in
 * globals.css clear it after 5 s if this script never runs.
 */
export function LogoIntro() {
  const t = useTranslations('home.overture')
  const overlayRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const furnitureRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const bandInnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const overlay = overlayRef.current
    const left = leftRef.current
    const right = rightRef.current
    const furniture = furnitureRef.current
    const mark = markRef.current
    const band = bandRef.current
    const bandInner = bandInnerRef.current
    if (root.dataset.intro !== 'play' || !overlay || !left || !right || !furniture || !mark || !band || !bandInner) return

    const controls: Animation[] = []
    const timers: number[] = []
    let done = false
    const events = ['keydown', 'wheel', 'touchstart', 'pointerdown'] as const

    const finish = () => {
      if (done) return
      done = true
      controls.forEach((c) => c.pause())
      timers.forEach((t) => window.clearTimeout(t))
      events.forEach((e) => window.removeEventListener(e, skip))
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
      } catch {
        // Private mode / blocked storage: the intro may replay; harmless.
      }
      root.dataset.intro = 'done'
    }

    function skip() {
      if (done) return
      controls.forEach((c) => c.pause())
      timers.forEach((t) => window.clearTimeout(t))
      controls.push(play(overlay!, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 }))
      timers.push(window.setTimeout(finish, 300))
    }
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }))

    // The timeline is anchored to navigation start, not hydration, so a slow
    // phone shortens the opening instead of lengthening it.
    // 1. Fade up on black: pure CSS (.logo-intro-mark), already running since first paint.
    const elapsed = Math.min(performance.now(), 1400)
    // 2. A band of light crosses the letters (window moves right, its contents counter-move: transform only).
    if (elapsed < 1200) {
      const sweep = { duration: SWEEP_MS, delay: Math.max(0, SWEEP_AT - elapsed), easing: SWEEP_EASE }
      controls.push(play(band, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(286%)' }], sweep))
      controls.push(play(bandInner, [{ transform: 'translateX(35%)' }, { transform: 'translateX(-100%)' }], sweep))
    }
    // 3. Hand-off: the mark flies into the header while the room lights come up.
    const flyAt = Math.max(0, FLY_AT - elapsed)
    timers.push(
      window.setTimeout(() => {
        const target = document.querySelector<HTMLElement>('[data-wordmark-target]')
        const from = mark.getBoundingClientRect()
        if (target && from.width > 0) {
          const to = target.getBoundingClientRect()
          const moveTo = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`
          controls.push(play(mark, [{ transform: 'none' }, { transform: moveTo }], { duration: FLY_MS, easing: EASE }))
        } else {
          controls.push(play(mark, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 }))
        }
        // The curtain parts on the room; the count and hairline bow out first.
        const part = { duration: FLY_MS, easing: CURTAIN_EASE }
        controls.push(play(furniture, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 }))
        controls.push(play(left, [{ transform: 'none' }, { transform: 'translateX(-101%)' }], part))
        controls.push(play(right, [{ transform: 'none' }, { transform: 'translateX(101%)' }], part))
      }, flyAt),
    )
    timers.push(window.setTimeout(finish, flyAt + FLY_MS + 50))

    return () => {
      controls.forEach((c) => c.cancel())
      timers.forEach((t) => window.clearTimeout(t))
      events.forEach((e) => window.removeEventListener(e, skip))
    }
  }, [])

  return (
    <div ref={overlayRef} aria-hidden className="logo-intro fixed inset-0 z-100 place-items-center">
      {/* Two halves of the house curtain; a thin gold seam where they meet. */}
      <div ref={leftRef} className="absolute inset-y-0 left-0 w-1/2 border-r border-gold/30 bg-black" />
      <div ref={rightRef} className="absolute inset-y-0 right-0 w-1/2 border-l border-gold/30 bg-black" />
      {/* Count, label and hairline: CSS from first paint (.logo-intro-count/-bar), done by the hand-off. */}
      <div ref={furnitureRef} className="section-pad-x absolute inset-x-0 bottom-10 md:bottom-14">
        <div className="flex items-end justify-between gap-6 pb-5">
          <p className="text-mono-meta text-white/70">
            {t('tonight')} <span className="text-white/40">· {t('doors')}</span>
          </p>
          <p className="logo-intro-count text-figures text-5xl leading-none text-gold md:text-7xl" />
        </div>
        <div className="h-px bg-rule">
          <div className="logo-intro-bar h-full origin-left bg-gold" />
        </div>
      </div>
      {/* Outer: flies to the header (JS). Inner: fades up (CSS). Kept apart so the two transforms never fight. */}
      <div ref={markRef} className="relative inline-block" style={{ transformOrigin: '0 0' }}>
        <div className="logo-intro-mark relative">
          <Wordmark className={`${WORDMARK_SIZE} block whitespace-nowrap`} />
          <div
            ref={bandRef}
            className="absolute inset-y-0 left-0 w-[35%] overflow-hidden mask-[linear-gradient(90deg,transparent,black_45%,black_55%,transparent)]"
            style={{ transform: 'translateX(-100%)' }}
          >
            <div ref={bandInnerRef} className="absolute inset-y-0 left-0 w-[285.72%]" style={{ transform: 'translateX(35%)' }}>
              <Wordmark tone="light" className={`${WORDMARK_SIZE} block whitespace-nowrap`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
