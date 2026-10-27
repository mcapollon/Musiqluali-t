import { useLocale, useFormatter, useTranslations } from 'next-intl'
import type { EventItem } from '@/lib/mock/events'
import { cn } from '@/lib/utils/cn'

/** One line in the programme. `archival` = past show: quieter, no ticket link. */
export function EventRow({ event, archival = false }: { event: EventItem; archival?: boolean }) {
  const t = useTranslations('home.events')
  const locale = useLocale() as 'fr' | 'en'
  const f = useFormatter()
  const date = new Date(event.dateISO)
  const copy = locale === 'fr' ? event.fr : event.en

  return (
    <article data-reveal-item className="group grid grid-cols-[5.5rem_1fr] items-baseline gap-x-6 gap-y-3 border-t border-rule py-8 md:grid-cols-[9rem_1fr_auto] md:gap-x-10">
      <time
        dateTime={event.dateISO}
        className={cn('text-figures text-4xl leading-none md:text-5xl', archival ? 'text-bone-mute' : 'text-bone')}
      >
        {f.dateTime(date, { day: '2-digit' })}
        <span className="text-mono-micro mt-3 block text-bone-mute">
          {f.dateTime(date, archival ? { month: 'short', year: 'numeric' } : { month: 'short' })}
        </span>
      </time>
      <div>
        <h3 className={cn('font-display', archival ? 'text-2xl text-bone-mute' : 'text-display-m')}>{copy.title}</h3>
        <p className="mt-2 text-bone-mute">
          {event.venue} — {copy.description}
        </p>
      </div>
      {!archival && (
        <a
          href={event.ticketsHref}
          className="col-start-2 text-mono-meta text-bone transition-colors hover:text-gold-bright md:col-start-auto md:justify-self-end"
        >
          {t('tickets')} <span aria-hidden>→</span>
        </a>
      )}
    </article>
  )
}
