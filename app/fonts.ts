import { Albert_Sans } from 'next/font/google'

// Quiet luxury, one family (PO choice, "option B"; references
// ncbf-pi.vercel.app and monarque-evenements.com). Albert Sans carries
// headlines (400, large, tight), names (300) and text/labels (400/500).
//
// `subsets` only decides what is *preloaded*; other subsets (latin-ext for
// names like Łukasz or Nguyễn) still load on demand through unicode-range.
export const albert = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-albert',
})
