'use client'
import { useWizardStore } from '@/components/wizard/useWizard'
import { Step01Account } from '@/components/wizard/Step01Account'

export default function ApplyPage() {
  const { step } = useWizardStore()
  switch (step) {
    case 1:
      return <Step01Account />
    default:
      return null
  }
}
