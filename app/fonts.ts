import { Anton, Bodoni_Moda, Inter, JetBrains_Mono } from 'next/font/google'

// Headline serif. Didone with an optical-size axis: hairlines stay razor-thin
// at poster sizes and thicken automatically at small sizes (font-optical-sizing).
export const bodoni = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
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
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})
