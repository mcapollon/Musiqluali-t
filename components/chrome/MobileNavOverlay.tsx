'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/primitives/Button'
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
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('menu')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-ink"
        >
          <div className="section-pad-x flex h-16 items-center justify-between">
            <span className="font-display text-2xl">MUSIQL<span className="text-saffron">·</span>T</span>
            <button aria-label="Close" onClick={onClose} className="p-2"><X className="size-6" /></button>
          </div>
          <nav className="section-pad-x mt-8 flex flex-col gap-6">
            {NAV.map((r) => (
              <Link key={r.key} href={r.href} onClick={onClose} className="text-display-m">
                {t(r.key)}
              </Link>
            ))}
          </nav>
          <div className="section-pad-x absolute inset-x-0 bottom-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LocaleSwitch />
            </div>
            <Link href="/apply" onClick={onClose}>
              <Button size="md">{t('apply')}</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
