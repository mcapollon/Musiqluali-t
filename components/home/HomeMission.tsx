import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'

const ITEMS = ['spotlight', 'grow', 'gather'] as const

/**
 * Act III: the mission as three verbs. A follow spot crosses each verb as it
 * scrolls through the frame (.light-sweep, scrubbed via data-sweep); the line
 * that explains it arrives beside it. Static: verbs fully lit.
 */
export function HomeMission() {
  const t = useTranslations('home')
  return (
    <section id="spotlight" data-act className="section-pad-x section-pad-y relative">
      <ChapterMark number="III" title={t('acts.mission')} />
      <p className="text-mono-meta mt-6 text-bone-mute">{t('mission.eyebrow')}</p>
      <ol className="mt-16 md:mt-24">
        {ITEMS.map((key, i) => (
          <li
            key={key}
            className="grid gap-6 border-t border-rule py-10 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,22rem)] md:items-end md:gap-10 md:py-14"
          >
            <span aria-hidden className="text-mono-meta text-gold">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 data-sweep className="light-sweep text-display-hero pb-[0.3em] mb-[-0.24em]">
              {t(`mission.items.${key}.verb`)}
            </h3>
            <p data-reveal className="text-lede text-bone-mute">
              {t(`mission.items.${key}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
