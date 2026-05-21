export type EventItem = {
  id: string
  dateISO: string
  venue: string
  fr: { title: string; description: string }
  en: { title: string; description: string }
  ticketsHref: string
}

export const events: EventItem[] = [
  {
    id: 'e1',
    dateISO: '2026-07-04',
    venue: 'Le Ministère',
    fr: { title: 'Showcase été · La Relève', description: 'Six artistes Musiqlt sur scène.' },
    en: { title: 'Summer Showcase · The Next Wave', description: 'Six Musiqlt artists onstage.' },
    ticketsHref: '#',
  },
  {
    id: 'e2',
    dateISO: '2026-08-15',
    venue: 'Théâtre Rialto',
    fr: { title: 'Carte blanche · AYO Kalia', description: 'AYO Kalia présente son projet, accompagnée du collectif.' },
    en: { title: 'Carte Blanche · AYO Kalia', description: 'AYO Kalia presents her project with the collective.' },
    ticketsHref: '#',
  },
  {
    id: 'e3',
    dateISO: '2026-09-12',
    venue: 'Bar Le Ritz PDB',
    fr: { title: 'Nuit Hip-Hop', description: 'Dré, Mahir, et invités. DJ set jusqu\'à 2h.' },
    en: { title: 'Hip-Hop Night', description: 'Dré, Mahir, and guests. DJ set until 2am.' },
    ticketsHref: '#',
  },
  {
    id: 'e4',
    dateISO: '2025-11-22',
    venue: 'Maison de la culture',
    fr: { title: 'Atelier · Production maison', description: 'Atelier 4h. Inscription gratuite.' },
    en: { title: 'Workshop · Bedroom Production', description: '4-hour workshop. Free registration.' },
    ticketsHref: '#',
  },
  {
    id: 'e5',
    dateISO: '2025-10-08',
    venue: 'Studio Musiqlt',
    fr: { title: 'Portes ouvertes', description: 'Visite du studio. Café offert.' },
    en: { title: 'Open House', description: 'Studio tour. Free coffee.' },
    ticketsHref: '#',
  },
]
