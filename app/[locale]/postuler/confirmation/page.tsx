'use client'
import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { BilingualStack } from '@/components/editorial/BilingualStack'
import { Button } from '@/components/primitives/Button'

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
    <section className="section-pad-x section-pad-y pt-32 space-y-12 max-w-3xl mx-auto text-center">
      <BilingualStack fr="Merci." en="Thank you." />
      {dossier && <p className="text-mono-meta text-saffron">DOSSIER #{dossier}</p>}
      <ol className="grid md:grid-cols-3 gap-6 text-left">
        {(['review', 'interview', 'onboarding'] as const).map((k, i) => (
          <li key={k} className="border-t border-[color:var(--color-rule)] pt-4">
            <p className="font-mono text-3xl text-saffron">0{i + 1}</p>
            <p className="text-mono-meta text-bone-mute mt-2">{t(`steps.${k}.title`)}</p>
            <p className="text-bone-mute mt-1">{t(`steps.${k}.body`)}</p>
          </li>
        ))}
      </ol>
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button variant="ghost">{t('home')}</Button>
        </Link>
      </div>
    </section>
  )
}
