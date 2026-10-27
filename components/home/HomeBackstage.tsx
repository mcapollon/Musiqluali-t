import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'

// How a Night n Key show is built (MUSIQUALIT_VISION.md §2): the process is the mentorship.
const STEPS = ['meeting', 'arrangement', 'rehearsals', 'show'] as const

/**
 * Act IV: backstage. The four steps take turns in one held frame: a gold
 * numeral, a progress rail, one step at a time (data-scene="steps", pinned
 * and scrubbed). Without motion it is an ordered list.
 */
export function HomeBackstage() {
  const t = useTranslations('home')
  return (
    <section id="backstage" data-act className="theme-ivory relative">
      <div className="section-pad-x pt-[clamp(5rem,9vw,9rem)]">
        <ChapterMark number="IV" title={t('acts.backstage')} />
        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
          <DisplayHeading text={t('backstage.title')} emphasis={t('backstage.titleEm')} size="xl" as="p" />
          <p data-reveal className="text-lede text-bone-mute">
            {t('backstage.intro')}
          </p>
        </div>
      </div>

      <div
        data-scene="steps"
        className="section-pad-x relative isolate grid min-h-[calc(100svh-5rem)] content-center gap-10 py-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-16"
      >
        {/* Warm practical light behind the numeral, like a lamp in the wings. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_55%_at_22%_55%,rgb(201_165_76/0.12),transparent_70%)]"
        />
        <div aria-hidden className="flex items-end gap-8">
          <div data-step-nums className="text-figures grid overflow-clip text-[clamp(6rem,16vw,15rem)] leading-[0.9] text-gold">
            {STEPS.map((key, i) => (
              <span key={key} className="block">
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
          {/* Progress rail: fills as the steps go by. */}
          <div className="mb-[0.6em] hidden h-40 w-px bg-rule md:block">
            <div data-steps-rail className="h-full w-full origin-top bg-gold" />
          </div>
        </div>
        <ol data-steps className="grid gap-14">
          {STEPS.map((key, i) => (
            <li key={key} className="max-w-xl space-y-6">
              <p className="text-mono-meta text-bone-mute">{t('backstage.stepOf', { n: i + 1, total: STEPS.length })}</p>
              <h3 className="text-display-l">{t(`backstage.steps.${key}.title`)}</h3>
              <p className="text-lede text-bone-mute">{t(`backstage.steps.${key}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
