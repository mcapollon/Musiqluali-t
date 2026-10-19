import { Anton, Bodoni_Moda, Inter, JetBrains_Mono } from 'next/font/google'

// Headline serif. Didone with an optical-size axis: hairlines stay razor-thin
// at poster sizes and thicken automatically at small sizes (font-optical-sizing).
// `subsets` only decides what is *preloaded*; other subsets (latin-ext for
// names like Łukasz or Nguyễn) still load on demand through unicode-range.
// Preloading just 'latin' keeps the hero image ahead of the fonts on slow phones.
export const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-bodoni',
})

// Poster caps for event names/dates. Below the fold, so not preloaded.
export const anton = Anton({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  preload: false,
  variable: '--font-anton',
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Small meta labels only; swapping in late is invisible enough, so not preloaded.
export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains',
})
