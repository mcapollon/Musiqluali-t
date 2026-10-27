'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Pause, Play } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { RiseWords } from '@/components/editorial/RiseWords'
import { Marquee } from '@/components/editorial/Marquee'
import { EqualizerBars } from '@/components/media/EqualizerBars'
import { AmbientHeroPlayer } from '@/components/media/AmbientHeroPlayer'
import { buttonClass } from '@/components/primitives/buttonClass'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { heroMedia } from '@/lib/mock/home'
import { artists } from '@/lib/mock/artists'

/**
 * Act I: the spotlight. The house is dark; a single follow spot finds the
 * performer (the footage, seen through a small iris) between the two lines of
 * the title. Scrolling opens the iris to full bleed while the title parts,
 * then the promise and the ways in arrive over the stage.
 * Scrubbed and pinned by the motion system (data-scene="iris"); the iris's
 * opening frame is CSS (html[data-motion], tall screens only) so it paints
 * before hydration. On short screens (small phones, landscape), when the
 * content would not fit the frame (data-flow), and without motion: full
 * footage, title, then copy, in reading order. The marquee sits below the
 * frame, never inside it, so the pinned frame only holds what fits.
 */
export function HomeOpening() {
  const t = useTranslations('home.hero')
  const reduced = useReducedMotion()
  // False until hydrated, then true unless reduced motion: the video never autoplays for reduced-motion users.
  const motionOk = useMediaQuery('(prefers-reduced-motion: no-preference)')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  // Footage at every size (portrait screens get a lighter portrait crop); reduced motion gets the still.
  const showVideo = Boolean(heroMedia.videoSrc) && motionOk

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
    <section id="overture" data-act className="relative bg-black text-white">
      <div data-scene="iris" className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-clip">
        {/* The footage as shot (black and white): no gold grade on the spotlight. */}
        <div data-iris-media className="absolute inset-0 overflow-clip bg-black">
          <div data-iris-zoom className="absolute inset-0">
            <Image
              src={heroMedia.poster}
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
            {showVideo && (
              <video
                ref={videoRef}
                className="absolute inset-0 size-full object-cover"
                poster={heroMedia.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
              >
                {/* Chosen once, at load: portrait screens (phones, portrait tablets) get the centre crop. */}
                {heroMedia.videoSrcPortrait && (
                  <source src={heroMedia.videoSrcPortrait} media="(max-aspect-ratio: 3/4)" type="video/mp4" />
                )}
                <source src={heroMedia.videoSrc ?? undefined} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
        {/* Legibility once the stage is open: darkest where the copy sits. */}
        <div data-iris-shade aria-hidden className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/30" />

        <div
          data-iris-bar
          className="section-pad-x relative z-10 flex flex-col items-start gap-3 pt-8 md:flex-row md:justify-between md:gap-4 md:pt-10"
        >
          <p className="text-mono-meta text-white/70">{t('tag')}</p>
          <div className="flex items-center gap-3">
            <AmbientHeroPlayer label={t('nowPlaying')} />
            {!reduced && <EqualizerBars />}
          </div>
        </div>

        {/* The title frames the spot: one line above it, one below. */}
        <div className="iris-title section-pad-x relative z-10 py-16 md:py-20">
          <h1 className="text-display-hero text-center text-white">
            <span className="sr-only">
              {t('lineA')} {t('lineB')}
            </span>
            <span aria-hidden data-iris-line="a" className="block">
              <RiseWords text={t('lineA')} />
            </span>
            {/* The gap the spot shines through (only while the iris is small). */}
            <span aria-hidden className="iris-gap block" />
            <span aria-hidden data-iris-line="b" className="block">
              <RiseWords text={t('lineB')} emphasis={t('lineBEm')} from={2} />
            </span>
          </h1>
        </div>

        <p
          data-iris-cue
          aria-hidden
          className="text-mono-micro iris-cue absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 text-white/70"
        >
          {t('scrollCue')}
          <span className="h-10 w-px bg-linear-to-b from-gold to-transparent" />
        </p>

        <div data-iris-copy className="section-pad-x relative z-10 mt-auto flex flex-col gap-8 pb-14 md:gap-10 md:pb-16">
          <p className="text-lede max-w-2xl text-white/85 md:text-[1.375rem] md:leading-[1.6]">{t('lede')}</p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <Link href="/apply" className={buttonClass({ size: 'lg' })}>
              {t('ctaApply')}
            </Link>
            <a href="#next-show" className={buttonClass({ variant: 'link', className: 'text-white' })}>
              {t('ctaNextShow')} <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {showVideo && (
          <div className="section-pad-x absolute right-0 bottom-6 z-20 flex items-center gap-6 text-mono-micro text-white/70">
            {heroMedia.isPlaceholder && <span>{t('videoPlaceholder')}</span>}
            <button
              type="button"
              onClick={toggleVideo}
              aria-pressed={paused}
              className="inline-flex items-center gap-2 transition-colors hover:text-gold-bright"
            >
              {paused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
              {paused ? t('videoPlay') : t('videoPause')}
            </button>
          </div>
        )}
      </div>

      {/* The artists' names, as the house settles. */}
      <div className="border-t border-rule">
        <Marquee
          ariaLabel={t('marqueeLabel')}
          items={artists.map((a) => ({ label: a.name, meta: a.genre }))}
          className="text-white"
        />
      </div>
    </section>
  )
}
