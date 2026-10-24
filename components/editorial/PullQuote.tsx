import { cn } from '@/lib/utils/cn'

type Props = { quote: string; attribution: string; className?: string }

/** A statement, set large and left-aligned like every other section. */
export function PullQuote({ quote, attribution, className }: Props) {
  return (
    <figure className={cn('sd-rise max-w-5xl', className)}>
      <blockquote className="text-display-l">{quote}</blockquote>
      <figcaption className="text-mono-meta mt-10 text-bone-mute">{attribution}</figcaption>
    </figure>
  )
}
