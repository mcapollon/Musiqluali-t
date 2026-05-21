'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { ArtistTile } from '@/components/cards/ArtistTile'
import { ArtistModal } from '@/components/cards/ArtistModal'
import { FilterBar } from '@/components/primitives/FilterBar'
import { artists } from '@/lib/mock/artists'

export function ArtistsPage() {
  const t = useTranslations('artistsPage')
  const [genre, setGenre] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const genres = useMemo(() => Array.from(new Set(artists.map((a) => a.genre))).sort(), [])
  const filtered = genre === 'all' ? artists : artists.filter((a) => a.genre === genre)
  const open = artists.find((a) => a.id === openId) ?? null

  return (
    <>
      <section className="section-pad-x section-pad-y pt-32 space-y-8">
        <ChapterMark number="00" title={t('chapter')} />
        <DisplayHeading text={t('intro')} size="xl" as="h1" />
        <FilterBar
          label={t('filter.genre')}
          values={genres}
          selected={genre}
          onSelect={(v) => setGenre(v)}
          allLabel={t('filter.all')}
        />
      </section>
      <section className="section-pad-x section-pad-y">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((a) => (
            <ArtistTile key={a.id} artist={a} aspect="portrait" onOpen={() => setOpenId(a.id)} />
          ))}
        </div>
      </section>
      <ArtistModal artist={open} open={!!open} onOpenChange={(v) => !v && setOpenId(null)} />
    </>
  )
}
