import { Fragment } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = { items: { label: string; meta?: string }[]; speed?: number; ariaLabel: string; className?: string }

/**
 * Slow procession of names. Pure CSS (transform only); pauses on hover and
 * keyboard focus, stops entirely under prefers-reduced-motion.
 */
export function Marquee({ items, speed = 90, ariaLabel, className }: Props) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-baseline gap-10 pr-10">
      {items.map((item, i) => (
        <Fragment key={`${item.label}-${i}`}>
          <li className="flex items-baseline gap-3 whitespace-nowrap">
            <span className="font-display text-2xl font-light tracking-[-0.01em] md:text-3xl">{item.label}</span>
            {item.meta && <span className="text-mono-micro opacity-70">{item.meta}</span>}
          </li>
          <li aria-hidden className="size-1 shrink-0 rotate-45 self-center bg-gold" />
        </Fragment>
      ))}
    </ul>
  )
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className={cn('group relative overflow-hidden border-y border-rule py-4', className)}
    >
      <div
        className="flex w-max motion-safe:animate-[marquee_var(--marquee-speed)_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] group-focus:[animation-play-state:paused]"
        style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
