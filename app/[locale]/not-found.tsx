import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { GalaMark } from '@/components/editorial/GalaMark'
import { buttonClass } from '@/components/primitives/buttonClass'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <section className="section-pad-x section-pad-y flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="text-mono-meta text-gold">{t('eyebrow')}</p>
      <h1 className="text-display-hero mt-6">
        4<em>0</em>4
      </h1>
      <GalaMark className="my-10" />
      <p className="text-lede max-w-md text-bone-mute">{t('body')}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass({ size: 'lg' })}>
          {t('home')}
        </Link>
        <Link href="/apply" className={buttonClass({ variant: 'ghost', size: 'lg' })}>
          {t('apply')}
        </Link>
      </div>
    </section>
  )
}
