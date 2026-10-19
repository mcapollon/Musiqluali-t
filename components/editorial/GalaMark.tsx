import { cn } from '@/lib/utils/cn'

/** Small gold mark between sections: hairline · lozenge · hairline. Decorative. */
export function GalaMark({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('flex items-center justify-center gap-4', className)}>
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold/70 md:w-24" />
      <span className="size-1.5 rotate-45 bg-gold" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold/70 md:w-24" />
    </div>
  )
}
