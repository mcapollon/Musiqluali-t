'use client'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function HomeNewsletter() {
  const t = useTranslations('home.newsletter')
  return (
    <section id="newsletter" className="section-pad-x section-pad-y scroll-mt-24 border-t border-rule">
      <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="text-mono-meta text-gold">{t('eyebrow')}</p>
          <h2 className="text-display-l mt-4">{t('headline')}</h2>
        </div>
        <form
          className="flex w-full items-end gap-4 md:max-w-md"
          onSubmit={(e) => {
            e.preventDefault()
            toast.success(t('toast'))
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
          <button type="submit" className="text-mono-meta pb-3 text-gold transition-colors hover:text-gold-bright">
            {t('subscribe')}
          </button>
        </form>
      </div>
    </section>
  )
}
