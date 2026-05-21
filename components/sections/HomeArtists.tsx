'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { ArtistTile } from '@/components/cards/ArtistTile'
import { ArtistModal } from '@/components/cards/ArtistModal'
import { artists } from '@/lib/mock/artists'

const ASPECTS = [
  'portrait',
  'square',
  'landscape',
  'portrait',
  'landscape',
  'portrait',
  'square',
  'portrait',
] as const

export function HomeArtists() {
  const t = useTranslations('home.artists')
  const [openId, setOpenId] = useState<string | null>(null)
  const open = artists.find((a) => a.id === openId) ?? null
  return (
    <section className="section-pad-x section-pad-y space-y-12">
      <ChapterMark number="03" title={t('chapter')} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {artists.map((a, i) => {
          const aspect = ASPECTS[i] ?? 'portrait'
          return (
            <div
              key={a.id}
              className={aspect === 'landscape' ? 'col-span-2 md:col-span-2' : ''}
            >
              <ArtistTile
                artist={a}
                aspect={aspect}
                onOpen={() => setOpenId(a.id)}
              />
            </div>
          )
        })}
      </div>
      <ArtistModal
        artist={open}
        open={!!open}
        onOpenChange={(v) => !v && setOpenId(null)}
      />
    </section>
  )
}
