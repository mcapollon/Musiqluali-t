/**
 * Motion grammar for the whole site (GSAP + ScrollTrigger + Lenis).
 *
 * The feeling is a gala evening: things arrive slightly late and settle
 * softly, never bounce. Data only, so pacing can be tuned without touching
 * components/motion/motionSystem.ts.
 */
export const EASE = {
  enter: 'power4.out', // reveals: text, cards, frames
  soft: 'power3.out', // small UI
  curtain: 'power4.inOut', // the opening's curtain lift
  scrub: 'none', // scroll-linked scenes: the scrollbar is the clock
} as const

export const DURATION = {
  text: 0.95,
  block: 1,
  frame: 1.2,
} as const

export const STAGGER = {
  word: 0.05,
  line: 0.11,
  item: 0.08,
} as const

/** Seconds of lag between the scrollbar and a scrubbed scene (cinematic delay). */
export const SCRUB = {
  tight: 0.8,
  calm: 1.2,
} as const

export const OFFSET = {
  rise: 36, // px a block travels on reveal
  blur: 8, // px of blur a word or block clears on reveal
} as const

/** Where scroll-triggered reveals start: the element's top crosses 82% of the viewport. */
export const REVEAL_START = 'top 82%'

/** Smooth scroll. Off on touch (native momentum is better) and with reduced motion. */
export const LENIS = {
  lerp: 0.08,
  wheelMultiplier: 0.9,
} as const
