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

/** Act VIII: the next date, at poster scale; it opens to full bleed as it arrives (data-progress-scene). */
export function HomeNextShow() {
  const t = useTranslations('home')
  const [next, ...later] = UPCOMING
  return (
    <section id="next-show" data-act className="section-pad-x section-pad-y scroll-mt-24">
      <ChapterMark number="VIII" title={t('acts.nextShow')} />
      <div className="mt-12 md:mt-16">
        <EventPoster event={next} />
      </div>
      {later.length > 0 && (
        <div data-reveal-group className="mt-16">
          {later.slice(0, 2).map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </div>
      )}
    </section>
  )
}
