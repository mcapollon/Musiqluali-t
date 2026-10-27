import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'

/**
 * Act II: the gap. Two sentences set against each other in a held frame:
 * the talent is here; the infrastructure isn't, yet. Then why MusiqualiT
 * exists, and that it is one of several organizations doing this work.
 * Pinned, words rise on scroll (data-scene="statement").
 */
export function HomeWhy() {
  const t = useTranslations('home')
  return (
    <section id="the-gap" data-act className="theme-ivory relative">
      <div
        data-scene="statement"
        className="section-pad-x relative isolate flex min-h-[calc(100svh-5rem)] flex-col justify-center gap-12 overflow-clip py-14 md:gap-16 md:py-24"
      >
        {/* A soft shadow from above: the light hasn't reached the stage yet. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_60%_at_70%_0%,rgb(10_10_10/0.05),transparent_70%)]"
        />
        <ChapterMark number="II" title={t('acts.why')} />
        <div className="max-w-6xl space-y-4 md:space-y-6">
          <div data-statement>
            <DisplayHeading text={t('why.talent')} emphasis={t('why.talentEm')} size="xl" as="p" reveal="scene" />
          </div>
          <div data-statement className="md:pl-[12vw]">
            <DisplayHeading text={t('why.gap')} emphasis={t('why.gapEm')} size="xl" as="p" reveal="scene" />
          </div>
        </div>
        <p data-statement-body className="text-lede max-w-2xl text-bone-mute md:ml-auto">
          {t('why.body')}
        </p>
      </div>
    </section>
  )
}
