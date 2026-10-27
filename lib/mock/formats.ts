// What MusiqualiT produces and is launching, from the organization's own
// planning document (2026). Typed data in one place so a CMS can drive it later.
// New projects carry no description until the team writes one: the poster shows
// the name only (Listening Room style), never invented copy.

export type FormatStatus = 'running' | 'upcoming'

export type ShowFormat = {
  slug: 'night-n-key' | 'sounds-of-renaissance' | 'inner-thoughts' | 'project-lightroom' | 'panels-camps'
  status: FormatStatus
  /** Poster treatment on the home wall. */
  poster: 'gold' | 'ivory' | 'outline' | 'glow'
  /** Where the poster leads, if anywhere yet. */
  href?: '/events'
  fr: { name: string; line?: string; body?: string }
  en: { name: string; line?: string; body?: string }
}

export const formats: ShowFormat[] = [
  {
    slug: 'night-n-key',
    status: 'running',
    poster: 'gold',
    href: '/events',
    fr: {
      name: 'Night n Key',
      line: 'Soirées intimes · depuis avril 2023',
      body: 'Deux à quatre artistes par soirée, un vrai band, une salle de plus de cent personnes en moyenne.',
    },
    en: {
      name: 'Night n Key',
      line: 'Intimate nights · since April 2023',
      body: 'Two to four artists a night, a real band, and a room of more than a hundred people on average.',
    },
  },
  { slug: 'sounds-of-renaissance', status: 'upcoming', poster: 'ivory', fr: { name: 'Sounds of Renaissance' }, en: { name: 'Sounds of Renaissance' } },
  { slug: 'inner-thoughts', status: 'upcoming', poster: 'outline', fr: { name: 'Inner Thoughts' }, en: { name: 'Inner Thoughts' } },
  { slug: 'project-lightroom', status: 'upcoming', poster: 'glow', fr: { name: 'Project Lightroom' }, en: { name: 'Project Lightroom' } },
  {
    slug: 'panels-camps',
    status: 'upcoming',
    poster: 'outline',
    fr: {
      name: 'Panels et camps de création',
      body: 'Des panels, des camps de création et du mentorat par des professionnel·le·s de l’industrie.',
    },
    en: {
      name: 'Panels & creative camps',
      body: 'Panels, creative camps and mentoring by industry professionals.',
    },
  },
]
