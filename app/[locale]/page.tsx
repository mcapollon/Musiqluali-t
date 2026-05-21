import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('home')
  return <main className="p-12 text-3xl">{t('tagline')}</main>
}
