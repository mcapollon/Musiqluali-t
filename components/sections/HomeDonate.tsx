import { useTranslations } from 'next-intl'
import { Button } from '@/components/primitives/Button'
import { ChapterMark } from '@/components/editorial/ChapterMark'

export function HomeDonate() {
  const t = useTranslations('home.donate')
  return (
    <section
      id="donate"
      className="section-pad-x section-pad-y space-y-8 border-t border-[color:var(--color-rule)] scroll-mt-32"
    >
      <ChapterMark number="05" title={t('chapter')} />
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <h2 className="text-display-l font-display">{t('headline')}</h2>
          <p className="text-bone-mute max-w-md">{t('body')}</p>
        </div>
        <div className="space-y-4">
          <p className="text-mono-meta text-bone-mute">{t('eyebrow')}</p>
          <div className="grid grid-cols-3 gap-3">
            {['25', '50', '100'].map((amt) => (
              <a
                key={amt}
                href="#"
                className="border border-[color:var(--color-rule)] rounded-md py-4 text-center font-mono text-2xl hover:border-saffron hover:text-saffron transition-colors"
              >
                ${amt}
              </a>
            ))}
          </div>
          <a href="#" className="block">
            <Button variant="primary" size="lg" className="w-full">
              {t('cta')}
            </Button>
          </a>
          <p className="text-mono-meta text-bone-mute">{t('receipt')}</p>
        </div>
      </div>
    </section>
  )
}
