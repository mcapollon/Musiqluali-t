import { Hanken_Grotesk, Marcellus } from 'next/font/google'

// Quiet luxury: two families, one weight each, no italics (PO direction,
// references monarque-evenements.com and ncbf-pi.vercel.app).
//
// `subsets` only decides what is *preloaded*; other subsets (latin-ext for
// names like Łukasz or Nguyễn) still load on demand through unicode-range.

// Display: flared, engraved-feeling capitals (Monarque's register). Single weight.
export const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-marcellus',
})

// Text and UI: a plain, warm grotesk. Also carries the small tracked labels.
export const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken',
})
