'use client'
import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAudioStore } from '@/lib/audio/store'
import { createAmbientHero } from '@/lib/audio/ambientHero'

export function AmbientHeroPlayer({ label }: { label: string }) {
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const engineRef = useRef<ReturnType<typeof createAmbientHero> | null>(null)
  const artistTrackVisible = useAudioStore((s) => s.visible && s.isPlaying)

  useEffect(() => {
    return () => engineRef.current?.destroy()
  }, [])

  // Duck when artist track plays
  useEffect(() => {
    if (!engineRef.current || !playing) return
    if (artistTrackVisible) {
      engineRef.current.setMuted(true)
    } else if (!muted) {
      engineRef.current.setMuted(false)
    }
  }, [artistTrackVisible, playing, muted])

  if (reduced) return null

  const togglePlay = () => {
    if (!engineRef.current) engineRef.current = createAmbientHero()
    if (playing) {
      engineRef.current.stop()
      setPlaying(false)
    } else {
      engineRef.current.start()
      setPlaying(true)
    }
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    engineRef.current?.setMuted(next)
  }

  return (
    <div className="inline-flex items-center gap-3 text-mono-meta">
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? 'Pause hero ambient' : 'Play hero ambient'}
        aria-pressed={playing}
        className="inline-flex items-center gap-2 text-saffron hover:text-bone transition-colors"
      >
        {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
        <span>{playing ? label : `▸ ${label}`}</span>
      </button>
      {playing && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute hero ambient' : 'Mute hero ambient'}
          aria-pressed={muted}
          className="text-bone-mute hover:text-saffron transition-colors"
        >
          {muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
        </button>
      )}
    </div>
  )
}
