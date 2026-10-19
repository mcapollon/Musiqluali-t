'use client'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/utils/cn'

/** Fades and lifts its content into place once, when scrolled into view. */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2)
  return (
    <div
      ref={ref}
      className={cn('transition-[opacity,transform] duration-700 ease-gala', inView ? 'opacity-100' : 'opacity-0', className)}
      style={{ transform: inView ? undefined : `translateY(${y}px)`, transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
