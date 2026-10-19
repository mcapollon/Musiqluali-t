'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PageIntro } from '@/components/editorial/PageIntro'
import { ArtistIndex } from '@/components/cards/ArtistIndex'
import { FilterBar } from '@/components/primitives/FilterBar'
import { artists } from '@/lib/mock/artists'

export function ArtistsPage() {
  const t = useTranslations('artistsPage')
  const [genre, setGenre] = useState<string>('all')
  const genres = useMemo(() => Array.from(new Set(artists.map((a) => a.genre))).sort(), [])
  const filtered = genre === 'all' ? artists : artists.filter((a) => a.genre === genre)

  return (
    <>
      {/* TODO: the intro's "120 artists" figure is invented (MUSIQUALIT_VISION.md §5.1). */}
      <PageIntro chapter={t('chapter')} title={t('intro')}>
        <div className="mt-12">
          <FilterBar
            label={t('filter.genre')}
            values={genres}
            selected={genre}
            onSelect={(v) => setGenre(v)}
            allLabel={t('filter.all')}
          />
        </div>
      </PageIntro>
      <section className="section-pad-x pb-[clamp(4.5rem,11vw,10rem)]">
        <ArtistIndex artists={filtered} />
      </section>
    </>
  )
}
