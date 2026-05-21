import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('home')
  return (
    <main className="section-pad-x section-pad-y">
      <p className="text-mono-meta text-bone-mute mb-6">MTL · EST. 2017 · ARTIST DEVELOPMENT</p>
      <h1 className="text-display-xl">{t('tagline')}</h1>
    </main>
  )
}
