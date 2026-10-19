import { cn } from '@/lib/utils/cn'

/**
 * Page label for inner pages: gold lozenge · page name · hairline that draws in.
 * Replaces "Chapter 00", which read as a counter on single-chapter pages.
 */
export function PageEyebrow({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span aria-hidden className="size-1.5 shrink-0 rotate-45 bg-gold" />
      <p className="text-mono-meta whitespace-nowrap text-gold">{label}</p>
      <span aria-hidden className="animate-rule h-px flex-1 bg-rule" />
    </div>
  )
}
