'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'
import { Wordmark } from './Wordmark'
import { buttonClass } from '@/components/primitives/buttonClass'
import { MobileNavOverlay } from './MobileNavOverlay'
import { useScrollPos } from '@/hooks/useScrollPos'
import { cn } from '@/lib/utils/cn'
import { Menu } from 'lucide-react'

const NAV_ROUTES = [
  { href: '/programs', key: 'programs' },
  { href: '/artists', key: 'artists' },
  { href: '/events', key: 'events' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

export function SiteHeader() {
  const t = useTranslations('nav')
  const past = useScrollPos(80)
  const [open, setOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-700 ease-gala border-b',
          past ? 'bg-ink/90 backdrop-blur py-3 border-rule' : 'py-5 border-transparent',
        )}
      >
        <div className="section-pad-x flex items-center justify-between gap-6">
          <Link href="/" className="inline-block shrink-0">
            {/* data-wordmark-target: where the logo opening lands; hidden only while it plays. */}
            <span data-wordmark-target className="inline-block">
              <Wordmark className="block text-2xl md:text-[1.75rem]" />
            </span>
          </Link>
          <nav aria-label={t('primary')} className="hidden lg:flex items-center gap-8">
            {NAV_ROUTES.map((r) => (
              <Link key={r.key} href={r.href} className="text-mono-meta text-bone-mute transition-colors hover:text-gold-bright">
                {t(r.key)}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <LocaleSwitch />
            <a href="#donate" className="text-mono-meta text-bone-mute hover:text-gold-bright whitespace-nowrap">
              {t('donate')}
            </a>
            <Link href="/apply" className={buttonClass({ size: 'sm' })}>
              {t('apply')}
            </Link>
          </div>
          <button type="button" aria-label={t('menu')} className="lg:hidden p-2 -mr-2" onClick={() => setOpen(true)}>
            <Menu className="size-6" />
          </button>
        </div>
      </header>
      <MobileNavOverlay open={open} onClose={() => setOpen(false)} />
    </>
  )
}
