import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { EventRow } from '@/components/cards/EventRow'
import { events } from '@/lib/mock/events'

export function HomeEvents() {
  const t = useTranslations('home.events')
  // show only upcoming
  const now = Date.now()
  const upcoming = events.filter((e) => new Date(e.dateISO).getTime() >= now).slice(0, 3)
  return (
    <section className="section-pad-x section-pad-y space-y-12">
      <ChapterMark number="04" title={t('chapter')} />
      <div>{upcoming.map((e) => <EventRow key={e.id} event={e} />)}</div>
    </section>
  )
}
