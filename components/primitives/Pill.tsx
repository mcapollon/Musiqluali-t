import { cn } from '@/lib/utils/cn'
type Props = React.HTMLAttributes<HTMLSpanElement> & { active?: boolean }
export function Pill({ className, active, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex h-9 items-center border px-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-500',
        active ? 'border-gold bg-gold text-ink' : 'border-rule-strong text-bone-mute hover:border-gold hover:text-bone',
        className,
      )}
      {...rest}
    />
  )
}
