import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { PageIntro } from '@/components/editorial/PageIntro'
import { GalaMark } from '@/components/editorial/GalaMark'
import { RevealOnScroll } from '@/components/motion/RevealOnScroll'
import { TeamMember } from '@/components/cards/TeamMember'
import { team } from '@/lib/mock/team'
import { milestones } from '@/lib/mock/milestones'

// TODO (MUSIQUALIT_VISION.md §5.1): everything on this page — founder, story,
// team, milestones, figures — is invented demo content. Restyled only; it must
// be replaced with real, approved information before launch.
export function AboutPage() {
  const t = useTranslations('about')
  const locale = useLocale() as 'fr' | 'en'
  return (
    <>
      <PageIntro chapter={t('chapter')} title={t('intro')} />

      <section className="section-pad-x section-pad-y grid items-center gap-12 border-t border-rule md:grid-cols-2 md:gap-20">
        <div className="grade-portrait relative aspect-[4/5]">
          {/* PLACEHOLDER image (Unsplash). */}
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80"
            alt={t('founderAlt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-8">
          <ChapterMark number="01" title={t('story.chapter')} />
          <p className="text-lede">
            {t('story.body1')}
          </p>
          <p className="text-bone-mute">{t('story.body2')}</p>
        </div>
      </section>

      <section className="section-pad-x section-pad-y border-t border-rule">
        <ChapterMark number="02" title={t('team.chapter')} />
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-20 md:grid-cols-3 md:gap-x-10">
          {team.map((m, i) => (
            <RevealOnScroll key={m.id} delay={(i % 3) * 0.1}>
              <TeamMember member={m} />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="section-pad-x section-pad-y border-t border-rule">
        <ChapterMark number="03" title={t('milestones.chapter')} />
        <ol className="mt-14 md:mt-20">
          {milestones.map((m) => (
            <li
              key={m.year}
              className="grid grid-cols-[6rem_1fr] items-baseline gap-6 border-t border-rule py-8 md:grid-cols-[14rem_1fr] md:gap-10"
            >
              <span className="font-display text-3xl leading-none tracking-[0.04em] text-gold md:text-5xl">{m.year}</span>
              <p className="text-lede">{locale === 'fr' ? m.fr : m.en}</p>
            </li>
          ))}
        </ol>
        <GalaMark className="mt-20" />
      </section>
    </>
  )
}
