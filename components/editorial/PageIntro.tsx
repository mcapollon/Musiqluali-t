import { ChapterMark } from './ChapterMark'
import { DisplayHeading } from './DisplayHeading'
import { cn } from '@/lib/utils/cn'

type Props = {
  chapter: string
  title: string
  emphasis?: string | undefined
  lede?: string | undefined
  number?: string
  className?: string
  children?: React.ReactNode
}

/** Opening of an inner page: chapter mark, the page's h1 at poster scale, optional lede. */
export function PageIntro({ chapter, title, emphasis, lede, number = '00', className, children }: Props) {
  return (
    <section className={cn('section-pad-x pt-14 pb-14 md:pt-24 md:pb-20', className)}>
      <ChapterMark number={number} title={chapter} as="div" />
      <DisplayHeading text={title} emphasis={emphasis} size="xl" as="h1" reveal="load" className="mt-10 max-w-6xl md:mt-14" />
      {lede && <p className="text-lede mt-8 max-w-2xl text-bone-mute">{lede}</p>}
      {children}
    </section>
  )
}
