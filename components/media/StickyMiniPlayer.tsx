'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react'
import { useAudioStore } from '@/lib/audio/store'
import { Waveform } from './Waveform'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

export function StickyMiniPlayer() {
  const { current, isPlaying, visible, toggle, next, prev, close, setProgress } = useAudioStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  const t = useTranslations('a11y')

  useEffect(() => {
    const a = audioRef.current
    if (!a || !current) return
    if (isPlaying) {
      a.play().catch(() => {
        /* autoplay block — ignore */
      })
    } else {
      a.pause()
    }
  }, [isPlaying, current])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setProgress(a.currentTime / (a.duration || 1))
    a.addEventListener('timeupdate', onTime)
    return () => a.removeEventListener('timeupdate', onTime)
  }, [setProgress])

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.aside
          role="region"
          aria-label={t('audioPlayer')}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="frame-invitation fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl bg-ink-2/95 p-4 backdrop-blur"
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <button type="button" aria-label={t('previous')} onClick={prev} className="p-2 hover:text-gold-bright">
                <SkipBack className="size-4" />
              </button>
              <button type="button" aria-label={isPlaying ? t('pause') : t('play')} onClick={toggle} className="p-2 text-gold hover:text-gold-bright">
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
              </button>
              <button type="button" aria-label={t('next')} onClick={next} className="p-2 hover:text-gold-bright">
                <SkipForward className="size-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{current.title}</p>
              <p className="truncate text-mono-meta text-bone-mute">{current.artistName}</p>
            </div>
            <Waveform active={isPlaying} className="hidden sm:flex" />
            <button type="button" aria-label={t('closePlayer')} onClick={close} className="p-2 hover:text-gold-bright">
              <X className="size-4" />
            </button>
            <audio ref={audioRef} src={current.src} preload="auto" />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
