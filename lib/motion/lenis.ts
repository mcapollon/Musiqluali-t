import type Lenis from 'lenis'

/**
 * The page's single Lenis instance (null on touch, with reduced motion, or
 * before the provider mounts). Scenes that must move the page themselves,
 * e.g. keeping a focused card in view, go through it so smooth scroll and
 * ScrollTrigger stay in step.
 */
let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

export const getLenis = () => instance

/** Jump the page to `y` without a smooth glide (keyboard focus, restores). */
export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo({ top: y, behavior: 'instant' })
}
