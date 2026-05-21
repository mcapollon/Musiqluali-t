import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { routing, type AppLocale } from '@/lib/i18n/routing'
import { LenisProvider } from '@/components/motion/LenisProvider'
import { Toaster } from '@/components/ui/sonner'
import { SkipToContent } from '@/components/chrome/SkipToContent'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { StickyMiniPlayer } from '@/components/media/StickyMiniPlayer'
import { fraunces, inter, jetbrains } from '@/app/fonts'
import '../globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return {
    metadataBase: new URL('https://musiqlt.example'),
    title: { default: t('siteTitle'), template: `%s · ${t('siteName')}` },
    description: t('description'),
    openGraph: { type: 'website', locale, siteName: t('siteName'), images: ['/og.png'] },
    alternates: {
      languages: {
        fr: '/fr',
        en: '/en',
      },
      canonical: '/' + locale,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as AppLocale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <LenisProvider>
              <SkipToContent label={locale === 'fr' ? 'Aller au contenu' : 'Skip to content'} />
              <SiteHeader />
              <main id="main" className="pt-20">{children}</main>
              <SiteFooter />
              <StickyMiniPlayer />
              <Toaster position="bottom-right" />
            </LenisProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
