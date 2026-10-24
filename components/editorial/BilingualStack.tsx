'use client'
import { useLocale } from 'next-intl'
import { DisplayHeading } from './DisplayHeading'

/** tone: 'stage' = always over dark footage (fixed white); 'page' = follows the theme. */
type Props = { fr: string; en: string; emFr?: string; emEn?: string; tone?: 'stage' | 'page' }

export function BilingualStack({ fr, en, emFr, emEn, tone = 'page' }: Props) {
  const locale = useLocale()
  const isFr = locale === 'fr'
  return (
    <div className="relative">
      <DisplayHeading
        text={isFr ? fr : en}
        emphasis={isFr ? emFr : emEn}
        size="xl"
        as="h1"
        reveal="load"
        className={tone === 'stage' ? 'relative z-10 text-white' : 'relative z-10 text-bone'}
      />
      <p aria-hidden className={`text-mono-meta mt-6 ${tone === 'stage' ? 'text-white/70' : 'text-bone-mute'}`} lang={isFr ? 'en' : 'fr'}>
        {isFr ? en : fr}
      </p>
    </div>
  )
}
