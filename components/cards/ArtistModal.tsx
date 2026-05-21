'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import type { Artist } from '@/lib/mock/artists'
import { Waveform } from '@/components/media/Waveform'
import { useAudioStore } from '@/lib/audio/store'
import { Play, Pause } from 'lucide-react'

export function ArtistModal({
  artist,
  open,
  onOpenChange,
}: {
  artist: Artist | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const locale = useLocale() as 'fr' | 'en'
  const { play, current, isPlaying, toggle } = useAudioStore()
  if (!artist) return null
  const isCurrent = current?.artistId === artist.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[color:var(--color-ink-2)] border-[color:var(--color-rule)] p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[3/4] md:aspect-auto">
            <Image
              src={artist.photo}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="p-8 space-y-4">
            <DialogTitle className="text-display-m font-display">
              {artist.name}
            </DialogTitle>
            <p className="text-mono-meta text-bone-mute">
              {artist.genre} · {artist.city}
              {artist.pronouns ? ` · ${artist.pronouns}` : ''}
            </p>
            <p className="text-bone">
              {locale === 'fr' ? artist.bioFr : artist.bioEn}
            </p>
            {artist.track && (
              <button
                onClick={() =>
                  isCurrent
                    ? toggle()
                    : play({
                        ...artist.track!,
                        artistId: artist.id,
                        artistName: artist.name,
                      })
                }
                className="flex items-center gap-3 mt-4"
              >
                <span className="grid size-12 place-items-center rounded-full bg-saffron text-ink">
                  {isCurrent && isPlaying ? (
                    <Pause className="size-5" />
                  ) : (
                    <Play className="size-5" />
                  )}
                </span>
                <Waveform active={isCurrent && isPlaying} />
                <span className="text-mono-meta">{artist.track.title}</span>
              </button>
            )}
            {artist.links && (
              <ul className="flex flex-wrap gap-3 mt-6">
                {artist.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-mono-meta text-saffron">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
