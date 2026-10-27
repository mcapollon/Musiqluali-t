import { cn } from '@/lib/utils/cn'
import { DisplayHeading } from './DisplayHeading'

type Props = { quote: string; attribution: string; className?: string }

/** A statement, set large and left-aligned like every other section; its words rise in reading order. */
export function PullQuote({ quote, attribution, className }: Props) {
  return (
    <figure className={cn('max-w-5xl', className)}>
      <DisplayHeading text={quote} as="blockquote" size="l" />
      <figcaption data-reveal data-reveal-delay="0.4" className="text-mono-meta mt-10 text-bone-mute">
        {attribution}
      </figcaption>
    </figure>
  )
}
