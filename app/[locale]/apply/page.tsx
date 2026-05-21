'use client'
import { useWizardStore } from '@/components/wizard/useWizard'
import { Step01Account } from '@/components/wizard/Step01Account'
import { Step02Identity } from '@/components/wizard/Step02Identity'
import { Step03Journey } from '@/components/wizard/Step03Journey'

export default function ApplyPage() {
  const { step } = useWizardStore()
  switch (step) {
    case 1:
      return <Step01Account />
    case 2:
      return <Step02Identity />
    case 3:
      return <Step03Journey />
    default:
      return null
  }
}
