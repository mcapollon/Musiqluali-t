import { cn } from '@/lib/utils/cn'

type Props = { bars?: number; active?: boolean; className?: string }

/** Decorative bars beside a playing track (the track title carries the meaning). */
export function Waveform({ bars = 24, active = false, className }: Props) {
  return (
    <div aria-hidden className={cn('flex h-6 items-end gap-[2px]', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="h-full w-[2px] origin-bottom bg-gold"
          style={
            active
              ? { animation: `wave ${0.9 + (i % 5) * 0.1}s ease-in-out ${i * 0.02}s infinite alternate` }
              : { transform: 'scaleY(0.2)' }
          }
        />
      ))}
    </div>
  )
}
