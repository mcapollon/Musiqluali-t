import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { routing, type AppLocale } from '@/lib/i18n/routing'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { LazyToaster } from '@/components/ui/LazyToaster'
import { SkipToContent } from '@/components/chrome/SkipToContent'
import { SiteHeader } from '@/components/chrome/SiteHeader'
import { SiteFooter } from '@/components/chrome/SiteFooter'
import { StickyMiniPlayer } from '@/components/media/StickyMiniPlayer'
import { INTRO_SCRIPT } from '@/components/chrome/logoIntroScript'
import '../globals.css'

// Satoshi from Fontshare (see the <head> note below). Loaded without blocking first paint.
const FONTSHARE_CSS = 'https://api.fontshare.com/v2/css?f%5B%5D=satoshi@300,400,500&display=swap'
const FONTSHARE_SWAP = `(function(){var l=document.getElementById('fontshare-css');if(!l)return;function on(){l.media='all'}if(l.sheet)on();else l.addEventListener('load',on)})()`

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Before first paint: motion flag + logo opening (home only). See logoIntroScript.ts. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        {/*
          Satoshi (the NCBF typeface) by Indian Type Foundry, ITF Free Font License.
          Served from Fontshare's own servers on purpose: the licence forbids
          redistributing the font files through a repository, and this repo is
          public, so the files must never be committed here.
        */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        {/* Non-blocking: fetched early, applied when it arrives; text paints first in
            'Satoshi Fallback' (metric-matched in globals.css), so nothing jumps on swap. */}
        <link rel="preload" as="style" href={FONTSHARE_CSS} />
        <link id="fontshare-css" rel="stylesheet" href={FONTSHARE_CSS} media="print" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: FONTSHARE_SWAP }} />
        <noscript>
          <link rel="stylesheet" href={FONTSHARE_CSS} />
        </noscript>
      </head>
      <body>
        {/* Dark only ("a gala has one lighting"). Provider kept so a theme can return without restructuring. */}
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <MotionProvider>
              <SkipToContent label={locale === 'fr' ? 'Aller au contenu' : 'Skip to content'} />
              <SiteHeader />
              <main id="main" className="pt-20">{children}</main>
              <SiteFooter />
              <StickyMiniPlayer />
              <LazyToaster position="bottom-right" />
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
