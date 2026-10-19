import { useTranslations } from 'next-intl'
import { PullQuote } from '@/components/editorial/PullQuote'
import { GalaMark } from '@/components/editorial/GalaMark'

// TODO: the current quote is attributed to an invented founder (MUSIQUALIT_VISION.md §5.1).
// Replace with a real, approved quote and attribution before launch.
export function HomeQuote() {
  const t = useTranslations('home.quote')
  return (
    <section className="section-pad-x section-pad-y border-t border-rule">
      <GalaMark className="mb-16" />
      <PullQuote quote={t('quote')} attribution={t('attribution')} />
    </section>
  )
}
