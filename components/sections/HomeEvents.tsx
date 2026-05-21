import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { EventRow } from '@/components/cards/EventRow'
import { events } from '@/lib/mock/events'

// show only upcoming; computed at module load (server-rendered)
const NOW = Date.now()
const UPCOMING = events.filter((e) => new Date(e.dateISO).getTime() >= NOW).slice(0, 3)

export function HomeEvents() {
  const t = useTranslations('home.events')
  const upcoming = UPCOMING
  return (
    <section className="section-pad-x section-pad-y space-y-12">
      <ChapterMark number="04" title={t('chapter')} />
      <div>{upcoming.map((e) => <EventRow key={e.id} event={e} />)}</div>
    </section>
  )
}
