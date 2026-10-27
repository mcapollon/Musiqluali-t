import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { buttonClass } from '@/components/primitives/buttonClass'
import { NewsletterForm } from './NewsletterForm'

/**
 * Act XI: your place. Three doors, one per audience (MUSIQUALIT_VISION.md §3):
 * artists apply, audiences come to the next show, partners and donors back
 * the work. Then the newsletter.
 */
export function HomeFinale() {
  const t = useTranslations('home')
  const door = (key: 'artists' | 'audience' | 'partners') => ({
    who: t(`finale.doors.${key}.who`),
    title: t(`finale.doors.${key}.title`),
    body: t(`finale.doors.${key}.body`),
    cta: t(`finale.doors.${key}.cta`),
  })
  const artists = door('artists')
  const audience = door('audience')
  const partners = door('partners')

  return (
    <section id="your-seat" data-act className="theme-ivory section-pad-x section-pad-y relative">
      <ChapterMark number="XI" title={t('acts.finale')} />
      <DisplayHeading text={t('finale.title')} emphasis={t('finale.titleEm')} size="xl" as="p" className="mt-12 max-w-5xl md:mt-16" />

      <div data-reveal-group className="mt-16 grid border-t border-rule md:mt-24 md:grid-cols-3">
        <article data-reveal-item className="flex flex-col gap-6 border-b border-rule py-10 md:border-r md:border-b-0 md:pr-10">
          <p className="text-mono-meta text-gold">{artists.who}</p>
          <h3 className="text-display-l">{artists.title}</h3>
          <p className="text-bone-mute">{artists.body}</p>
          <Link href="/apply" className={buttonClass({ size: 'lg', className: 'mt-auto self-start' })}>
            {artists.cta}
          </Link>
        </article>
        <article data-reveal-item className="flex flex-col gap-6 border-b border-rule py-10 md:border-r md:border-b-0 md:px-10">
          <p className="text-mono-meta text-gold">{audience.who}</p>
          <h3 className="text-display-l">{audience.title}</h3>
          <p className="text-bone-mute">{audience.body}</p>
          <a href="#next-show" className={buttonClass({ variant: 'ghost', size: 'lg', className: 'mt-auto self-start' })}>
            {audience.cta}
          </a>
        </article>
        {/* id="donate": the header's "Don" link lands here. TODO: real donation link (Zeffy) once set up. */}
        <article id="donate" data-reveal-item className="flex scroll-mt-28 flex-col gap-6 py-10 md:pl-10">
          <p className="text-mono-meta text-gold">{partners.who}</p>
          <h3 className="text-display-l">{partners.title}</h3>
          <p className="text-bone-mute">{partners.body}</p>
          <a href="#" className={buttonClass({ variant: 'ghost', size: 'lg', className: 'mt-auto self-start' })}>
            {partners.cta}
          </a>
        </article>
      </div>

      <div id="newsletter" data-reveal className="mt-24 flex scroll-mt-24 flex-col justify-between gap-10 border-t border-rule pt-16 md:mt-32 md:flex-row md:items-end">
        <div>
          <p className="text-mono-meta text-bone-mute">{t('newsletter.eyebrow')}</p>
          <h2 className="text-display-l mt-4">{t('newsletter.headline')}</h2>
        </div>
        <NewsletterForm />
      </div>
    </section>
  )
}
