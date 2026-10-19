import { cn } from '@/lib/utils/cn'

type Props = { quote: string; attribution: string; className?: string }
export function PullQuote({ quote, attribution, className }: Props) {
  return (
    <figure className={cn('mx-auto max-w-5xl text-center', className)}>
      <span aria-hidden className="block font-display text-[6rem] italic leading-[0.6] text-gold md:text-[9rem]">
        «
      </span>
      <blockquote className="text-display-l mt-6 italic">{quote}</blockquote>
      <figcaption className="mt-10 flex items-center justify-center gap-4 text-mono-meta text-gold">
        <span aria-hidden className="h-px w-10 bg-gold/60" />
        {attribution}
        <span aria-hidden className="h-px w-10 bg-gold/60" />
      </figcaption>
    </figure>
  )
}
