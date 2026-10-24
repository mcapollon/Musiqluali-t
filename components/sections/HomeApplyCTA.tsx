import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { buttonClass } from '@/components/primitives/buttonClass'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'

/** The invitation: one large line, one action, one way to learn more. */
export function HomeApplyCTA() {
  const t = useTranslations('home.applyCta')
  return (
    <section className="section-pad-x section-pad-y">
      <DisplayHeading text={t('headline')} size="xl" className="max-w-5xl" />
      <div className="sd-rise mt-10 max-w-xl">
        <p className="text-lede text-bone-mute">{t('blurb')}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <Link href="/apply" className={buttonClass({ size: 'lg' })}>
            {t('primaryCta')}
          </Link>
          <Link href="/programs" className={buttonClass({ variant: 'link' })}>
            {t('secondaryCta')} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
