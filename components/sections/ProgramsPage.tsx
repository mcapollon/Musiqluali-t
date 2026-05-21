import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { Button } from '@/components/primitives/Button'
import { programs } from '@/lib/mock/programs'

export function ProgramsPage() {
  const t = useTranslations('programs')
  const locale = useLocale() as 'fr' | 'en'
  return (
    <>
      <section className="section-pad-x section-pad-y pt-32">
        <ChapterMark number="00" title={t('chapter')} />
        <DisplayHeading text={t('intro')} size="xl" as="h1" />
      </section>
      {programs.map((p, i) => (
        <section key={p.slug} id={p.slug} className="section-pad-x section-pad-y border-t border-[color:var(--color-rule)]">
          <ChapterMark number={String(i + 1).padStart(2, '0')} title={p[locale].title.toUpperCase()} />
          <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
            <div className={`relative aspect-[4/5] rounded-lg overflow-hidden ${i % 2 ? 'md:order-2' : ''}`}>
              <Image src={p.cover} alt={p[locale].title} fill sizes="50vw" className="object-cover" />
            </div>
            <div className="space-y-6">
              <h2 className="text-display-m font-display">{p[locale].title}</h2>
              <p className="text-bone">{p[locale].blurb}</p>
              <div>
                <p className="text-mono-meta text-bone-mute mb-3">{t('outcomes')}</p>
                <ul className="space-y-2 list-none">
                  {p[locale].outcomes.map((o) => <li key={o} className="border-l-2 border-saffron pl-3">{o}</li>)}
                </ul>
              </div>
              <p className="text-mono-meta text-bone-mute">{t('audience')}: <span className="text-bone">{p[locale].audience}</span></p>
              <Link href="/apply"><Button variant="primary">{t('cta')}</Button></Link>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
