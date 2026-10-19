import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { buttonClass } from '@/components/primitives/buttonClass'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { GalaMark } from '@/components/editorial/GalaMark'

/** The invitation: a printed card, not a coloured block. */
export function HomeApplyCTA() {
  const t = useTranslations('home.applyCta')
  return (
    <section className="section-pad-x section-pad-y">
      <div className="frame-invitation mx-auto max-w-4xl px-5 py-16 text-center sm:px-12 md:py-24">
        <GalaMark className="mb-10" />
        <DisplayHeading text={t('headline')} size="l" />
        <p className="text-lede mx-auto mt-8 max-w-xl text-bone-mute">{t('blurb')}</p>
        <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Link href="/apply" className={buttonClass({ size: 'lg' })}>
            {t('primaryCta')}
          </Link>
          <Link href="/programs" className={buttonClass({ size: 'lg', variant: 'ghost', className: 'whitespace-normal text-center' })}>
            {t('secondaryCta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
