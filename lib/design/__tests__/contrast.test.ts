import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CONTRAST_PAIRS, contrastRatio, resolveTheme } from '../contrast'

const css = readFileSync(resolve(__dirname, '../../../app/globals.css'), 'utf8')

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 1)
    expect(contrastRatio([119, 119, 119], [255, 255, 255])).toBeCloseTo(4.48, 2)
  })
})

describe('Gala Noir palette meets WCAG AA', () => {
  for (const theme of ['dark', 'light'] as const) {
    const colors = resolveTheme(css, theme)
    for (const p of CONTRAST_PAIRS.filter((x) => x.themes.includes(theme))) {
      it(`${theme}: ${p.fg} on ${p.bg} ≥ ${p.min} (${p.use})`, () => {
        const fg = colors[p.fg]
        const bg = colors[p.bg]
        expect(fg && bg, `missing token ${p.fg} or ${p.bg}`).toBeTruthy()
        expect(contrastRatio(fg!, bg!)).toBeGreaterThanOrEqual(p.min)
      })
    }
  }
})
