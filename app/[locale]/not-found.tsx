import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/primitives/Button'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <section className="section-pad-x section-pad-y pt-32 min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
      <h1 className="text-display-xl font-display">404</h1>
      <p className="text-mono-meta text-saffron">{t('eyebrow')}</p>
      <p className="text-bone-mute max-w-md">{t('body')}</p>
      <div className="flex gap-3">
        <Link href="/"><Button variant="primary">{t('home')}</Button></Link>
        <Link href="/apply"><Button variant="ghost">{t('apply')}</Button></Link>
      </div>
    </section>
  )
}
