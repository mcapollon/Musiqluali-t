'use client'
import { useTranslations } from 'next-intl'
import { BilingualStack } from '@/components/editorial/BilingualStack'
import { KenBurnsImage } from '@/components/media/KenBurnsImage'
import { Marquee } from '@/components/editorial/Marquee'
import { VinylDisc } from '@/components/media/VinylDisc'
import { EqualizerBars } from '@/components/media/EqualizerBars'
import { GrainOverlay } from '@/components/media/GrainOverlay'
import { artists } from '@/lib/mock/artists'

export function HomeHero() {
  const t = useTranslations('home.hero')
  const portraits = artists.slice(0, 3).map((a) => ({ src: a.photo, alt: a.name }))
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Layer 1: tinted portrait wash (very subtle) */}
      <div className="absolute inset-0 opacity-30">
        <KenBurnsImage sources={portraits} className="absolute inset-0" />
      </div>

      {/* Layer 2: equalizer bars across full width, behind type */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] opacity-50">
        <EqualizerBars />
      </div>

      {/* Layer 3: vinyl disc, right side, very large */}
      <div className="absolute right-[-15%] top-[10%] w-[70vmin] aspect-square pointer-events-none">
        <VinylDisc className="w-full h-full" />
      </div>

      {/* Layer 4: grain overlay */}
      <GrainOverlay className="absolute inset-0 w-full h-full" />

      {/* Layer 5: content */}
      <div className="relative z-10 section-pad-x flex min-h-[100svh] flex-col justify-between pt-32 pb-12">
        <div className="flex items-start justify-between">
          <p className="text-mono-meta text-bone-mute">{t('tag')}</p>
          <p className="text-mono-meta text-saffron hidden md:inline-flex">
            ▸ NOW PLAYING · LA RELÈVE 2026
          </p>
        </div>

        <div className="max-w-[80%]">
          <BilingualStack fr={t('headlineFr')} en={t('headlineEn')} />
          <p className="mt-6 text-bone-mute max-w-md">{t('subhead')}</p>
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
