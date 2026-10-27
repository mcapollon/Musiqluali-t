import { cn } from '@/lib/utils/cn'

const toneCls = {
  gold: 'text-gold-sheen',
  white: 'text-bone',
  /** The highlight copy used by the opening's light sweep. */
  light: 'text-white',
} as const

/**
 * PLACEHOLDER wordmark — set in the headline serif until the real MusiqualiT
 * logo file (SVG, gold + white versions) is supplied and approved.
 * Swap the inner text for the SVG; keep the props.
 */
export function Wordmark({ className, tone = 'gold' }: { className?: string; tone?: keyof typeof toneCls }) {
  return (
    <span className={cn('font-display font-medium leading-none tracking-[-0.01em]', toneCls[tone], className)}>
      MusiqualiT
    </span>
  )
}
