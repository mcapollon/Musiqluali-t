'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/primitives/Button'
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
          'fixed inset-x-0 top-0 z-50 backdrop-blur transition-all duration-200',
          past ? 'bg-[color:var(--color-ink)]/85 py-3' : 'py-5',
        )}
      >
        <div className="section-pad-x flex items-center justify-between">
          <Link href="/" className={cn('font-display tracking-tight transition-transform', past ? 'text-2xl' : 'text-3xl')}>
            MUSIQL<span className="text-saffron">·</span>T
          </Link>
          <nav aria-label={t('primary')} className="hidden md:flex items-center gap-8">
            {NAV_ROUTES.map((r) => (
              <Link key={r.key} href={r.href} className="text-mono-meta text-bone-mute hover:text-bone">
                {t(r.key)}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <LocaleSwitch />
            <a href="#donate" className="text-mono-meta text-bone-mute hover:text-saffron whitespace-nowrap">
              {t('donate')}
            </a>
            <Link href="/apply">
              <Button size="sm">{t('apply')}</Button>
            </Link>
          </div>
          <button
            type="button"
            aria-label={t('menu')}
            className="md:hidden p-2"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>
      <MobileNavOverlay open={open} onClose={() => setOpen(false)} />
    </>
  )
}
