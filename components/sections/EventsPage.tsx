'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageIntro } from '@/components/editorial/PageIntro'
import { EventPoster } from '@/components/cards/EventPoster'
import { EventRow } from '@/components/cards/EventRow'
import { events } from '@/lib/mock/events'

// Hoisted out of render to satisfy react-hooks/purity (same as HomeEvents).
const NOW = Date.now()
const UPCOMING = events
  .filter((e) => new Date(e.dateISO).getTime() >= NOW)
  .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
const PAST = events
  .filter((e) => new Date(e.dateISO).getTime() < NOW)
  .sort((a, b) => b.dateISO.localeCompare(a.dateISO))

const tabCls =
  'text-mono-meta h-11 flex-none rounded-none border-0 px-0 text-bone-mute data-active:text-bone after:bg-bone hover:text-bone'

export function EventsPage() {
  const t = useTranslations('eventsPage')
  const [tab, setTab] = useState<string>('upcoming')
  const [next, ...later] = UPCOMING

  return (
    <>
      <PageIntro chapter={t('chapter')} title={t('intro')} />
      {/* The next show (or the flagship, date to be announced) at poster scale. */}
      <section className="section-pad-x">
        <EventPoster event={next} headingAs="h2" />
      </section>
      <section className="section-pad-x section-pad-y">
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="flex-col gap-10">
          <TabsList variant="line" className="h-auto gap-8 border-b border-rule p-0">
            <TabsTrigger value="upcoming" className={tabCls}>
              {t('upcoming')}
            </TabsTrigger>
            <TabsTrigger value="past" className={tabCls}>
              {t('past')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="text-base">
            {later.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
            {UPCOMING.length === 0 && <p className="text-lede text-bone-mute">{t('noneUpcoming')}</p>}
          </TabsContent>
          <TabsContent value="past" className="text-base">
            {PAST.map((e) => (
              <EventRow key={e.id} event={e} archival />
            ))}
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}
