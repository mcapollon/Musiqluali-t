'use client'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/utils/cn'

export function ChapterMark({ number, title, as: As = 'h2' }: { number: string; title: string; as?: 'h2' | 'div' }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.5)
  return (
    <div ref={ref} className="flex items-baseline gap-4 md:gap-6">
      {/* Quiet label: number in gold, then the section name. */}
      <As className="text-mono-meta flex items-baseline gap-3 whitespace-nowrap">
        <span className="text-gold">{number}</span>
        <span aria-hidden className="text-bone-mute">—</span>
        <span className="text-bone">{title}</span>
      </As>
      {/* Gold rule draws itself in when the chapter arrives. */}
      <span
        aria-hidden
        className={cn(
          'h-px flex-1 self-center origin-left bg-rule transition-transform duration-[1100ms] ease-gala',
          inView ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </div>
  )
}
