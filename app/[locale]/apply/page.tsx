'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Route } from 'next'
import { useWizardStore } from '@/components/wizard/useWizard'
import { Step01Account } from '@/components/wizard/Step01Account'
import { Step02Identity } from '@/components/wizard/Step02Identity'
import { Step03Journey } from '@/components/wizard/Step03Journey'
import { Step04Links } from '@/components/wizard/Step04Links'
import { Step05Review } from '@/components/wizard/Step05Review'

function ApplyWizard() {
  const { step, setStep } = useWizardStore()
  const sp = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const q = Number(sp.get('step'))
    if (q >= 1 && q <= 5 && q !== step) setStep(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', String(step))
    router.replace((url.pathname + url.search) as Route, { scroll: false })
  }, [step, router])

  switch (step) {
    case 1:
      return <Step01Account />
    case 2:
      return <Step02Identity />
    case 3:
      return <Step03Journey />
    case 4:
      return <Step04Links />
    case 5:
      return <Step05Review />
    default:
      return null
  }
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyWizard />
    </Suspense>
  )
}
