import { useTranslations } from 'next-intl'
import { PullQuote } from '@/components/editorial/PullQuote'

export function HomeQuote() {
  const t = useTranslations('home.quote')
  return (
    <section className="section-pad-x section-pad-y bg-[color:var(--color-ink-2)]">
      <PullQuote quote={t('quote')} attribution={t('attribution')} />
    </section>
  )
}
