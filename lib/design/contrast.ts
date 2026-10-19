// WCAG 2.1 contrast helpers. Token values are parsed from app/globals.css so
// the CSS stays the single source of truth for colour.

export type RGB = [number, number, number]
export type ThemeName = 'dark' | 'light'

const channel = (c: number) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function luminance([r, g, b]: RGB): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: RGB, b: RGB): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

type RawColor = { rgb: RGB; alpha: number }

function parseColor(value: string): RawColor | string | null {
  const v = value.trim()
  const hex = v.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hex) return { rgb: [hex[1], hex[2], hex[3]].map((x) => parseInt(x ?? '0', 16)) as RGB, alpha: 1 }
  const rgb = v.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)$/)
  if (rgb) return { rgb: [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])], alpha: rgb[4] ? Number(rgb[4]) : 1 }
  return v.match(/^var\(--color-([\w-]+)\)$/)?.[1] ?? null
}

function readBlock(css: string, selector: RegExp): Record<string, RawColor | string> {
  const block = css.match(selector)?.[1] ?? ''
  const out: Record<string, RawColor | string> = {}
  for (const [, name, value] of block.matchAll(/--color-([\w-]+):\s*([^;]+);/g)) {
    const parsed = name && value ? parseColor(value) : null
    if (name && parsed) out[name] = parsed
  }
  return out
}

/** Resolve every --color-* token for a theme to an opaque RGB (alpha composited over `ink`). */
export function resolveTheme(css: string, theme: ThemeName): Record<string, RGB> {
  const base = readBlock(css, /@theme[^{]*\{([\s\S]*?)\n\}/)
  const raw = theme === 'light' ? { ...base, ...readBlock(css, /\n\.light\s*\{([\s\S]*?)\n\}/) } : base

  const resolve = (name: string, seen = new Set<string>()): RawColor => {
    const v = raw[name]
    if (v === undefined || seen.has(name)) throw new Error(`Unresolvable colour token: ${name}`)
    if (typeof v === 'string') return resolve(v, new Set(seen).add(name))
    return v
  }

  const page = resolve('ink').rgb
  const out: Record<string, RGB> = {}
  for (const name of Object.keys(raw)) {
    const { rgb, alpha } = resolve(name)
    out[name] = rgb.map((c, i) => Math.round(c * alpha + (page[i] ?? 0) * (1 - alpha))) as RGB
  }
  return out
}

/** AA minimums: 4.5 for body text, 3 for large text (≥24px or ≥18.66px bold) and UI boundaries. */
export const CONTRAST_PAIRS: { fg: string; bg: string; min: 4.5 | 3; use: string; themes: ThemeName[] }[] = [
  { fg: 'bone', bg: 'ink', min: 4.5, use: 'Body text on page', themes: ['dark', 'light'] },
  { fg: 'bone', bg: 'ink-2', min: 4.5, use: 'Body text on raised surface', themes: ['dark', 'light'] },
  { fg: 'bone-mute', bg: 'ink', min: 4.5, use: 'Secondary text on page', themes: ['dark', 'light'] },
  { fg: 'bone-mute', bg: 'ink-2', min: 4.5, use: 'Secondary text on raised surface', themes: ['dark', 'light'] },
  { fg: 'gold', bg: 'ink', min: 4.5, use: 'Gold labels, dates, numerals', themes: ['dark', 'light'] },
  { fg: 'gold', bg: 'ink-2', min: 4.5, use: 'Gold labels on raised surface', themes: ['dark', 'light'] },
  { fg: 'gold-bright', bg: 'ink', min: 4.5, use: 'Gold hover / focus ring', themes: ['dark', 'light'] },
  { fg: 'ink', bg: 'gold', min: 4.5, use: 'Primary button label', themes: ['dark', 'light'] },
  { fg: 'ink', bg: 'gold-bright', min: 4.5, use: 'Primary button label (hover)', themes: ['dark', 'light'] },
  { fg: 'rule-strong', bg: 'ink', min: 3, use: 'Input / ghost button border', themes: ['dark', 'light'] },
  { fg: 'err', bg: 'ink', min: 4.5, use: 'Error message', themes: ['dark'] },
  { fg: 'ok', bg: 'ink', min: 4.5, use: 'Success message', themes: ['dark'] },
  { fg: 'white', bg: 'black', min: 4.5, use: 'Text over graded footage', themes: ['dark'] },
]
