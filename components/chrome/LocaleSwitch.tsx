'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/lib/i18n/navigation'
import { cn } from '@/lib/utils/cn'

export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale() as 'fr' | 'en'
  const pathname = usePathname()
  const router = useRouter()
  const other = locale === 'fr' ? 'en' : 'fr'
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full border border-[color:var(--color-rule)] p-1 text-mono-meta', className)}>
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          aria-pressed={locale === l}
          aria-label={`Switch language to ${l === 'fr' ? 'French' : 'English'}`}
          className={cn(
            'px-3 py-1 rounded-full transition-colors',
            locale === l ? 'bg-saffron text-ink' : 'text-bone-mute hover:text-bone',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
      <span className="sr-only">Current language: {locale === 'fr' ? 'French' : 'English'}. Toggle to {other}.</span>
    </div>
  )
}
