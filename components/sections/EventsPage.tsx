'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { EventRow } from '@/components/cards/EventRow'
import { events } from '@/lib/mock/events'

// Hoisted out of render to satisfy react-hooks/purity (same as HomeEvents).
const NOW = Date.now()
const UPCOMING = events.filter((e) => new Date(e.dateISO).getTime() >= NOW)
const PAST = events.filter((e) => new Date(e.dateISO).getTime() < NOW)

export function EventsPage() {
  const t = useTranslations('eventsPage')
  const [tab, setTab] = useState<string>('upcoming')

  return (
    <>
      <section className="section-pad-x section-pad-y pt-32 space-y-6">
        <ChapterMark number="00" title={t('chapter')} />
        <DisplayHeading text={t('intro')} size="xl" as="h1" />
      </section>
      <section className="section-pad-x section-pad-y">
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="space-y-8">
          <TabsList className="bg-transparent">
            <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
            <TabsTrigger value="past">{t('past')}</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {UPCOMING.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </TabsContent>
          <TabsContent value="past">
            <div className="opacity-60">
              {PAST.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}
