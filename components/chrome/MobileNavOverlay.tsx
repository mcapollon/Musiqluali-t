'use client'
import { X } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import { buttonClass } from '@/components/primitives/buttonClass'
import { Wordmark } from './Wordmark'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

const NAV = [
  { href: '/programs', key: 'programs' },
  { href: '/artists', key: 'artists' },
  { href: '/events', key: 'events' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const

export function MobileNavOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('nav')
  const ta = useTranslations('a11y')
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('menu')}
          className="animate-fade fixed inset-0 z-60 bg-ink"
        >
          <div className="section-pad-x flex h-16 items-center justify-between">
            <Wordmark className="text-2xl" />
            <button type="button" aria-label={ta('close')} onClick={onClose} className="p-2"><X className="size-6" /></button>
          </div>
          <nav className="section-pad-x mt-8 flex flex-col gap-6">
            {NAV.map((r) => (
              <Link key={r.key} href={r.href} onClick={onClose} className="text-display-l transition-colors hover:text-gold-bright">
                {t(r.key)}
              </Link>
            ))}
          </nav>
          <div className="section-pad-x absolute inset-x-0 bottom-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LocaleSwitch />
              <a href="#donate" onClick={onClose} className="text-mono-meta text-bone-mute hover:text-bone-mute whitespace-nowrap">
                {t('donate')}
              </a>
            </div>
            <Link href="/apply" onClick={onClose} className={buttonClass({ size: 'md' })}>
              {t('apply')}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
