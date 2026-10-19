'use client'
import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { BilingualStack } from '@/components/editorial/BilingualStack'
import { GalaMark } from '@/components/editorial/GalaMark'
import { buttonClass } from '@/components/primitives/buttonClass'

function subscribe() {
  return () => {}
}
function getSnapshot() {
  return sessionStorage.getItem('musiqlt.dossier')
}
function getServerSnapshot() {
  return null
}

export default function Confirmation() {
  const t = useTranslations('confirmation')
  const dossier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return (
    <section className="section-pad-x section-pad-y">
      <div className="frame-invitation mx-auto max-w-4xl px-6 py-16 text-center sm:px-14 md:py-24">
        <GalaMark className="mb-12" />
        <BilingualStack fr="Merci." en="Thank you." />
        {dossier && <p className="text-mono-meta mt-10 text-gold">DOSSIER #{dossier}</p>}
        <ol className="mt-16 grid gap-10 text-left md:grid-cols-3 md:gap-8">
          {(['review', 'interview', 'onboarding'] as const).map((k, i) => (
            <li key={k} className="border-t border-rule pt-5">
              <p className="font-display text-5xl italic leading-none text-gold">0{i + 1}</p>
              <p className="text-mono-meta mt-4">{t(`steps.${k}.title`)}</p>
              <p className="mt-2 text-bone-mute">{t(`steps.${k}.body`)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex justify-center">
          <Link href="/" className={buttonClass({ variant: 'ghost', size: 'lg' })}>
            {t('home')}
          </Link>
        </div>
      </div>
    </section>
  )
}
