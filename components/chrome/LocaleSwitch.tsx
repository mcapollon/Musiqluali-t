'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

/** "FR  EN" as plain text; the active language is simply brighter. */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale() as 'fr' | 'en'
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className={cn('text-mono-meta inline-flex items-center gap-1', className)}>
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          aria-pressed={locale === l}
          className={cn('px-2 py-2 transition-colors', locale === l ? 'text-bone' : 'text-bone-mute hover:text-bone')}
        >
          {l.toUpperCase()}
          {/* Accessible name starts with the visible label (WCAG 2.5.3), then the language in its own tongue. */}
          <span className="sr-only" lang={l}>
            {' '}
            — {l === 'fr' ? 'Français' : 'English'}
          </span>
        </button>
      ))}
    </div>
  )
}
