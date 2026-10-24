'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { WizardProgress } from './WizardProgress'
import { useWizardStore } from './useWizard'

const TOTAL = 5

export function WizardShell({ children }: { children: React.ReactNode }) {
  const { step } = useWizardStore()
  const t = useTranslations(`wizard.step0${step}` as 'wizard.step01')
  const tw = useTranslations('wizard')
  const tn = useTranslations('nav')
  const stepLabel = tw('stepOf', { n: step, total: TOTAL })

  return (
    <section className="grid min-h-[calc(100svh-5rem)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* Stage side: decorative, repeats the step title for sighted desktop users. */}
      <aside
        aria-hidden="true"
        className="grade-stage relative hidden self-start md:sticky md:top-20 md:block md:h-[calc(100svh-5rem)]"
      >
        {/* PLACEHOLDER stage photo (Unsplash) until real Night n Key photos are supplied. */}
        <Image
          src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=75"
          alt=""
          fill
          className="object-cover"
          sizes="40vw"
        />
        <div className="absolute inset-0 z-3 bg-linear-to-b from-black/70 via-black/30 to-black/85" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white lg:p-14">
          <p className="text-mono-meta text-gold-bright">
            {tn('apply')} · {stepLabel}
          </p>
          <div>
            <p className="font-display text-[clamp(4.5rem,8vw,7.5rem)] font-light leading-none tabular-nums text-gold">0{step}</p>
            <p className="text-display-l mt-6">{t('title')}</p>
            <p className="mt-4 max-w-xs text-white/75">{t('blurb')}</p>
          </div>
        </div>
      </aside>
      <div className="section-pad-x py-12 md:py-20 lg:px-20">
        <p className="text-mono-meta text-gold">{stepLabel}</p>
        <h1 className="text-display-l mt-4">{t('title')}</h1>
        <p className="mt-4 max-w-md text-bone-mute md:hidden">{t('blurb')}</p>
        <div className="mt-10">
          <WizardProgress total={TOTAL} />
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
