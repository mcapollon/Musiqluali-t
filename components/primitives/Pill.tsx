import { cn } from '@/lib/utils/cn'
type Props = React.HTMLAttributes<HTMLSpanElement> & { active?: boolean }
export function Pill({ className, active, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-full border px-3 text-xs uppercase tracking-wider',
        active ? 'border-saffron text-saffron' : 'border-[color:var(--color-rule)] text-bone-mute',
        className,
      )}
      {...rest}
    />
  )
}
