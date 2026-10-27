import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { ArtistIndex } from '@/components/cards/ArtistIndex'
import { buttonClass } from '@/components/primitives/buttonClass'
import { artists } from '@/lib/mock/artists'

/** Act VII: the next wave. The artists' names, large; the portrait lifts beside the one you point at. */
export function HomeArtists() {
  const t = useTranslations('home')
  return (
    <section id="next-wave" data-act className="section-pad-x section-pad-y">
      <ChapterMark number="VII" title={t('acts.artists')} />
      <DisplayHeading text={t('artists.title')} emphasis={t('artists.titleEm')} size="xl" as="p" className="mt-12 max-w-5xl md:mt-16" />
      <div className="mt-16 md:mt-24">
        <ArtistIndex artists={artists} />
      </div>
      <div className="mt-12">
        <Link href="/artists" className={buttonClass({ variant: 'link' })}>
          {t('artists.viewAll')} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
