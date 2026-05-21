import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { ProgramCard } from '@/components/cards/ProgramCard'
import { programs } from '@/lib/mock/programs'

export function HomeProgramsPreview() {
  const t = useTranslations('home.programs')
  return (
    <section className="section-pad-x section-pad-y space-y-12">
      <ChapterMark number="02" title={t('chapter')} />
      <div className="-mx-[clamp(1.25rem,4vw,2.5rem)] overflow-x-auto">
        <div className="flex gap-6 px-[clamp(1.25rem,4vw,2.5rem)] snap-x snap-mandatory pb-6">
          {programs.map((p) => (
            <div key={p.slug} className="snap-start">
              <ProgramCard program={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
