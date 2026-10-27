'use client'
import { useEffect, useRef, useState } from 'react'
import { getImageProps } from 'next/image'
import { useTranslations } from 'next-intl'
import { Pause, Play } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { BilingualStack } from '@/components/editorial/BilingualStack'
import { Marquee } from '@/components/editorial/Marquee'
import { EqualizerBars } from '@/components/media/EqualizerBars'
import { GrainOverlay } from '@/components/media/GrainOverlay'
import { AmbientHeroPlayer } from '@/components/media/AmbientHeroPlayer'
import { buttonClass } from '@/components/primitives/buttonClass'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAudioStore } from '@/lib/audio/store'
import { artists } from '@/lib/mock/artists'
import { MOTION, type QualityTier } from '@/lib/venue/worldBible'
import { createScrollConductor } from './scrollConductor'
import type { VenueWorld } from './world'

/** Stage = viewport below the fixed 5rem header; each chapter is one stage tall. */
const STAGE_H = 'h-[calc(100svh-5rem)]'

// The fallback is the live renderer's chapter-0 frame, so the swap to WebGL is seamless.
const posterCommon = { alt: '', sizes: '100vw' }
const {
  props: { srcSet: posterWide },
} = getImageProps({ ...posterCommon, src: '/venue/poster-desktop.jpg', width: 1440, height: 820 })
const {
  props: { srcSet: posterTall, ...posterImg },
} = getImageProps({ ...posterCommon, src: '/venue/poster-mobile.jpg', width: 780, height: 1528 })

function pickTier(): QualityTier {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const constrained = (nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4
  const handheld = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
  if (handheld) return constrained ? 'low' : 'medium'
  return constrained ? 'medium' : 'high'
}

/**
 * three.js needs WebGL2, and a software rasteriser (no GPU, blocklisted driver)
 * would render the room on the main thread and stutter. Those devices keep the
 * poster and never fetch the 3D chunk.
 */
function canRenderWorld() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  } catch {
    return false
  }
}

/** Mean of the low/mid bins, 0..1: what makes the stage light breathe with the track. */
function audioLevel(analyser: AnalyserNode | null, buf: Uint8Array<ArrayBuffer> | null) {
  if (!analyser || !buf) return 0
  analyser.getByteFrequencyData(buf)
  const n = Math.floor(buf.length * 0.35)
  let sum = 0
  for (let i = 0; i < n; i++) sum += buf[i] ?? 0
  return sum / Math.max(1, n) / 255
}

/**
 * The home opening: one persistent Three.js room (Night n Key) behind three
 * chapters of real DOM copy. Native scroll moves the camera from the street
 * door, between the tables, to the band's stage. The poster and the copy are
 * the page; the 3D only enhances them and never blocks first paint.
 */
export function VenueHero() {
  const t = useTranslations('home.hero')
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [ambientOn, setAmbientOn] = useState(true)
  const ambientRef = useRef(true)
  const reducedRef = useRef(reduced)

  // The render loop reads these without restarting the world.
  useEffect(() => {
    ambientRef.current = ambientOn && !reduced
    reducedRef.current = reduced
  }, [ambientOn, reduced])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!section || !stage || !canvas) return

    let world: VenueWorld | null = null
    let disposed = false
    let raf = 0
    let last = 0
    let onScreen = true
    let buf: Uint8Array<ArrayBuffer> | null = null
    let bufFor: AnalyserNode | null = null

    const chapters = Array.from(section.querySelectorAll<HTMLElement>('[data-venue-chapter]'))
    const conductor = createScrollConductor({
      chapters,
      stageOffset: () => parseFloat(getComputedStyle(stage).top) || 0,
      damping: MOTION.damping,
      reducedMotion: reducedRef.current,
    })

    const loop = (now: number) => {
      raf = 0
      if (!world || disposed) return
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
      last = now
      conductor.setReducedMotion(reducedRef.current)
      const state = conductor.step(dt)
      const { ambientAnalyser, ambientPlaying } = useAudioStore.getState()
      const analyser = ambientPlaying && !reducedRef.current ? ambientAnalyser : null
      if (analyser && analyser !== bufFor) {
        buf = new Uint8Array(analyser.frequencyBinCount)
        bufFor = analyser
      }
      world.setAudioLevel(audioLevel(analyser, buf))
      world.frame(state.smooth, dt, ambientRef.current)
      schedule()
    }
    const schedule = () => {
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(loop)
    }
    const halt = () => {
      cancelAnimationFrame(raf)
      raf = 0
      last = 0
    }

    const resize = () => {
      if (!world) return
      const { width, height } = stage.getBoundingClientRect()
      world.resize(Math.round(width), Math.round(height))
    }
    const ro = new ResizeObserver(resize)

    // Only render while the opening is on screen and the tab is visible.
    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting)
      if (onScreen) schedule()
      else halt()
    })
    const onVisibility = () => (document.hidden ? halt() : schedule())

    const fine = window.matchMedia('(pointer: fine)')
    const onPointer = (e: PointerEvent) => {
      if (!fine.matches || reducedRef.current) return
      world?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }

    const onContextLost = (e: Event) => {
      e.preventDefault()
      halt()
      setReady(false) // the poster is underneath; the story stays whole
    }

    // ?venue-debug: QA in headless Chrome (software GL), boots at once, stats on window.__venue
    const debug = new URLSearchParams(location.search).has('venue-debug')

    async function boot() {
      if (!debug && !canRenderWorld()) return // the poster remains the hero
      performance.mark('venue:boot')
      try {
        const { createVenueWorld } = await import('./world')
        if (disposed) return
        const { width, height } = stage!.getBoundingClientRect()
        world = await createVenueWorld(canvas!, { mobile: width / Math.max(1, height) < 0.9, tier: pickTier() })
        if (disposed) {
          world.dispose()
          world = null
          return
        }
        resize()
        if (debug) Object.assign(window, { __venue: world })
        conductor.start()
        world.frame(conductor.step(1 / 60).smooth, 1 / 60, false)
        setReady(true)
        performance.measure('venue:ready', 'venue:boot')
        ro.observe(stage!)
        io.observe(section!)
        document.addEventListener('visibilitychange', onVisibility)
        window.addEventListener('pointermove', onPointer, { passive: true })
        canvas!.addEventListener('webglcontextlost', onContextLost)
        schedule()
      } catch {
        // No WebGL (or it failed to start): the poster remains the hero.
        world?.dispose()
        world = null
      }
    }

    // Facade: the poster *is* the chapter-0 frame, so the world boots on the
    // visitor's first sign of intent instead of competing with first paint.
    const INTENT = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'] as const
    let started = false
    const begin = () => {
      if (started) return
      started = true
      INTENT.forEach((type) => window.removeEventListener(type, begin))
      void boot()
    }
    INTENT.forEach((type) => window.addEventListener(type, begin, { passive: true }))
    // Restored at depth (reload, back/forward) or QA: start straight away.
    if (window.scrollY > 0 || debug) begin()

    return () => {
      disposed = true
      INTENT.forEach((type) => window.removeEventListener(type, begin))
      halt()
      conductor.stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      world?.dispose()
      world = null
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate bg-black text-white">
      {/* Sticky stage: the room stays put while the chapters scroll over it. */}
      <div ref={stageRef} className={`sticky top-20 ${STAGE_H} overflow-clip`}>
        <div role="img" aria-label={t('sceneLabel')} className="absolute inset-0">
          <picture>
            <source media="(min-aspect-ratio: 9/10)" srcSet={posterWide} />
            <source srcSet={posterTall} />
            <img
              {...posterImg}
              alt=""
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 size-full object-cover"
            />
          </picture>
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 size-full transition-opacity duration-1000 ease-gala ${ready ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        {/* Legibility where the copy sits (bottom-left), the room stays open above. */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/0" />
        <div aria-hidden className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black/55 to-black/0 md:w-2/3" />
        <GrainOverlay className="absolute inset-0 size-full" opacity={0.08} />

        <div className="section-pad-x absolute inset-x-0 top-0 z-20 flex flex-col items-start gap-3 pt-8 md:flex-row md:justify-between md:gap-4 md:pt-10">
          <p className="text-mono-meta text-white/70">{t('tag')}</p>
          <div className="flex items-center gap-3">
            <AmbientHeroPlayer label={t('nowPlaying')} />
            {!reduced && <EqualizerBars />}
          </div>
        </div>

        {ready && !reduced && (
          <button
            type="button"
            onClick={() => setAmbientOn((v) => !v)}
            aria-pressed={!ambientOn}
            className="section-pad-x absolute right-0 bottom-6 z-20 inline-flex items-center gap-2 text-mono-micro text-white/70 transition-colors hover:text-gold-bright"
          >
            {ambientOn ? <Pause className="size-3" aria-hidden /> : <Play className="size-3" aria-hidden />}
            {ambientOn ? t('scenePause') : t('scenePlay')}
          </button>
        )}
      </div>

      {/* Chapters: real copy in document order. Each block's arrival drives the camera. */}
      <div className="pointer-events-none relative z-10 -mt-[calc(100svh-5rem)]">
        <div data-venue-chapter="threshold" className={`section-pad-x flex ${STAGE_H} items-end pb-20 md:pb-24`}>
          <div className="pointer-events-auto max-w-6xl">
            <BilingualStack
              fr={t('headlineFr')}
              en={t('headlineEn')}
              emFr={t('headlineEmFr')}
              emEn={t('headlineEmEn')}
              tone="stage"
            />
          </div>
        </div>

        <div data-venue-chapter="house" className={`section-pad-x flex ${STAGE_H} items-end pb-20 md:pb-24`}>
          <p className="text-lede max-w-xl text-white/85">{t('subhead')}</p>
        </div>

        <div data-venue-chapter="stage" className={`section-pad-x flex ${STAGE_H} flex-col justify-end gap-12 pb-16 md:pb-20`}>
          <div className="pointer-events-auto flex flex-wrap items-center gap-x-10 gap-y-4">
            <Link href="/apply" className={buttonClass({ size: 'lg' })}>
              {t('ctaApply')}
            </Link>
            <a href="#next-show" className={buttonClass({ variant: 'link', className: 'text-white' })}>
              {t('ctaNextShow')} <span aria-hidden>→</span>
            </a>
          </div>
          <div className="pointer-events-auto">
            <Marquee
              ariaLabel={t('marqueeLabel')}
              items={artists.map((a) => ({ label: a.name, meta: a.genre }))}
              className="text-white"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
