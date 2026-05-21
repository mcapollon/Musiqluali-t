'use client'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function HomeNewsletter() {
  const t = useTranslations('home.newsletter')
  return (
    <section className="section-pad-x section-pad-y border-t border-[color:var(--color-rule)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <p className="text-mono-meta text-bone-mute">{t('eyebrow')}</p>
          <h2 className="text-display-m font-display">{t('headline')}</h2>
        </div>
        <form
          className="flex gap-2 w-full md:max-w-md"
          onSubmit={(e) => { e.preventDefault(); toast.success(t('toast')) }}
        >
          <input type="email" required placeholder={t('placeholder')} className="flex-1 bg-transparent border-b border-[color:var(--color-rule)] py-3 focus:outline-none focus:border-saffron" />
          <button type="submit" className="text-mono-meta text-saffron">{t('subscribe')}</button>
        </form>
      </div>
    </section>
  )
}
