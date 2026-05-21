'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { WizardProgress } from './WizardProgress'
import { useWizardStore } from './useWizard'

export function WizardShell({ children }: { children: React.ReactNode }) {
  const { step } = useWizardStore()
  const t = useTranslations(`wizard.step0${step}` as 'wizard.step01')

  return (
    <section className="grid md:grid-cols-[40%_60%] min-h-[100svh] pt-20">
      <aside className="relative hidden md:block" aria-hidden="true">
        <Image src="https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&auto=format&fit=crop&q=80" alt="" fill className="object-cover opacity-50" sizes="40vw" />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <p className="text-mono-meta text-bone-mute">POSTULER · ÉTAPE 0{step} / 05</p>
          <div className="space-y-4">
            <p className="text-display-l font-display">{t('title')}</p>
            <p className="text-bone-mute max-w-xs">{t('blurb')}</p>
          </div>
        </div>
      </aside>
      <div className="section-pad-x section-pad-y">
        <div className="mb-8">
          <p className="text-mono-meta text-bone-mute md:hidden">ÉTAPE 0{step} / 05</p>
          <h1 className="text-display-m md:text-display-l font-display mt-2">{t('title')}</h1>
        </div>
        <WizardProgress />
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
