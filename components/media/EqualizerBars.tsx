'use client'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAudioStore } from '@/lib/audio/store'
import { cn } from '@/lib/utils/cn'

const BARS = 5
const IDLE = [20, 44, 32, 56, 26]

/**
 * Small gold indicator beside the hero's NOW PLAYING control. Static while
 * silent; follows the ambient track's analyser while it plays.
 */
export function EqualizerBars({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const analyser = useAudioStore((s) => s.ambientAnalyser)
  const playing = useAudioStore((s) => s.ambientPlaying)
  const [heights, setHeights] = useState<number[]>(IDLE)
  const rafRef = useRef<number | null>(null)
  const live = Boolean(analyser && playing && !reduced)

  useEffect(() => {
    if (!live || !analyser) return
    const buf = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(buf)
      // Sample evenly across low+mid frequencies; map 0–255 to 12–95 %.
      const next = Array.from({ length: BARS }, (_, i) => {
        const start = Math.floor((i / BARS) * buf.length * 0.7)
        const end = Math.floor(((i + 1) / BARS) * buf.length * 0.7)
        let sum = 0
        for (let j = start; j < end; j++) sum += buf[j] ?? 0
        return 12 + (sum / Math.max(1, end - start) / 255) * 83
      })
      setHeights(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [live, analyser])

  const shown = live ? heights : IDLE
  return (
    <div aria-hidden className={cn('flex h-3 w-5 items-end justify-between gap-[2px]', className)}>
      {shown.map((h, i) => (
        <span key={i} className="flex-1 bg-gold" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}
