// Home page media. Kept as data (not in components) so a CMS can drive it later.

export type HeroMedia = {
  /** Looping, muted footage behind the opening. Desktop only; mobile and reduced motion get the poster. */
  videoSrc: string | null
  /** A frame from the same footage: shown before the video plays, and instead of it on phones. */
  poster: string
  /** True while the footage is a stand-in. Shows a small "placeholder video" label in the hero. */
  isPlaceholder: boolean
}

// Night n Key, year one (MusiqualiT's own footage). Web loop cut from the 1080p master
// ("public/Night In Key Year One - Musiquali-T (1080p).mp4"), with ffmpeg:
//   0:03 → 0:36.6 (after the logo intro, before the credit and end cards), letterbox
//   cropped (1892x850 from y=114), no audio, 1280px, 30fps, H.264 CRF 26, faststart.
// The file starts at the master's 0:03, so the native loop always restarts there.
// Poster: the empty stage at 0:04.5, same crop.
export const heroMedia: HeroMedia = {
  videoSrc: '/video/hero-year-one.mp4',
  poster: '/video/hero-year-one.jpg',
  isPlaceholder: false,
}

/** The flagship series, used when no upcoming date is published yet. */
export const flagship = {
  name: 'Night n Key',
  // PLACEHOLDER: Unsplash stage photo until a real Night n Key photo is supplied.
  poster: 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=1600&auto=format&fit=crop&q=75',
  posterAlt: { fr: 'Chanteur sur scène (image provisoire)', en: 'Singer on stage (placeholder image)' },
}
