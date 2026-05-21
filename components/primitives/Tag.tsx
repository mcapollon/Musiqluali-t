import { cn } from '@/lib/utils/cn'
type Props = React.HTMLAttributes<HTMLSpanElement> & { tone?: 'default' | 'saffron' }
export function Tag({ className, tone = 'default', ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.7rem] uppercase tracking-wider',
        tone === 'saffron' ? 'bg-saffron text-ink' : 'bg-[color:var(--color-ink-2)] text-bone-mute',
        className,
      )}
      {...rest}
    />
  )
}
