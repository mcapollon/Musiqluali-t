import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { buttonClass } from '@/components/primitives/buttonClass'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <section className="section-pad-x section-pad-y flex min-h-[70vh] flex-col justify-center">
      <p className="text-mono-meta text-bone-mute">{t('eyebrow')}</p>
      <h1 className="text-display-hero mt-8">404</h1>
      <p className="text-lede mt-8 max-w-md text-bone-mute">{t('body')}</p>
      <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
        <Link href="/" className={buttonClass({ size: 'lg' })}>
          {t('home')}
        </Link>
        <Link href="/apply" className={buttonClass({ variant: 'link' })}>
          {t('apply')} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
