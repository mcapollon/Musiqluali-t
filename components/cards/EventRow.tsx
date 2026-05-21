import { useLocale, useFormatter } from 'next-intl'
import type { EventItem } from '@/lib/mock/events'

export function EventRow({ event }: { event: EventItem }) {
  const locale = useLocale() as 'fr' | 'en'
  const f = useFormatter()
  const date = new Date(event.dateISO)
  const day = f.dateTime(date, { day: '2-digit' })
  const month = f.dateTime(date, { month: '2-digit' })
  const copy = locale === 'fr' ? event.fr : event.en

  return (
    <article className="group grid grid-cols-12 items-baseline gap-4 border-t border-[color:var(--color-rule)] py-8 hover:[--accent:1] transition-colors">
      <span className="col-span-3 font-mono text-5xl md:text-7xl text-bone group-hover:text-saffron transition-colors">{day} · {month}</span>
      <div className="col-span-7">
        <h3 className="text-display-m font-display">{copy.title}</h3>
        <p className="text-bone-mute">{event.venue} — {copy.description}</p>
      </div>
      <a href={event.ticketsHref} className="col-span-2 text-mono-meta text-saffron justify-self-end">→ {locale === 'fr' ? 'BILLETS' : 'TICKETS'}</a>
    </article>
  )
}
