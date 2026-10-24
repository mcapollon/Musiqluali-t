import Image from 'next/image'
import { Link } from '@/lib/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { Program } from '@/lib/mock/programs'

/** A program hung like a piece in an exhibition: plate number, image, caption. */
export function ProgramCard({ program, index }: { program: Program; index: number }) {
  const locale = useLocale() as 'fr' | 'en'
  const t = useTranslations('common')
  const copy = program[locale]
  return (
    <Link
      href={{ pathname: '/programs', hash: program.slug }}
      className="group block w-[78vw] shrink-0 sm:w-[52vw] md:w-[24rem] lg:w-[26rem]"
    >
      <div className="sd-reveal grade-portrait relative aspect-[4/5] w-full">
        {/* PLACEHOLDER image (Unsplash) until real program photos are supplied. */}
        <Image
          src={program.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 78vw, 26rem"
          className="sd-parallax object-cover"
        />
      </div>
      {/* One left edge: number, title, text and link all align with the image. */}
      <div className="mt-6 space-y-3">
        <span className="text-mono-meta block text-bone-mute" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-display-m transition-colors duration-500 group-hover:text-gold-bright">{copy.title}</h3>
        <p className="text-bone-mute">{copy.blurb}</p>
        <span className="text-mono-micro inline-block pt-2 text-bone transition-colors group-hover:text-gold-bright">
          {t('learnMore')} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
