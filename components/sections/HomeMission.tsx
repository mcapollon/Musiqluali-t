'use client'
import { useTranslations, useLocale } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { StatCell } from '@/components/cards/StatCell'
import { stats } from '@/lib/mock/stats'

export function HomeMission() {
  const t = useTranslations('home.mission')
  const locale = useLocale() as 'fr' | 'en'
  return (
    <section className="section-pad-x section-pad-y space-y-12">
      <ChapterMark number="01" title={t('chapter')} />
      <DisplayHeading text={t('manifesto')} size="l" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
        {stats.map((s, i) => (
          <StatCell key={i} value={s.value} label={locale === 'fr' ? s.labelFr : s.labelEn} />
        ))}
      </div>
    </section>
  )
}
