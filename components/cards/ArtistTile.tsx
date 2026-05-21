'use client'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { useAudioStore } from '@/lib/audio/store'
import type { Artist } from '@/lib/mock/artists'
import { cn } from '@/lib/utils/cn'

type Aspect = 'portrait' | 'landscape' | 'square'

export function ArtistTile({
  artist,
  aspect = 'portrait',
  onOpen,
}: {
  artist: Artist
  aspect?: Aspect
  onOpen?: () => void
}) {
  const play = useAudioStore((s) => s.play)
  const aspectCls =
    aspect === 'portrait'
      ? 'aspect-[3/4]'
      : aspect === 'landscape'
      ? 'aspect-[4/3]'
      : 'aspect-square'

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group relative overflow-hidden rounded-md text-left w-full',
        aspectCls
      )}
    >
      <Image
        src={artist.photo}
        alt={artist.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-display-m font-display">{artist.name}</p>
        <p className="text-mono-meta text-bone-mute">
          {artist.genre} · {artist.city}
        </p>
      </div>
      {artist.track && (
        <span
          role="button"
          aria-label={`Play preview from ${artist.name}`}
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            play({
              ...artist.track!,
              artistId: artist.id,
              artistName: artist.name,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              e.preventDefault()
              play({
                ...artist.track!,
                artistId: artist.id,
                artistName: artist.name,
              })
            }
          }}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-saffron text-ink opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play className="size-4" />
        </span>
      )}
    </button>
  )
}
