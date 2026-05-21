import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/primitives/Button'
import { MagneticCTA } from '@/components/motion/MagneticCTA'

export function HomeApplyCTA() {
  const t = useTranslations('home.applyCta')
  return (
    <section className="bg-saffron text-ink">
      <div className="section-pad-x section-pad-y space-y-8">
        <h2 className="text-display-l font-display">{t('headline')}</h2>
        <p className="max-w-xl">{t('blurb')}</p>
        <div className="flex flex-wrap gap-4">
          <MagneticCTA><Link href="/apply"><Button variant="primary" size="lg" className="bg-ink text-bone hover:bg-[color:var(--color-ink-2)]">{t('primaryCta')}</Button></Link></MagneticCTA>
          <MagneticCTA><Link href="/programs"><Button variant="ghost" size="lg" className="border-ink text-ink hover:bg-ink/10">{t('secondaryCta')}</Button></Link></MagneticCTA>
        </div>
      </div>
    </section>
  )
}
