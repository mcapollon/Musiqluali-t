import { useFormatter, useTranslations } from 'next-intl'
import { buttonClass } from '@/components/primitives/buttonClass'
import { ChapterMark } from '@/components/editorial/ChapterMark'

// TODO: donation links are placeholders (href="#"); the tax-receipt line is unverified copy.
export function HomeDonate() {
  const t = useTranslations('home.donate')
  const f = useFormatter()
  return (
    <section id="donate" className="section-pad-x section-pad-y scroll-mt-32">
      <ChapterMark number="05" title={t('chapter')} />
      <div className="sd-rise mt-12 grid items-start gap-12 md:mt-16 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-display-l">{t('headline')}</p>
          <p className="max-w-md text-bone-mute">{t('body')}</p>
        </div>
        <div className="space-y-5">
          <p className="text-mono-meta text-bone-mute">{t('eyebrow')}</p>
          <div className="grid grid-cols-3 gap-3">
            {[25, 50, 100].map((amt) => (
              <a
                key={amt}
                href="#"
                className="border border-rule-strong py-6 text-center font-display text-3xl font-light transition-colors duration-500 hover:border-gold hover:text-gold-bright md:text-4xl"
              >
                {f.number(amt, { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 })}
              </a>
            ))}
          </div>
          <a href="#" className={buttonClass({ size: 'lg', className: 'w-full' })}>
            {t('cta')}
          </a>
          <p className="text-mono-micro text-bone-mute">{t('receipt')}</p>
        </div>
      </div>
    </section>
  )
}
