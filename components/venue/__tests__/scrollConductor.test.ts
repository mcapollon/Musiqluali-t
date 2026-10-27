import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createScrollConductor } from '../scrollConductor'

const STAGE = 800

/** Three chapter blocks stacked one stage apart, measured relative to the current scroll. */
function chapters() {
  return [0, 1, 2].map((i) => {
    const el = document.createElement('div')
    el.getBoundingClientRect = () => ({ top: 80 + i * STAGE - window.scrollY }) as DOMRect
    return el
  })
}

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('scroll conductor', () => {
  let conductor: ReturnType<typeof createScrollConductor>
  const make = (reducedMotion = false) => {
    conductor = createScrollConductor({ chapters: chapters(), stageOffset: () => 80, damping: 4.2, reducedMotion })
    conductor.start()
  }

  beforeEach(() => scrollTo(0))
  afterEach(() => conductor.stop())

  it('maps native scroll to a fractional chapter value', () => {
    make()
    scrollTo(STAGE * 0.5)
    expect(conductor.step(1 / 60).exact).toBeCloseTo(0.5)
    scrollTo(STAGE * 1.25)
    expect(conductor.step(1 / 60).exact).toBeCloseTo(1.25)
    scrollTo(STAGE * 9)
    expect(conductor.step(1 / 60).exact).toBe(2)
  })

  it('gives the same state for the same scroll, in either direction', () => {
    make()
    scrollTo(STAGE * 2)
    conductor.step(1 / 60)
    scrollTo(STAGE * 0.75)
    const back = conductor.step(1 / 60).exact
    scrollTo(0)
    conductor.step(1 / 60)
    scrollTo(STAGE * 0.75)
    expect(conductor.step(1 / 60).exact).toBe(back)
  })

  it('damps the visual value toward the exact one and settles', () => {
    make()
    scrollTo(STAGE)
    const first = conductor.step(1 / 60)
    expect(first.smooth).toBeGreaterThan(0)
    expect(first.smooth).toBeLessThan(1)
    for (let i = 0; i < 600; i++) conductor.step(1 / 60)
    expect(conductor.isSettled()).toBe(true)
  })

  it('snaps to composed chapter frames under reduced motion', () => {
    make(true)
    scrollTo(STAGE * 1.4)
    const s = conductor.step(1 / 60)
    expect(s.exact).toBe(1)
    expect(s.smooth).toBe(1)
  })
})
