import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { ArtistIndex } from '@/components/cards/ArtistIndex'
import { artists } from '@/lib/mock/artists'

export function HomeArtists() {
  const t = useTranslations('home.artists')
  return (
    <section className="section-pad-x section-pad-y border-t border-rule">
      <ChapterMark number="03" title={t('chapter')} />
      <div className="mt-14 md:mt-20">
        <ArtistIndex artists={artists} />
      </div>
      <div className="mt-12">
        <Link href="/artists" className="text-mono-meta text-gold transition-colors hover:text-gold-bright">
          {t('viewAll')} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
