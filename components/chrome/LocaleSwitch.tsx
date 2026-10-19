'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale() as 'fr' | 'en'
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full border border-rule p-1 text-mono-meta', className)}>
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          aria-pressed={locale === l}
          className={cn(
            'px-3 py-1 rounded-full transition-colors',
            locale === l ? 'bg-gold text-ink' : 'text-bone-mute hover:text-bone',
          )}
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
