'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useAudioStore } from '@/lib/audio/store'

export function EqualizerBars({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const bars = isMobile ? 24 : 48
  const analyser = useAudioStore((s) => s.ambientAnalyser)
  const playing = useAudioStore((s) => s.ambientPlaying)
  const [heightsState, setHeightsState] = useState<{ bars: number; values: number[] }>(() => ({
    bars,
    values: Array(bars).fill(12) as number[],
  }))
  const rafRef = useRef<number | null>(null)

  // Derive heights matching the current bar count without setState-in-effect
  const heights =
    heightsState.bars === bars ? heightsState.values : (Array(bars).fill(12) as number[])

  useEffect(() => {
    if (!analyser || !playing || reduced) return
    const buf = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(buf)
      // Sample buf evenly across bars; map 0-255 to 12-95%
      const next = Array.from({ length: bars }).map((_, i) => {
        const start = Math.floor((i / bars) * buf.length * 0.7) // weight toward low+mid freqs
        const end = Math.floor(((i + 1) / bars) * buf.length * 0.7)
        let sum = 0
        let count = 0
        for (let j = start; j < end; j++) {
          sum += buf[j] ?? 0
          count++
        }
        const avg = count > 0 ? sum / count : 0
        return 12 + (avg / 255) * 83
      })
      setHeightsState({ bars, values: next })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [analyser, playing, reduced, bars])

  // Idle keyframe animation (when ambient not playing)
  const live = analyser && playing && !reduced

  return (
    <div
      className={`flex items-end justify-between gap-[2px] w-full h-full ${className ?? ''}`}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (i * 37) % 9
        const tint = i % 3 === 0 ? 'bg-saffron/40' : 'bg-bone/15'
        if (live) {
          return (
            <span
              key={i}
              className={`flex-1 ${tint} rounded-t-sm transition-[height] duration-75`}
              style={{ height: `${heights[i] ?? 12}%` }}
            />
          )
        }
        return (
          <motion.span
            key={i}
            className={`flex-1 ${tint} rounded-t-sm`}
            initial={{ height: '12%' }}
            animate={
              reduced
                ? { height: `${20 + seed * 5}%` }
                : { height: ['12%', `${30 + seed * 7}%`, '20%', `${60 + seed * 4}%`, '15%'] }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    duration: 1.4 + seed * 0.15,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                    delay: i * 0.04,
                  }
            }
          />
        )
      })}
    </div>
  )
}
