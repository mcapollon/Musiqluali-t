import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { TeamMember } from '@/components/cards/TeamMember'
import { team } from '@/lib/mock/team'
import { milestones } from '@/lib/mock/milestones'

export function AboutPage() {
  const t = useTranslations('about')
  const locale = useLocale() as 'fr' | 'en'
  return (
    <>
      <section className="section-pad-x section-pad-y space-y-12 pt-32">
        <ChapterMark number="00" title={t('chapter')} />
        <DisplayHeading text={t('intro')} size="xl" as="h1" />
      </section>
      <section className="section-pad-x section-pad-y grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80" alt={t('founderAlt')} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="space-y-6">
          <ChapterMark number="01" title={t('story.chapter')} />
          <p className="text-bone">{t('story.body1')}</p>
          <p className="text-bone-mute">{t('story.body2')}</p>
        </div>
      </section>
      <section className="section-pad-x section-pad-y space-y-12">
        <ChapterMark number="02" title={t('team.chapter')} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((m) => <TeamMember key={m.id} member={m} />)}
        </div>
      </section>
      <section className="section-pad-x section-pad-y space-y-12">
        <ChapterMark number="03" title={t('milestones.chapter')} />
        <ol className="space-y-6">
          {milestones.map((m) => (
            <li key={m.year} className="grid grid-cols-12 items-baseline border-t border-[color:var(--color-rule)] pt-6">
              <span className="col-span-2 font-mono text-3xl text-saffron">{m.year}</span>
              <p className="col-span-10 text-bone-mute">{locale === 'fr' ? m.fr : m.en}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
