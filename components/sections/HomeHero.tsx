'use client'
import { useTranslations } from 'next-intl'
import { BilingualStack } from '@/components/editorial/BilingualStack'
import { KenBurnsImage } from '@/components/media/KenBurnsImage'
import { Marquee } from '@/components/editorial/Marquee'
import { artists } from '@/lib/mock/artists'

export function HomeHero() {
  const t = useTranslations('home.hero')
  const portraits = artists.slice(0, 3).map((a) => ({ src: a.photo, alt: a.name }))
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <KenBurnsImage sources={portraits} className="absolute inset-0" />
      <div className="relative z-10 section-pad-x flex min-h-[100svh] flex-col justify-between pt-32 pb-12">
        <p className="text-mono-meta text-bone-mute">{t('tag')}</p>
        <div>
          <BilingualStack fr={t('headlineFr')} en={t('headlineEn')} />
        </div>
        <Marquee
          ariaLabel={t('marqueeLabel')}
          items={artists.map((a) => ({ label: a.name, meta: a.genre }))}
        />
        <p className="text-mono-meta text-bone-mute mt-4">SCROLL ↓</p>
      </div>
    </section>
  )
}
