'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react'
import { useAudioStore } from '@/lib/audio/store'
import { Waveform } from './Waveform'
import { useEffect, useRef } from 'react'

export function StickyMiniPlayer() {
  const { current, isPlaying, visible, toggle, next, prev, close, setProgress } = useAudioStore()
  const audioRef = useRef<HTMLAudioElement>(null)

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
          aria-label="Audio player"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl rounded-2xl border border-[color:var(--color-rule)] bg-[color:var(--color-ink-2)] p-4 backdrop-blur"
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <button aria-label="Previous" onClick={prev} className="p-2">
                <SkipBack className="size-4" />
              </button>
              <button aria-label={isPlaying ? 'Pause' : 'Play'} onClick={toggle} className="p-2">
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
              </button>
              <button aria-label="Next" onClick={next} className="p-2">
                <SkipForward className="size-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{current.title}</p>
              <p className="truncate text-mono-meta text-bone-mute">{current.artistName}</p>
            </div>
            <Waveform active={isPlaying} className="hidden sm:flex" />
            <button aria-label="Close player" onClick={close} className="p-2">
              <X className="size-4" />
            </button>
            <audio ref={audioRef} src={current.src} preload="auto" />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
