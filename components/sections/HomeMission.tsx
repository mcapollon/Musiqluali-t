'use client'
import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'

// The four parts of the mission (MUSIQUALIT_VISION.md §1). These replace the
// former invented stats ("120+ artists", "8 years"), which are not rendered.
const PILLARS = ['exposure', 'education', 'opportunities', 'mentorship'] as const

export function HomeMission() {
  const t = useTranslations('home.mission')
  return (
    <section className="section-pad-x section-pad-y">
      <ChapterMark number="01" title={t('chapter')} />
      <DisplayHeading text={t('manifesto')} emphasis={t('manifestoEm')} size="l" as="p" className="mt-14 max-w-6xl md:mt-20" />
      <h3 className="sr-only">{t('pillarsLabel')}</h3>
      <ol className="mt-20 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4 md:mt-28">
        {PILLARS.map((key, i) => (
          <li key={key} className="bg-ink">
            <RevealOnScroll delay={i * 0.12} className="flex h-full flex-col gap-4 py-8 sm:p-8">
              <span className="text-mono-meta text-gold" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-display-m">{t(`pillars.${key}.title`)}</p>
              <p className="text-bone-mute">{t(`pillars.${key}.body`)}</p>
            </RevealOnScroll>
          </li>
        ))}
      </ol>
    </section>
  )
}
