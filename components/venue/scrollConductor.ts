/**
 * Native-scroll conductor (TypeScript port of the skill's scroll-conductor.js).
 * Native scroll is the single source of truth: `exact` is recomputed on every
 * scroll event and is reproducible forward, backward, after jumps and reloads;
 * `smooth` is a frame-rate-independent damped copy used only for visuals.
 *
 * Unlike the reference (whole-page world), anchors are the scroll positions at
 * which each chapter block's top reaches the top of the sticky stage, so the
 * world finishes its journey when the opening ends and the page carries on.
 */

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

export type ConductorState = {
  exact: number
  smooth: number
  index: number // chapter owning the exact state
  direction: -1 | 0 | 1
}

export function createScrollConductor(opts: {
  chapters: HTMLElement[]
  stageOffset: () => number // px between viewport top and sticky stage top (fixed header)
  damping: number
  reducedMotion: boolean
}) {
  let anchors: number[] = []
  let exact = 0
  let smooth = 0
  let direction: -1 | 0 | 1 = 0
  let prevY = 0
  let widthAtMeasure = 0
  let reduce = opts.reducedMotion
  const last = opts.chapters.length - 1

  function measure() {
    widthAtMeasure = window.innerWidth
    const offset = opts.stageOffset()
    anchors = opts.chapters.map((el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset))
    anchors[0] = 0
    for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i]!, anchors[i - 1]! + 1)
  }

  function progressAt(y: number) {
    if (y <= anchors[0]!) return 0
    for (let i = 0; i < last; i++) {
      if (y <= anchors[i + 1]!) return i + clamp((y - anchors[i]!) / Math.max(1, anchors[i + 1]! - anchors[i]!), 0, 1)
    }
    return last
  }

  function read() {
    const y = window.scrollY
    const delta = y - prevY
    if (Math.abs(delta) > 0.25) direction = delta > 0 ? 1 : -1
    prevY = y
    const p = progressAt(y)
    // Reduced motion: snap to the nearest composed chapter frame (no in-between states).
    exact = reduce ? Math.round(p) : p
  }

  const onScroll = () => read()
  const onResize = () => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse && window.innerWidth === widthAtMeasure) return // ignore URL-bar height noise
    measure()
    read()
  }

  let ro: ResizeObserver | null = null

  return {
    start() {
      measure()
      prevY = window.scrollY
      read()
      smooth = exact
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
      window.addEventListener('pageshow', onResize)
      window.addEventListener('hashchange', onResize)
      ro = new ResizeObserver(() => {
        measure()
        read()
      })
      opts.chapters.forEach((c) => ro!.observe(c))
    },
    /** Advance the damped value; call once per rendered frame. */
    step(dt: number): ConductorState {
      smooth = reduce ? exact : damp(smooth, exact, opts.damping, Math.min(dt, 1 / 30))
      if (Math.abs(smooth - exact) < 1e-4) smooth = exact
      return { exact, smooth, index: clamp(Math.round(exact), 0, last), direction }
    },
    isSettled: () => smooth === exact,
    setReducedMotion(v: boolean) {
      reduce = v
      read()
      if (reduce) smooth = exact
    },
    stop() {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pageshow', onResize)
      window.removeEventListener('hashchange', onResize)
      ro?.disconnect()
      ro = null
    },
  }
}
