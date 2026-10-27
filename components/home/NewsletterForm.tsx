'use client'
import { useTranslations } from 'next-intl'

/** Demo sign-up (no backend yet): confirms with a toast. */
export function NewsletterForm() {
  const t = useTranslations('home.newsletter')
  return (
    <form
      className="flex w-full items-end gap-4 md:max-w-md"
      onSubmit={(e) => {
        e.preventDefault()
        const message = t('toast')
        void import('sonner').then(({ toast }) => toast.success(message))
      }}
    >
      <label htmlFor="home-newsletter-email" className="sr-only">
        {t('label')}
      </label>
      <input
        id="home-newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder={t('placeholder')}
        className="flex-1 border-b border-rule-strong bg-transparent py-3 text-lg placeholder:text-bone-mute focus:border-gold"
      />
      <button type="submit" className="text-mono-meta pb-3 text-bone transition-colors hover:text-gold-bright">
        {t('subscribe')}
      </button>
    </form>
  )
}
