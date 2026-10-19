'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Pause, Play } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { BilingualStack } from '@/components/editorial/BilingualStack'
import { Marquee } from '@/components/editorial/Marquee'
import { EqualizerBars } from '@/components/media/EqualizerBars'
import { GrainOverlay } from '@/components/media/GrainOverlay'
import { AmbientHeroPlayer } from '@/components/media/AmbientHeroPlayer'
import { buttonClass } from '@/components/primitives/buttonClass'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { heroMedia } from '@/lib/mock/home'
import { artists } from '@/lib/mock/artists'

export function HomeHero() {
  const t = useTranslations('home.hero')
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  // Footage on desktop only; phones and reduced motion get the still (Ken Burns when motion is allowed).
  const showVideo = Boolean(heroMedia.videoSrc) && wide && !reduced

  const toggleVideo = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-black text-white">
      {/* Stage: footage graded gold over deep blacks. */}
      <div className="grade-stage absolute inset-0">
        <Image
          src={heroMedia.poster}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className={showVideo ? 'object-cover' : 'object-cover motion-safe:animate-[kenburns_24s_ease-in-out_infinite_alternate]'}
        />
        {showVideo && (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            src={heroMedia.videoSrc ?? undefined}
            poster={heroMedia.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        )}
      </div>
      {/* Legibility: the room is darkest where the type sits. */}
      <div aria-hidden className="absolute inset-0 z-3 bg-linear-to-t from-black via-black/55 to-black/25" />
      <GrainOverlay className="absolute inset-0 z-3 size-full" opacity={0.08} />

      <div className="relative z-10 section-pad-x flex flex-1 flex-col justify-between gap-10 pt-8 pb-8 md:pt-10">
        <div className="flex flex-col items-start gap-3 md:flex-row md:justify-between md:gap-4">
          <p className="text-mono-meta text-gold-bright">{t('tag')}</p>
          <div className="flex items-center gap-3">
            <AmbientHeroPlayer label={t('nowPlaying')} />
            {!reduced && <EqualizerBars compact className="h-3! w-5!" />}
          </div>
        </div>

        <div className="max-w-6xl">
          <BilingualStack
            fr={t('headlineFr')}
            en={t('headlineEn')}
            emFr={t('headlineEmFr')}
            emEn={t('headlineEmEn')}
            tone="stage"
          />
          <p className="text-lede mt-8 max-w-xl text-white/80">{t('subhead')}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/apply" className={buttonClass({ size: 'lg' })}>
              {t('ctaApply')}
            </Link>
            <a
              href="#next-show"
              className={buttonClass({ size: 'lg', variant: 'ghost', className: 'text-white border-white/50 hover:border-gold' })}
            >
              {t('ctaNextShow')}
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <Marquee
            ariaLabel={t('marqueeLabel')}
            items={artists.map((a) => ({ label: a.name, meta: a.genre }))}
            className="border-white/15 text-white"
          />
          <div className="flex items-center justify-between gap-4 text-mono-micro text-white/70">
            <span>{heroMedia.isPlaceholder && showVideo ? t('videoPlaceholder') : null}</span>
            {showVideo && (
              <button
                type="button"
                onClick={toggleVideo}
                aria-pressed={paused}
                className="inline-flex items-center gap-2 transition-colors hover:text-gold-bright"
              >
                {paused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
                {paused ? t('videoPlay') : t('videoPause')}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
