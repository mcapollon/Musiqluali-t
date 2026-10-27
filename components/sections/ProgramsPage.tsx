import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { PageIntro } from '@/components/editorial/PageIntro'
import { buttonClass } from '@/components/primitives/buttonClass'
import { programs } from '@/lib/mock/programs'
import { cn } from '@/lib/utils/cn'

export function ProgramsPage() {
  const t = useTranslations('programs')
  const locale = useLocale() as 'fr' | 'en'
  return (
    <>
      <PageIntro chapter={t('chapter')} title={t('intro')} />
      <nav
        className="section-pad-x sticky top-16 z-30 border-y border-rule bg-ink/90 py-4 backdrop-blur"
        aria-label={t('quickNav')}
      >
        <ul className="flex gap-8 overflow-x-auto">
          {programs.map((p, i) => (
            <li key={p.slug}>
              <a href={`#${p.slug}`} className="text-mono-meta whitespace-nowrap text-bone-mute transition-colors hover:text-gold-bright">
                <span className="text-bone-mute">{String(i + 1).padStart(2, '0')}</span> {p[locale].title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {programs.map((p, i) => (
        <section key={p.slug} id={p.slug} className="section-pad-x section-pad-y scroll-mt-36">
          <ChapterMark number={String(i + 1).padStart(2, '0')} title={p[locale].title} as="div" />
          <div className="mt-12 grid grid-cols-1 items-center gap-12 md:mt-16 md:grid-cols-2 md:gap-20">
            <div data-image-reveal className={cn('grade-portrait relative aspect-[4/5]', i % 2 && 'md:order-2')}>
              {/* PLACEHOLDER image (Unsplash) until real program photos are supplied. */}
              <Image src={p.cover} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" data-parallax className="object-cover" />
            </div>
            <div className="space-y-8">
              <h2 className="text-display-l">{p[locale].title}</h2>
              <p className="text-lede">{p[locale].blurb}</p>
              <div>
                <p className="text-mono-meta mb-4 text-bone-mute">{t('outcomes')}</p>
                <ul className="space-y-3">
                  {p[locale].outcomes.map((o) => (
                    <li key={o} className="border-t border-rule pt-3">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-bone-mute">
                <span className="text-mono-meta mr-2 text-bone-mute">{t('audience')}</span>
                {p[locale].audience}
              </p>
              <Link href="/apply" className={buttonClass({ size: 'lg' })}>
                {t('cta')}
              </Link>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
