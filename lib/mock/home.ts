// Home page media. Kept as data (not in components) so a CMS can drive it later.

export type HeroMedia = {
  /** Looping, muted performance footage. Desktop only; mobile and reduced motion get the poster. */
  videoSrc: string | null
  poster: string
  /** True until real Night n Key footage replaces the stock clip. Shows a small label in the hero. */
  isPlaceholder: boolean
}

// PLACEHOLDER: Mixkit stock clip (free licence) + Unsplash still, hot-linked.
// Replace with real Night n Key footage (≈10–20 s loop, 720p H.264, < 6 MB) and a frame from it as poster.
export const heroMedia: HeroMedia = {
  videoSrc: 'https://assets.mixkit.co/videos/45938/45938-720.mp4',
  poster: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1920&auto=format&fit=crop&q=75',
  isPlaceholder: true,
}

/** The flagship series, used when no upcoming date is published yet. */
export const flagship = {
  name: 'Night n Key',
  // PLACEHOLDER: Unsplash stage photo until a real Night n Key photo is supplied.
  poster: 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1600&auto=format&fit=crop&q=75',
  posterAlt: { fr: 'Chanteur sur scène (image provisoire)', en: 'Singer on stage (placeholder image)' },
}
