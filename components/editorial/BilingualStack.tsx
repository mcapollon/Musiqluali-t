'use client'
import { useLocale } from 'next-intl'
import { DisplayHeading } from './DisplayHeading'

type Props = { fr: string; en: string }

export function BilingualStack({ fr, en }: Props) {
  const locale = useLocale()
  const primary = locale === 'fr' ? fr : en
  const alt = locale === 'fr' ? en : fr
  return (
    <div className="relative">
      <DisplayHeading text={primary} size="xl" as="h1" className="relative z-10" />
      <p
        aria-hidden
        className="text-display-m opacity-30 mt-2 italic"
        lang={locale === 'fr' ? 'en' : 'fr'}
      >
        {alt}
      </p>
    </div>
  )
}
