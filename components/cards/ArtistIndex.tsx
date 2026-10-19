'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Play } from 'lucide-react'
// The dialog library loads only when someone opens an artist.
const ArtistModal = dynamic(() => import('./ArtistModal').then((m) => m.ArtistModal), {
  ssr: false,
})
import { useAudioStore } from '@/lib/audio/store'
import type { Artist } from '@/lib/mock/artists'
import { cn } from '@/lib/utils/cn'

/**
 * The artist's name is the hero. Hover or keyboard focus on a name lifts its
 * black-and-white portrait into the panel beside it; on phones each name
 * carries its own small portrait, since there is no hover.
 */
export function ArtistIndex({ artists }: { artists: Artist[] }) {
  const t = useTranslations('home.artists')
  const play = useAudioStore((s) => s.play)
  const [activeId, setActiveId] = useState<string | null>(null)
  // Portraits mount the first time their name is hovered/focused, so the page
  // does not ship every image up front; once mounted they stay for the crossfade.
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set())
  const [openId, setOpenId] = useState<string | null>(null)
  // Fall back to the first visible artist (e.g. after a filter hides the active one).
  const active = artists.find((a) => a.id === activeId) ?? artists[0]
  const activate = (id: string) => {
    setActiveId(id)
    setSeen((s) => (s.has(id) ? s : new Set(s).add(id)))
  }
  const open = artists.find((a) => a.id === openId) ?? null

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_minmax(15rem,26vw)]">
      <ul className="border-b border-rule">
        {artists.map((a) => {
          const isActive = a.id === active?.id
          return (
            <li key={a.id} className="flex items-center gap-4 border-t border-rule py-4 md:py-5">
              <button
                type="button"
                onClick={() => setOpenId(a.id)}
                onMouseEnter={() => activate(a.id)}
                onFocus={() => activate(a.id)}
                className="group flex min-w-0 flex-1 items-center gap-4 text-left"
              >
                <span className="grade-portrait relative size-14 shrink-0 md:hidden">
                  {/* PLACEHOLDER portrait (Unsplash) until real artist photos are supplied. */}
                  <Image src={a.photo} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span
                  className={cn(
                    'font-display font-medium leading-[0.95] tracking-[-0.025em] text-[clamp(2rem,6.5vw,6.5rem)] transition-colors duration-700',
                    isActive ? 'md:text-bone' : 'md:text-bone/45',
                    'group-hover:text-gold-bright group-focus-visible:text-gold-bright',
                  )}
                >
                  {a.name}
                </span>
                <span className="sr-only">
                  — {a.genre}, {a.city}
                </span>
              </button>
              <div className="hidden shrink-0 text-right sm:block" aria-hidden>
                <p className="text-mono-micro text-gold">{a.genre}</p>
                <p className="text-mono-micro text-bone-mute">{a.city}</p>
              </div>
              {a.track && (
                <button
                  type="button"
                  onClick={() => play({ ...a.track!, artistId: a.id, artistName: a.name })}
                  aria-label={`${t('listen')} — ${a.name}`}
                  className="grid size-10 shrink-0 place-items-center border border-rule-strong text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <Play className="size-3.5" aria-hidden />
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {/* Desktop portrait panel: one image lit at a time. Decorative; names carry the meaning. */}
      <div aria-hidden className="relative hidden md:block">
        <div className="grade-portrait sticky top-28 aspect-[3/4] w-full">
          {artists
            .filter((a) => a.id === active?.id || seen.has(a.id))
            .map((a) => (
              <Image
                key={a.id}
                src={a.photo}
                alt=""
                fill
                sizes="26vw"
                className={cn(
                  'object-cover transition-[opacity,transform] duration-[1100ms] ease-gala',
                  a.id === active?.id ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
                )}
              />
            ))}
        </div>
      </div>
      {open && <ArtistModal artist={open} open onOpenChange={(v) => !v && setOpenId(null)} />}
    </div>
  )
}
