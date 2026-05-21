import { cn } from '@/lib/utils/cn'

type Props = { quote: string; attribution: string; className?: string }
export function PullQuote({ quote, attribution, className }: Props) {
  return (
    <figure className={cn('mx-auto max-w-5xl text-center', className)}>
      <blockquote className="text-display-l italic font-display">« {quote} »</blockquote>
      <figcaption className="text-mono-meta text-bone-mute mt-8">— {attribution}</figcaption>
    </figure>
  )
}
