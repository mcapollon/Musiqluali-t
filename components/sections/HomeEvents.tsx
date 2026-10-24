import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { EventPoster } from '@/components/cards/EventPoster'
import { EventRow } from '@/components/cards/EventRow'
import { events } from '@/lib/mock/events'

// Upcoming only, soonest first. Evaluated at build/render time (static page).
const NOW = Date.now()
const UPCOMING = events
  .filter((e) => new Date(e.dateISO).getTime() >= NOW)
  .sort((a, b) => a.dateISO.localeCompare(b.dateISO))

export function HomeEvents() {
  const t = useTranslations('home.events')
  const [next, ...later] = UPCOMING
  return (
    <section id="next-show" className="section-pad-x section-pad-y scroll-mt-24">
      <ChapterMark number="04" title={t('chapter')} />
      <div className="mt-12 md:mt-16">
        <EventPoster event={next} />
      </div>
      {later.length > 0 && (
        <div className="mt-16">
          {later.slice(0, 2).map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </div>
      )}
    </section>
  )
}
