import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'

// Values a)–g) of the organization's charter. h) "Intention" is still blank in the source; add it here when written.
const VALUES = ['integrity', 'quality', 'creativity', 'community', 'inclusion', 'ambition', 'recognition'] as const

/**
 * Act IX: the credits. The values roll up like end credits over a held
 * frame; the one crossing the centre line is lit (data-scene="credits",
 * pinned and scrubbed; dimming uses opacity, so screen readers keep all).
 * Without motion it is a centred list.
 */
export function HomeCredits() {
  const t = useTranslations('home')
  return (
    <section id="credits" data-act className="relative">
      <div className="section-pad-x pt-[clamp(5rem,9vw,9rem)]">
        <ChapterMark number="IX" title={t('acts.credits')} />
      </div>
      <div data-scene="credits" className="relative isolate mt-10">
        <div data-credits-list className="section-pad-x flex flex-col items-center gap-20 py-24 text-center md:gap-28">
          <h2 data-credit className="text-mono-meta text-gold">
            {t('credits.title')}
          </h2>
          {VALUES.map((key) => (
            <div data-credit key={key} className="max-w-3xl space-y-5">
              <p className="text-display-l">{t(`credits.values.${key}.name`)}</p>
              <p className="text-lede text-bone-mute">{t(`credits.values.${key}.line`)}</p>
            </div>
          ))}
          <p data-credit className="text-display-m text-gold">
            {t('credits.end')}
          </p>
        </div>
        {/* The frame's edges fall to black, like the bottom of a screen. */}
        <div aria-hidden className="credits-fade pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-ink to-transparent" />
        <div aria-hidden className="credits-fade pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-ink to-transparent" />
      </div>
    </section>
  )
}
