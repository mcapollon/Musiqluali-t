import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToY } from '@/lib/motion/lenis'
import { DURATION, EASE, OFFSET, REVEAL_START, SCRUB, STAGGER } from '@/lib/motion/tokens'

gsap.registerPlugin(ScrollTrigger)
// Phones: the URL bar showing/hiding must not re-measure every pinned scene.
ScrollTrigger.config({ ignoreMobileResize: true })

/*
 * The site's motion system: one module, driven by data attributes, so
 * sections (server components included) opt in with markup alone.
 *
 * Pinned scenes (built in document order: each pin's spacer moves every trigger below it)
 *   data-scene="iris"        the opening: a spotlight opens on the footage while the title parts
 *   data-scene="statement"   sentences rise one after another in a held frame
 *   data-scene="steps"       steps take turns in one frame (numeral + progress rail)
 *   data-scene="credits"     lines roll up like end credits; the one at centre is lit
 *   data-gallery (+ -pin, -viewport, -track, -item, -media, -progress(-bar))   a wall walked sideways (desktop)
 *
 * Scroll-linked (scrubbed)
 *   data-sweep               a follow spot crosses a word (.light-sweep)
 *   data-lights              a section opens from a thin slit of light
 *   data-motion-text="read"  words brighten as they are read (0.55 floor keeps 3:1)
 *   data-parallax="5"        media drifts ±n% inside its frame
 *   data-progress-scene      a poster opens to full bleed as it is scrolled in
 *   data-footer-reveal > data-footer-inner   the footer rises from behind the page
 *   data-scroll-progress     page progress hairline
 *
 * Played once on entry
 *   data-motion-text="words" words (.motion-word, rendered by DisplayHeading) rise out of a mask
 *   data-reveal="fade-up|blur-in|scale"   one block (data-reveal-delay in s)
 *   data-reveal-group > data-reveal-item  items in reading order
 *   data-image-reveal        a frame opens like a curtain rising
 *   data-count="6100"        a figure counts up to its value
 *
 * Navigation state (kept with reduced motion)
 *   [data-act][id] sections + [data-act-link=id]   aria-current on the act being watched
 *
 * Content is visible without JS and with reduced motion: tweens set their
 * hidden "from" state only when they are created; the few opening frames
 * painted by CSS live under html[data-motion] in globals.css.
 */

const all = <T extends Element = HTMLElement>(root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector))

const blur = (px: number) => `blur(${px}px)`

/**
 * Screens tall enough to hold a pinned scene (same query as the CSS opening
 * frames in globals.css). Shorter screens (small phones, landscape) get every
 * act in normal flow; so does any scene whose content measures taller than
 * the stage (marked [data-flow]).
 */
const STAGE_QUERY = '(min-height: 600px)'

/**
 * Masked words park below their mask, so no sliver shows. The mask is the word's line
 * box plus 0.3em for descenders (DisplayHeading, RiseWords): at most 1.3x the word's own
 * height at the tightest display line-height, so 150% always clears it.
 */
const PARKED = 150

/** Pinned scenes hold just under the fixed 5rem header. */
const stageTop = () => parseFloat(getComputedStyle(document.documentElement).fontSize) * 5
const pinAt = () => `top ${stageTop()}px`

const PRESETS: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  'fade-up': { from: { y: OFFSET.rise, autoAlpha: 0 }, to: { y: 0, autoAlpha: 1 } },
  'blur-in': { from: { y: 18, autoAlpha: 0, filter: blur(OFFSET.blur) }, to: { y: 0, autoAlpha: 1, filter: blur(0) } },
  scale: { from: { scale: 0.96, autoAlpha: 0 }, to: { scale: 1, autoAlpha: 1 } },
}

const once = (trigger: Element, start = REVEAL_START): ScrollTrigger.Vars => ({ trigger, start, once: true })

/* ─── Pinned scenes ─────────────────────────────────────────────────────── */

function iris(scene: HTMLElement) {
  const media = scene.querySelector('[data-iris-media]')
  const zoom = scene.querySelector('[data-iris-zoom]')
  const shade = scene.querySelector('[data-iris-shade]')
  const copy = scene.querySelector<HTMLElement>('[data-iris-copy]')
  const lineA = scene.querySelector('[data-iris-line="a"]')
  const lineB = scene.querySelector('[data-iris-line="b"]')
  const cue = scene.querySelector('[data-iris-cue]')
  if (!media || !copy) return

  // The spot: a radial mask (globals.css) with a soft edge around radius --iris-r. Same radii as the
  // original hard circle: start = the CSS first frame, end = past the frame's corners (+ the widest
  // soft band, 36px, so no vignette is left). In px so they interpolate.
  const r0 = () => Math.min(window.innerHeight * 0.17, window.innerWidth * 0.3)
  const r1 = () => Math.hypot(scene.clientWidth, scene.clientHeight) / 2 + 24 + 36

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: pinAt,
      end: '+=140%',
      pin: true,
      scrub: SCRUB.tight,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
  tl.fromTo(
    scene,
    { '--iris-r': () => `${r0()}px` },
    { '--iris-r': () => `${r1()}px`, ease: 'power2.in', duration: 1 },
    0,
  )
  if (zoom) tl.fromTo(zoom, { scale: 1.35 }, { scale: 1, ease: EASE.scrub, duration: 1 }, 0)
  if (lineA) tl.to(lineA, { yPercent: -140, autoAlpha: 0, ease: 'power1.in', duration: 0.55 }, 0)
  if (lineB) tl.to(lineB, { yPercent: 140, autoAlpha: 0, ease: 'power1.in', duration: 0.55 }, 0)
  if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.1 }, 0)
  if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 1, ease: EASE.scrub, duration: 0.4 }, 0.6)
  // Opacity, not visibility: the links stay reachable by keyboard while the stage opens.
  tl.fromTo(copy, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.75)

  // Tabbing into the copy before it has arrived jumps to the open stage.
  const onFocus = () => {
    const st = tl.scrollTrigger
    if (st && st.progress < 1) scrollToY(st.end)
  }
  copy.addEventListener('focusin', onFocus)
  const cleanups = [() => copy.removeEventListener('focusin', onFocus)]
  if (window.matchMedia('(pointer: fine)').matches) cleanups.push(followSpot(scene, tl))
  return () => cleanups.forEach((c) => c())
}

/**
 * The follow spot: on a mouse, the spot tracks the pointer, a beat behind, like
 * an operator finding the performer. As the stage opens it glides back to the
 * centre (fully centred by 60% of the opening), so the opening radius, sized
 * from the centre, still clears every corner. Touch and keyboard: centred.
 */
function followSpot(scene: HTMLElement, tl: gsap.core.Timeline) {
  const aim = { x: 0, y: 0 } // px from the frame's centre
  const render = () => {
    const k = 1 - gsap.utils.clamp(0, 1, tl.progress() / 0.6)
    scene.style.setProperty('--iris-x', `calc(50% + ${(aim.x * k).toFixed(1)}px)`)
    scene.style.setProperty('--iris-y', `calc(50% + ${(aim.y * k).toFixed(1)}px)`)
  }
  const follow = { duration: 0.7, ease: 'power3.out', onUpdate: render }
  const xTo = gsap.quickTo(aim, 'x', follow)
  const yTo = gsap.quickTo(aim, 'y', follow)
  const onMove = (e: PointerEvent) => {
    const r = scene.getBoundingClientRect()
    xTo(e.clientX - r.left - r.width / 2)
    yTo(e.clientY - r.top - r.height / 2)
  }
  const onLeave = () => {
    xTo(0)
    yTo(0)
  }
  scene.addEventListener('pointermove', onMove)
  scene.addEventListener('pointerleave', onLeave)
  tl.eventCallback('onUpdate', render) // scroll pulls it home as the stage opens
  return () => {
    scene.removeEventListener('pointermove', onMove)
    scene.removeEventListener('pointerleave', onLeave)
    scene.style.removeProperty('--iris-x')
    scene.style.removeProperty('--iris-y')
  }
}

/** Words of a scene-mode heading rise once as it enters (also the flow fallback). */
function riseOnce(block: Element) {
  gsap.fromTo(
    block.querySelectorAll('.motion-word'),
    { yPercent: PARKED },
    {
      yPercent: 0,
      duration: DURATION.text,
      ease: EASE.enter,
      stagger: STAGGER.word * 1.4,
      scrollTrigger: once(block, 'top 85%'),
    },
  )
}

const fadeUpOnce = (el: Element) =>
  gsap.fromTo(el, PRESETS['fade-up']!.from, {
    ...PRESETS['fade-up']!.to,
    duration: DURATION.block,
    ease: EASE.enter,
    clearProps: 'transform',
    scrollTrigger: once(el),
  })

function statement(scene: HTMLElement) {
  const [first, ...rest] = all(scene, '[data-statement]')
  const body = scene.querySelector('[data-statement-body]')
  // The first sentence is already up when the frame arrives: no empty frame on entry.
  if (first) riseOnce(first)
  const tl = gsap.timeline({
    scrollTrigger: { trigger: scene, start: pinAt, end: '+=100%', pin: true, scrub: SCRUB.tight, anticipatePin: 1 },
  })
  rest.forEach((block, i) => {
    tl.fromTo(
      block.querySelectorAll('.motion-word'),
      { yPercent: PARKED },
      { yPercent: 0, ease: 'power2.out', stagger: 0.06, duration: 0.4 },
      i === 0 ? 0.05 : '+=0.15',
    )
  })
  if (body) tl.fromTo(body, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, '+=0.1')
  tl.to({}, { duration: 0.25 }) // hold the finished frame before releasing the pin
}

function steps(scene: HTMLElement) {
  const items = all(scene, '[data-steps] > *')
  const nums = all(scene, '[data-step-nums] > *')
  const rail = scene.querySelector('[data-steps-rail]')
  if (items.length < 2) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: pinAt,
      end: `+=${(items.length - 1) * 90}%`,
      pin: true,
      scrub: SCRUB.tight,
      anticipatePin: 1,
    },
  })
  if (rail) tl.fromTo(rail, { scaleY: 1 / items.length }, { scaleY: 1, ease: EASE.scrub, duration: items.length - 1 }, 0)
  for (let i = 1; i < items.length; i++) {
    const at = i - 1 + 0.3
    // Opacity only: screen readers keep every step.
    // The outgoing step has left before the next arrives: no ghosted titles mid-scroll.
    tl.to(items[i - 1]!, { opacity: 0, y: -40, duration: 0.3 }, at)
    tl.fromTo(items[i]!, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, at + 0.32)
    if (nums[i] && nums[i - 1]) {
      tl.to(nums[i - 1]!, { yPercent: -100, opacity: 0, duration: 0.5 }, at)
      tl.fromTo(nums[i]!, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, at)
    }
  }
  tl.to({}, { duration: 0.3 })
}

function credits(scene: HTMLElement) {
  const list = scene.querySelector<HTMLElement>('[data-credits-list]')
  if (!list) return
  const lines = all(list, '[data-credit]')
  const H = list.offsetHeight
  const vh = scene.clientHeight
  const y0 = vh * 0.55
  const y1 = -(H - vh * 0.45)

  const tl = gsap.timeline({
    scrollTrigger: { trigger: scene, start: pinAt, end: `+=${H}`, pin: true, scrub: SCRUB.tight, anticipatePin: 1 },
  })
  tl.fromTo(list, { y: y0 }, { y: y1, ease: EASE.scrub, duration: 1 }, 0)
  // Each line is lit while it crosses the frame's centre line.
  const w = 0.07
  for (const line of lines) {
    const centre = line.offsetTop + line.offsetHeight / 2
    const p = gsap.utils.clamp(0, 1, (vh / 2 - centre - y0) / (y1 - y0))
    tl.fromTo(line, { opacity: 0.18 }, { opacity: 1, ease: EASE.scrub, duration: w }, Math.max(0, p - w))
    if (line !== lines[lines.length - 1]) tl.to(line, { opacity: 0.18, ease: EASE.scrub, duration: w }, p + 0.01)
  }
}

/**
 * Desktop only (wide + fine pointer): the wall pins and vertical scroll walks
 * it sideways. Elsewhere it stays a native sideways scroller. Keyboard focus
 * on a card moves the page to the scroll position that shows it.
 */
function gallery(section: HTMLElement) {
  const pin = section.querySelector<HTMLElement>('[data-gallery-pin]')
  const viewport = section.querySelector<HTMLElement>('[data-gallery-viewport]')
  const track = section.querySelector<HTMLElement>('[data-gallery-track]')
  if (!pin || !viewport || !track) return
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
  if (distance() < 8) return

  gsap.set(viewport, { overflowX: 'hidden' })
  viewport.scrollLeft = 0
  const media = all(track, '[data-gallery-media]')
  const progress = section.querySelector('[data-gallery-progress]')
  const bar = progress?.querySelector('[data-gallery-progress-bar]')
  if (progress) gsap.set(progress, { autoAlpha: 1 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: SCRUB.tight,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
  tl.to(track, { x: () => -distance(), ease: EASE.scrub }, 0)
  if (media.length) tl.fromTo(media, { xPercent: 6, scale: 1.14 }, { xPercent: -6, scale: 1.14, ease: EASE.scrub }, 0)
  if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: EASE.scrub }, 0)

  const onFocus = (e: FocusEvent) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('[data-gallery-item]')
    const st = tl.scrollTrigger
    if (!item || !st) return
    const d = distance()
    const x = gsap.utils.clamp(0, d, item.offsetLeft - (parseFloat(getComputedStyle(track).paddingLeft) || 0))
    scrollToY(st.start + (d ? x / d : 0) * (st.end - st.start))
    // Focus may have nudged the clipped viewport sideways; the transform owns that axis.
    requestAnimationFrame(() => (viewport.scrollLeft = 0))
  }
  section.addEventListener('focusin', onFocus)
  return () => section.removeEventListener('focusin', onFocus)
}

/**
 * A scene pins only if its content fits the stage (the viewport under the
 * header), measured with the scene in its pinned layout (CSS opening frame).
 * The opening also needs its title clear of its top bar (the title is centred
 * over the frame, so a short frame would put one on the other).
 */
function fitsStage(scene: HTMLElement) {
  const stage = Math.max(scene.clientHeight, window.innerHeight - stageTop())
  if (scene.scrollHeight > stage + 2) return false
  const bar = scene.querySelector('[data-iris-bar]')
  const title = scene.querySelector('[data-iris-line="a"]')
  if (bar && title) return title.getBoundingClientRect().top >= bar.getBoundingClientRect().bottom - 2
  return true
}

/** The same act in normal flow: things arrive as they scroll in; nothing pins or clips. */
function flow(scene: HTMLElement) {
  const kind = scene.dataset.scene
  if (kind === 'statement') {
    all(scene, '[data-statement]').forEach(riseOnce)
    const body = scene.querySelector('[data-statement-body]')
    if (body) fadeUpOnce(body)
  } else if (kind === 'steps') {
    all(scene, '[data-steps] > *').forEach(fadeUpOnce)
  }
  // iris: the full shot with the title and copy over it, as written.
}

/** All pinned scenes, in document order. Returns listener cleanups. */
function scenes(root: HTMLElement, wide: boolean, stage: boolean) {
  const cleanups: (() => void)[] = []
  for (const el of all(root, '[data-scene], [data-gallery]')) {
    let cleanup: (() => void) | undefined
    if (el.hasAttribute('data-gallery')) {
      if (wide) cleanup = gallery(el)
    } else if (el.dataset.scene === 'credits') {
      credits(el) // a roll: built to run past its frame, at any height
    } else {
      // Measure in the pinned layout; fall back to flow if the content would be clipped.
      delete el.dataset.flow
      if (stage && !fitsStage(el)) el.dataset.flow = ''
      if (!stage || el.hasAttribute('data-flow')) {
        flow(el)
        continue
      }
      const kind = el.dataset.scene
      if (kind === 'iris') cleanup = iris(el)
      else if (kind === 'statement') statement(el)
      else if (kind === 'steps') steps(el)
    }
    if (cleanup) cleanups.push(cleanup)
  }
  return cleanups
}

/* ─── Scroll-linked ─────────────────────────────────────────────────────── */

function sweeps(root: HTMLElement) {
  for (const el of all(root, '[data-sweep]')) {
    gsap.fromTo(
      el,
      { backgroundPosition: '100% 0' },
      {
        backgroundPosition: '0% 0',
        ease: EASE.scrub,
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: SCRUB.tight },
      },
    )
  }
}

function lights(root: HTMLElement) {
  for (const el of all(root, '[data-lights]')) {
    gsap.fromTo(
      el,
      { clipPath: 'inset(48% 0% 48% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: SCRUB.tight },
      },
    )
  }
}

function readText(root: HTMLElement) {
  for (const el of all(root, '[data-motion-text="read"]')) {
    // In ivory acts, gold emphasis stays lit (full contrast), and ink dims less.
    const ivory = Boolean(el.closest('.theme-ivory'))
    const words = all(el, '.motion-word').filter((w) => !(ivory && w.querySelector('em')))
    if (!words.length) continue
    gsap.fromTo(
      words,
      { opacity: ivory ? 0.7 : 0.55 },
      {
        opacity: 1,
        ease: EASE.scrub,
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: SCRUB.tight },
      },
    )
  }
}

/** `skipGallery`: inside a pinned gallery the gallery's own timeline drifts the media sideways. */
function parallax(root: HTMLElement, skipGallery: boolean) {
  for (const layer of all(root, '[data-parallax]')) {
    if (skipGallery && layer.closest('[data-gallery]')) continue
    const frame = layer.parentElement ?? layer
    const amount = Number(layer.dataset.parallax || 5)
    gsap.fromTo(
      layer,
      { yPercent: -amount, scale: 1.12 },
      {
        yPercent: amount,
        scale: 1.12,
        ease: EASE.scrub,
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: SCRUB.calm },
      },
    )
  }
}

function progressScenes(root: HTMLElement) {
  for (const scene of all(root, '[data-progress-scene]')) {
    gsap.fromTo(
      scene,
      { clipPath: 'inset(8% 5% 8% 5%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: EASE.scrub,
        scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top 30%', scrub: SCRUB.tight },
      },
    )
  }
}

function footerReveal(root: HTMLElement) {
  for (const footer of all(root, '[data-footer-reveal]')) {
    const inner = footer.querySelector('[data-footer-inner]')
    if (!inner) continue
    gsap.fromTo(
      inner,
      { yPercent: -30, autoAlpha: 0.4 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: EASE.scrub,
        // clamp(): on a page too short to scroll, the footer simply sits in place.
        scrollTrigger: { trigger: footer, start: 'clamp(top bottom)', end: 'clamp(bottom bottom)', scrub: SCRUB.tight },
      },
    )
  }
}

/** A position readout, not decoration: it maps the scrollbar 1:1, so it stays with reduced motion. */
function scrollProgress(root: HTMLElement) {
  for (const bar of all(root, '[data-scroll-progress]')) {
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: EASE.scrub, scrollTrigger: { start: 0, end: 'max', scrub: true } })
  }
}

/* ─── Played once ───────────────────────────────────────────────────────── */

function textReveals(root: HTMLElement) {
  for (const el of all(root, '[data-motion-text="words"]')) {
    const words = el.querySelectorAll('.motion-word')
    if (!words.length) continue
    gsap.fromTo(
      words,
      { yPercent: PARKED, autoAlpha: 0, filter: blur(OFFSET.blur) },
      {
        yPercent: 0,
        autoAlpha: 1,
        filter: blur(0),
        duration: DURATION.text,
        ease: EASE.enter,
        stagger: STAGGER.word,
        clearProps: 'filter',
        scrollTrigger: once(el, 'top 84%'),
      },
    )
  }
}

function reveals(root: HTMLElement) {
  for (const el of all(root, '[data-reveal]')) {
    const preset = PRESETS[el.dataset.reveal ?? ''] ?? PRESETS['fade-up']!
    gsap.fromTo(el, preset.from, {
      ...preset.to,
      duration: DURATION.block,
      ease: EASE.enter,
      delay: Number(el.dataset.revealDelay ?? 0),
      clearProps: 'transform,filter',
      scrollTrigger: once(el, 'top 86%'),
    })
  }

  for (const group of all(root, '[data-reveal-group]')) {
    const items = group.querySelectorAll('[data-reveal-item]')
    if (!items.length) continue
    gsap.fromTo(
      items,
      { y: OFFSET.rise, autoAlpha: 0, filter: blur(OFFSET.blur) },
      {
        y: 0,
        autoAlpha: 1,
        filter: blur(0),
        duration: DURATION.block,
        ease: EASE.enter,
        stagger: STAGGER.item,
        clearProps: 'transform,filter',
        scrollTrigger: once(group),
      },
    )
  }
}

function imageReveals(root: HTMLElement) {
  for (const frame of all(root, '[data-image-reveal]')) {
    gsap.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: DURATION.frame,
        ease: EASE.enter,
        clearProps: 'clipPath',
        scrollTrigger: once(frame, 'top 90%'),
      },
    )
  }
}

function counters(root: HTMLElement) {
  const nf = new Intl.NumberFormat(document.documentElement.lang || undefined)
  for (const el of all(root, '[data-count]')) {
    const target = Number(el.dataset.count)
    if (!Number.isFinite(target)) continue
    const state = { v: 0 }
    const render = () => {
      el.textContent = nf.format(Math.round(state.v))
    }
    gsap.to(state, {
      v: target,
      duration: 1.8,
      ease: 'power3.out',
      onStart: render,
      onUpdate: render,
      scrollTrigger: once(el, 'top 88%'),
    })
    render() // show 0 until it plays
  }
}

/* ─── Navigation state ──────────────────────────────────────────────────── */

function actRail(root: HTMLElement) {
  const links = all(root, '[data-act-link]')
  if (!links.length) return
  const mark = (id: string) => {
    for (const link of links) {
      if (link.dataset.actLink === id) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }
  for (const act of all(root, '[data-act][id]')) {
    ScrollTrigger.create({
      trigger: act,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => self.isActive && mark(act.id),
    })
  }
}

/**
 * Builds every scene under `root`. Everything is created inside one
 * gsap.matchMedia, so switching reduced motion or crossing the desktop
 * breakpoint reverts and rebuilds cleanly; call `.revert()` on route change.
 */
export function initMotion(root: HTMLElement) {
  const mm = gsap.matchMedia()
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      wide: '(min-width: 1024px) and (pointer: fine)',
      stage: STAGE_QUERY,
    },
    (ctx) => {
      const { motion, wide, stage } = ctx.conditions as { motion: boolean; wide: boolean; stage: boolean }
      scrollProgress(root)
      if (motion) {
        // Pins first, in page order: their spacers shift every trigger below them.
        const cleanups = scenes(root, wide, stage)
        sweeps(root)
        lights(root)
        readText(root)
        textReveals(root)
        reveals(root)
        imageReveals(root)
        counters(root)
        parallax(root, wide)
        progressScenes(root)
        footerReveal(root)
        actRail(root)
        ScrollTrigger.refresh()
        return () => cleanups.forEach((c) => c())
      }
      // Reduced motion: the page as written, nothing hidden or moving; only position readouts.
      actRail(root)
    },
  )
  return mm
}
