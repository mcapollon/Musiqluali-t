'use client'
import { useTranslations } from 'next-intl'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/utils/cn'

export function ChapterMark({ number, title, as: As = 'h2' }: { number: string; title: string; as?: 'h2' | 'div' }) {
  const t = useTranslations('common')
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.5)
  return (
    <div ref={ref} className="flex items-baseline gap-4 md:gap-6">
      <As className="flex items-baseline gap-3 whitespace-nowrap font-normal">
        <span className="text-mono-micro text-bone-mute">{t('chapter')}</span>
        <span className="font-display text-3xl italic leading-none text-gold md:text-4xl">{number}</span>
        <span aria-hidden className="text-gold">—</span>
        <span className="text-mono-meta text-bone">{title}</span>
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
