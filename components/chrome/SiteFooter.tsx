'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function Youtube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

export function SiteFooter() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()
  return (
    <footer className="section-pad-x section-pad-y border-t border-[color:var(--color-rule)] mt-24">
      <div className="grid gap-12 md:grid-cols-3">
        <div>
          <span className="font-display text-3xl">MUSIQL<span className="text-saffron">·</span>T</span>
          <p className="mt-4 text-bone-mute">{t('blurb')}</p>
        </div>
        <div>
          <p className="text-mono-meta text-bone-mute mb-4">{t('sitemap')}</p>
          <ul className="space-y-2">
            <li><Link href="/programs" className="hover:text-saffron">{t('nav.programs')}</Link></li>
            <li><Link href="/artists" className="hover:text-saffron">{t('nav.artists')}</Link></li>
            <li><Link href="/events" className="hover:text-saffron">{t('nav.events')}</Link></li>
            <li><Link href="/about" className="hover:text-saffron">{t('nav.about')}</Link></li>
            <li><Link href="/contact" className="hover:text-saffron">{t('nav.contact')}</Link></li>
            <li><Link href="/apply" className="hover:text-saffron">{t('nav.apply')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-mono-meta text-bone-mute mb-4">{t('contactLabel')}</p>
          <p>Studio Musiqlt · Montréal QC</p>
          <p><a href="mailto:bonjour@musiqlt.example" className="hover:text-saffron">bonjour@musiqlt.example</a></p>
          <div className="mt-4 flex gap-4" aria-label={t('social')}>
            <a href="https://instagram.com/musiqlt" aria-label="Instagram"><Instagram className="size-5" /></a>
            <a href="#" aria-label="Facebook"><Facebook className="size-5" /></a>
            <a href="#" aria-label="YouTube"><Youtube className="size-5" /></a>
          </div>
          <form className="mt-6 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t('newsletterPlaceholder')}
              className="flex-1 bg-transparent border-b border-[color:var(--color-rule)] py-2 focus:outline-none focus:border-saffron"
            />
            <button type="submit" className="text-mono-meta text-saffron">{t('subscribe')}</button>
          </form>
        </div>
      </div>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-mono-meta text-bone-mute">
        <span>© {year} Musiqlt</span>
        <div className="flex gap-6">
          <a href="#">{t('legal.privacy')}</a>
          <a href="#">{t('legal.terms')}</a>
        </div>
      </div>
    </footer>
  )
}
