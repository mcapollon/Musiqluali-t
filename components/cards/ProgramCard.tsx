import Image from 'next/image'
import { Link } from '@/lib/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { Program } from '@/lib/mock/programs'

export function ProgramCard({ program }: { program: Program }) {
  const locale = useLocale() as 'fr' | 'en'
  const t = useTranslations('common')
  const copy = program[locale]
  return (
    <Link
      href={{ pathname: '/programs', hash: program.slug }}
      className="group relative shrink-0 w-[80vw] sm:w-[60vw] md:w-[420px] aspect-[3/4] overflow-hidden rounded-lg block"
    >
      <Image
        src={program.cover}
        alt={copy.title}
        fill
        sizes="(max-width: 768px) 80vw, 420px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
      <div className="absolute inset-x-6 bottom-6 space-y-2">
        <h3 className="text-display-m font-display">{copy.title}</h3>
        <p className="text-bone-mute">{copy.blurb}</p>
        <span className="text-mono-meta text-saffron">→ {t('learnMore')}</span>
      </div>
    </Link>
  )
}
