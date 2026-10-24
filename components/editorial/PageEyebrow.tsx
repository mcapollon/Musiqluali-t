import { cn } from '@/lib/utils/cn'

/** Page label for inner pages: the page name, small and grey. */
export function PageEyebrow({ label, className }: { label: string; className?: string }) {
  return <p className={cn('text-mono-meta text-bone-mute', className)}>{label}</p>
}
