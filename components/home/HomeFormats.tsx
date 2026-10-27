import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { formats, type ShowFormat } from '@/lib/mock/formats'
import { cn } from '@/lib/utils/cn'

const POSTER: Record<ShowFormat['poster'], { card: string; name: string; meta: string }> = {
  // Flagship: gold on black, the house style.
  gold: { card: 'bg-ink-2 border border-gold/50', name: 'text-gold', meta: 'text-bone-mute' },
  // Listening Room style: black on white, little more than the name.
  ivory: { card: 'bg-bone', name: 'text-ink', meta: 'text-ink-mute' },
  // Announced, not yet running: the name drawn, not filled.
  outline: { card: 'bg-black border border-rule-strong', name: 'text-outline-bone', meta: 'text-bone-mute' },
  // A light coming up behind the name.
  glow: {
    card: 'bg-black bg-[radial-gradient(70%_60%_at_50%_100%,rgb(226_194_122/0.28),transparent_70%)] border border-rule',
    name: 'text-bone',
    meta: 'text-bone-mute',
  },
}

/**
 * Act VI: now showing. The formats as a wall of typographic flyers. On
 * desktop the wall pins and the page walks along it (data-gallery); on touch
 * and with reduced motion it is a native sideways scroller.
 */
export function HomeFormats() {
  const t = useTranslations('home')
  const locale = useLocale() as 'fr' | 'en'

  return (
    <section id="now-showing" data-act data-gallery className="section-pad-y lg:py-0">
      <div data-gallery-pin className="lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pt-20">
        <div
          data-gallery-viewport
          className="snap-x snap-mandatory scroll-px-(--pad-x) overflow-x-auto overscroll-x-contain"
        >
          <ul data-gallery-track className="section-pad-x relative flex w-max items-stretch gap-6 pb-6 md:gap-8">
            {/* Title panel rides with the wall. */}
            <li data-gallery-item className="flex w-[78vw] shrink-0 snap-start flex-col justify-between gap-10 sm:w-[52vw] md:w-[24rem] lg:w-[clamp(18rem,calc((100svh-18rem)*0.75),28rem)]">
              <ChapterMark number="VI" title={t('acts.formats')} />
              <div className="space-y-6">
                <p className="text-display-xl">{t('formats.title')}</p>
                <p className="text-lede text-bone-mute">{t('formats.intro')}</p>
              </div>
            </li>
            {formats.map((format) => {
              const copy = format[locale]
              const style = POSTER[format.poster]
              const poster = (
                <article
                  className={cn(
                    'relative flex aspect-[3/4] w-full flex-col justify-between overflow-clip p-6 md:p-8',
                    style.card,
                  )}
                >
                  <p className={cn('text-mono-micro flex items-center gap-2', style.meta)}>
                    <span
                      aria-hidden
                      className={cn('size-1.5 rounded-full', format.status === 'running' ? 'bg-gold' : 'bg-current')}
                    />
                    {t(`formats.status.${format.status}`)}
                  </p>
                  <h3 className={cn('font-display text-[clamp(2rem,3.2vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.02em] hyphens-none', style.name)}>
                    {copy.name}
                  </h3>
                  {copy.line ? <p className={cn('text-mono-micro', style.meta)}>{copy.line}</p> : <span aria-hidden />}
                </article>
              )
              return (
                <li
                  key={format.slug}
                  data-gallery-item
                  className="w-[78vw] shrink-0 snap-start sm:w-[52vw] md:w-[24rem] lg:w-[clamp(18rem,calc((100svh-18rem)*0.75),28rem)]"
                >
                  <div data-image-reveal>
                    {format.href ? (
                      <Link href={format.href} className="group block" aria-label={`${copy.name} — ${t('formats.cta')}`}>
                        {poster}
                      </Link>
                    ) : (
                      poster
                    )}
                  </div>
                  {copy.body && <p className="mt-5 text-bone-mute">{copy.body}</p>}
                  {format.href && (
                    <Link
                      href={format.href}
                      tabIndex={-1}
                      aria-hidden
                      className="text-mono-micro mt-4 inline-block text-bone transition-colors hover:text-gold-bright"
                    >
                      {t('formats.cta')} →
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
        {/* Walk progress, shown only while the wall is pinned. */}
        <div data-gallery-progress aria-hidden className="section-pad-x invisible mt-2 hidden lg:block">
          <div className="h-px bg-rule">
            <div data-gallery-progress-bar className="h-full origin-left bg-gold" />
          </div>
        </div>
      </div>
    </section>
  )
}
