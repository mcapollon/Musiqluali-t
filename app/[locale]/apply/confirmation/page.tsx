'use client'
import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { BilingualStack } from '@/components/editorial/BilingualStack'
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
      <BilingualStack fr="Merci." en="Thank you." />
      {dossier && <p className="text-mono-meta mt-10 text-bone-mute">DOSSIER #{dossier}</p>}
      <ol className="mt-20 grid max-w-5xl gap-12 md:grid-cols-3 md:gap-10">
        {(['review', 'interview', 'onboarding'] as const).map((k, i) => (
          <li key={k}>
            <p className="text-mono-meta text-bone-mute">0{i + 1}</p>
            <p className="text-display-m mt-4">{t(`steps.${k}.title`)}</p>
            <p className="mt-3 text-bone-mute">{t(`steps.${k}.body`)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-20">
        <Link href="/" className={buttonClass({ variant: 'link' })}>
          {t('home')} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
