import { cn } from '@/lib/utils/cn'

export type ButtonVariant = 'primary' | 'ghost' | 'quiet' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-ink hover:bg-gold-bright',
  ghost: 'bg-transparent text-bone border border-rule-strong hover:border-gold hover:text-gold-bright',
  quiet: 'bg-transparent text-bone-mute hover:text-bone underline-offset-[6px] decoration-gold hover:underline',
  /** Secondary action as a text link (pair it with a trailing arrow). */
  link: 'bg-transparent text-bone hover:text-gold-bright',
}

// min-h, not h: on narrow phones a long label may wrap to two lines instead of overflowing the page.
const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-5 py-2 text-[0.6875rem]',
  md: 'min-h-12 px-7 py-2.5 text-xs',
  lg: 'min-h-14 px-9 py-3 text-sm',
}

/**
 * Button look as a class string. Use it on a <Link>/<a> so a navigation
 * control is one element (a link), never a <button> nested inside an <a>.
 * Lives outside Button.tsx so server components can call it.
 */
export function buttonClass({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string | undefined } = {}) {
  return cn(
    'inline-flex max-w-full items-center justify-center gap-3 rounded-none text-center font-sans font-medium uppercase tracking-[0.18em] text-balance sm:whitespace-nowrap transition-colors duration-500',
    variantClass[variant],
    variant === 'link' ? 'min-h-12 px-0 text-xs' : sizeClass[size],
    className,
  )
}
