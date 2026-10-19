import { cn } from '@/lib/utils/cn'

/**
 * PLACEHOLDER wordmark — set in the headline serif until the real MusiqualiT
 * logo file (SVG, gold + white versions) is supplied and approved.
 * Swap the inner text for the SVG; keep the props.
 */
export function Wordmark({ className, tone = 'gold' }: { className?: string; tone?: 'gold' | 'white' }) {
  return (
    <span
      className={cn(
        'font-display font-medium leading-none tracking-[-0.02em]',
        tone === 'gold' ? 'text-gold-sheen' : 'text-bone',
        className,
      )}
    >
      MusiqualiT
    </span>
  )
}
