'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Play } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { ArtistModal } from '@/components/cards/ArtistModal'
import { useAudioStore } from '@/lib/audio/store'
import { artists } from '@/lib/mock/artists'
import { cn } from '@/lib/utils/cn'

/**
 * The artist's name is the hero. Hover or keyboard focus on a name lifts its
 * black-and-white portrait into the panel beside it; on phones each name
 * carries its own small portrait, since there is no hover.
 */
export function HomeArtists() {
  const t = useTranslations('home.artists')
  const play = useAudioStore((s) => s.play)
  const [activeId, setActiveId] = useState(artists[0]?.id ?? null)
  const [openId, setOpenId] = useState<string | null>(null)
  const open = artists.find((a) => a.id === openId) ?? null

  return (
    <section className="section-pad-x section-pad-y border-t border-rule">
      <ChapterMark number="03" title={t('chapter')} />
      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1fr_minmax(15rem,26vw)]">
        <ul className="border-b border-rule">
          {artists.map((a) => {
            const active = a.id === activeId
            return (
              <li key={a.id} className="flex items-center gap-4 border-t border-rule py-4 md:py-5">
                <button
                  type="button"
                  onClick={() => setOpenId(a.id)}
                  onMouseEnter={() => setActiveId(a.id)}
                  onFocus={() => setActiveId(a.id)}
                  className="group flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <span className="grade-portrait relative size-14 shrink-0 md:hidden">
                    {/* PLACEHOLDER portrait (Unsplash) until real artist photos are supplied. */}
                    <Image src={a.photo} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span
                    className={cn(
                      'font-display font-medium leading-[0.95] tracking-[-0.025em] text-[clamp(2rem,6.5vw,6.5rem)] transition-colors duration-700',
                      active ? 'md:text-bone' : 'md:text-bone/45',
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
            {artists.map((a) => (
              <Image
                key={a.id}
                src={a.photo}
                alt=""
                fill
                sizes="26vw"
                className={cn(
                  'object-cover transition-[opacity,transform] duration-[1100ms] ease-gala',
                  a.id === activeId ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Link href="/artists" className="text-mono-meta text-gold transition-colors hover:text-gold-bright">
          {t('viewAll')} <span aria-hidden>→</span>
        </Link>
      </div>
      <ArtistModal artist={open} open={!!open} onOpenChange={(v) => !v && setOpenId(null)} />
    </section>
  )
}
