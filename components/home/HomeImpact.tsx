import { useFormatter, useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { impact } from '@/lib/mock/impact'

const OUTCOMES = ['visibility', 'band', 'festivals'] as const

/**
 * Act V: since 2023. The organization's real figures, set like a marquee
 * board; each number counts up once as it enters (data-count). The final
 * value is in the markup, so it reads correctly without JS or motion.
 */
export function HomeImpact() {
  const t = useTranslations('home')
  const f = useFormatter()
  const fmt = (n: number) => f.number(n)

  return (
    <section id="since-2023" data-act className="section-pad-x section-pad-y relative">
      <ChapterMark number="V" title={t('acts.impact')} />
      <DisplayHeading text={t('impact.title')} emphasis={t('impact.titleEm')} size="xl" as="p" className="mt-12 max-w-5xl md:mt-16" />

      <dl data-reveal-group className="mt-16 grid border-t border-rule sm:grid-cols-2 md:mt-24 lg:grid-cols-5">
        {impact.map((fig) => (
          <div
            key={fig.key}
            data-reveal-item
            className="flex flex-col-reverse justify-end gap-4 border-b border-rule py-8 sm:pr-8 lg:border-r lg:border-b-0 lg:py-10 lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <dt className="text-bone-mute">{t(`impact.items.${fig.key}`)}</dt>
            <dd className="text-figures text-[clamp(2.75rem,4.4vw,5rem)] leading-none whitespace-nowrap text-bone">
              {fig.min !== undefined && <>{fmt(fig.min)}–</>}
              <span data-count={fig.value}>{fmt(fig.value)}</span>
              {fig.plus && <span className="text-gold">+</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 grid gap-8 md:mt-28 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <p className="text-mono-meta text-gold">{t('impact.outcomesLabel')}</p>
        <ol data-reveal-group className="space-y-4">
          {OUTCOMES.map((key, i) => (
            <li key={key} data-reveal-item className="flex items-baseline gap-6 text-display-m">
              <span aria-hidden className="text-mono-meta text-bone-mute">
                {String(i + 1).padStart(2, '0')}
              </span>
              {t(`impact.outcomes.${key}`)}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
