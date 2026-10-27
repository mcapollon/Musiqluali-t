// REAL figures (not mock), from MusiqualiT's own planning document, 2026.
// Keep them dated: update `asOf` and the values together. Labels live in
// messages/*.json (home.impact.items.<key>).

export type ImpactFigure = {
  key: 'nights' | 'audience' | 'artists' | 'followers' | 'volunteers'
  /** Counted up to on scroll; a range shows as "min–max". */
  value: number
  min?: number
  plus?: boolean
}

export const IMPACT_AS_OF = '2026'

export const impact: ImpactFigure[] = [
  { key: 'nights', value: 25, plus: true },
  { key: 'audience', value: 100, plus: true },
  { key: 'artists', value: 4, min: 2 },
  { key: 'followers', value: 6100, plus: true },
  { key: 'volunteers', value: 10, min: 5 },
]
