import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { ProgramCard } from '@/components/cards/ProgramCard'
import { programs } from '@/lib/mock/programs'

export function HomeProgramsPreview() {
  const t = useTranslations('home.programs')
  return (
    <section className="section-pad-y border-t border-rule">
      <div className="section-pad-x">
        <ChapterMark number="02" title={t('chapter')} />
      </div>
      {/* Gallery wall: scrolls sideways on its own, never hijacks vertical scroll. */}
      <div className="mt-14 overflow-x-auto overscroll-x-contain md:mt-20">
        <ul className="section-pad-x flex w-max snap-x snap-mandatory gap-8 pb-6 md:gap-12">
          {programs.map((p, i) => (
            <li key={p.slug} className="snap-start">
              <ProgramCard program={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
