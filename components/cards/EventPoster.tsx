import Image from 'next/image'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { buttonClass } from '@/components/primitives/buttonClass'
import type { EventItem } from '@/lib/mock/events'
import { flagship } from '@/lib/mock/home'

/**
 * The next show, at poster scale: condensed caps over gold-graded stage
 * light. An optional `cutout` (transparent PNG of the performer) sits in
 * front of the type. With no published date, the flagship series is shown
 * as "date to be announced" rather than an invented one.
 */
export function EventPoster({
  event,
  headingAs: Heading = 'h3',
}: {
  event?: EventItem | undefined
  /** h2 when the poster sits directly under a page h1. */
  headingAs?: 'h2' | 'h3'
}) {
  const t = useTranslations('home.events')
  const locale = useLocale() as 'fr' | 'en'
  const f = useFormatter()
  const copy = event ? event[locale] : null
  const date = event ? new Date(event.dateISO) : null

  return (
    <article className="relative isolate overflow-hidden bg-black text-white">
      <div className="grade-stage absolute inset-0">
        <Image
          src={event?.poster ?? flagship.poster}
          alt={event ? '' : flagship.posterAlt[locale]}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden className="absolute inset-0 z-3 bg-linear-to-r from-black/85 via-black/40 to-transparent" />

      <div className="relative z-10 flex min-h-[34rem] flex-col justify-between gap-12 p-6 sm:p-10 md:min-h-[42rem] md:p-14">
        <p className="text-mono-meta text-gold-bright">{t('nextShow')}</p>

        <div>
          <Heading className={event ? 'text-poster-l max-w-5xl' : 'text-poster-xl'}>{copy?.title ?? flagship.name}</Heading>
          {date ? (
            <p className="text-poster-l mt-4 text-gold">
              <time dateTime={event!.dateISO}>{f.dateTime(date, { day: '2-digit', month: 'long' })}</time>
            </p>
          ) : (
            <p className="text-poster-m mt-5 text-gold">{t('tbaDate')}</p>
          )}
          <p className="mt-6 max-w-lg text-white/80">{event ? `${event.venue} — ${copy!.description}` : t('tbaBody')}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {event ? (
            <a href={event.ticketsHref} className={buttonClass({ size: 'lg' })}>
              {t('tickets')}
            </a>
          ) : (
            <a href="#newsletter" className={buttonClass({ size: 'lg' })}>
              {t('notify')}
            </a>
          )}
          <Link
            href="/events"
            className={buttonClass({ size: 'lg', variant: 'ghost', className: 'text-white border-white/50 hover:border-gold' })}
          >
            {t('seeAll')}
          </Link>
        </div>
      </div>

      {event?.cutout && (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/2">
          <Image src={event.cutout} alt="" fill sizes="50vw" className="object-contain object-bottom-right grayscale" />
        </div>
      )}
    </article>
  )
}
