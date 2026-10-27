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
    // Opens from an inset frame to full bleed as it is scrolled in (data-progress-scene, scrubbed).
    // theme-dark: the poster is its own stage, even on an ivory wall.
    <article data-progress-scene className="theme-dark relative isolate overflow-clip bg-black text-white">
      <div className="grade-stage absolute inset-0">
        <Image
          src={event?.poster ?? flagship.poster}
          alt={event ? '' : flagship.posterAlt[locale]}
          fill
          sizes="100vw"
          data-parallax
          className="object-cover"
        />
      </div>
      <div aria-hidden className="absolute inset-0 z-3 bg-linear-to-r from-black/85 via-black/40 to-transparent" />

      <div
        data-reveal-group
        className="relative z-10 flex min-h-[34rem] flex-col justify-between gap-12 p-6 sm:p-10 md:min-h-[42rem] md:p-14"
      >
        <p data-reveal-item className="text-mono-meta text-white/70">
          {t('nextShow')}
        </p>

        <div data-reveal-item>
          <Heading className={event ? 'text-poster-l max-w-5xl' : 'text-poster-xl'}>{copy?.title ?? flagship.name}</Heading>
          {date ? (
            <p className="text-poster-l text-figures mt-4 text-gold">
              <time dateTime={event!.dateISO}>{f.dateTime(date, { day: '2-digit', month: 'long' })}</time>
            </p>
          ) : (
            <p className="text-poster-m mt-5 text-gold">{t('tbaDate')}</p>
          )}
          <p className="mt-6 max-w-lg text-white/80">{event ? `${event.venue} — ${copy!.description}` : t('tbaBody')}</p>
        </div>

        <div data-reveal-item className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {event ? (
            <a href={event.ticketsHref} className={buttonClass({ size: 'lg' })}>
              {t('tickets')}
            </a>
          ) : (
            <a href="#newsletter" className={buttonClass({ size: 'lg' })}>
              {t('notify')}
            </a>
          )}
          <Link href="/events" className={buttonClass({ variant: 'link', className: 'text-white' })}>
            {t('seeAll')} <span aria-hidden>→</span>
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
