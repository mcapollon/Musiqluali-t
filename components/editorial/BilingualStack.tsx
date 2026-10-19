'use client'
import { useLocale } from 'next-intl'
import { DisplayHeading } from './DisplayHeading'

type Props = { fr: string; en: string; emFr?: string; emEn?: string; play?: boolean }

export function BilingualStack({ fr, en, emFr, emEn, play }: Props) {
  const locale = useLocale()
  const isFr = locale === 'fr'
  return (
    <div className="relative">
      <DisplayHeading
        text={isFr ? fr : en}
        emphasis={isFr ? emFr : emEn}
        size="xl"
        as="h1"
        delay={0.1}
        play={play}
        className="relative z-10 text-white"
      />
      <p aria-hidden className="font-display text-xl md:text-3xl italic text-white/70 mt-4" lang={isFr ? 'en' : 'fr'}>
        {isFr ? en : fr}
      </p>
    </div>
  )
}
