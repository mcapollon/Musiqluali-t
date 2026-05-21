'use client'
import { useWizardStore } from './useWizard'
import { useTranslations } from 'next-intl'

export function WizardProgress({ total = 5 }: { total?: number }) {
  const { step, setStep } = useWizardStore()
  const t = useTranslations('wizard')
  return (
    <ol className="flex items-center gap-2" aria-label={t('progressLabel')}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'pending'
        return (
          <li key={n}>
            <button
              type="button"
              aria-current={state === 'active' ? 'step' : undefined}
              disabled={n > step}
              onClick={() => setStep(n)}
              className={`h-1.5 w-10 rounded-full ${state === 'pending' ? 'bg-[color:var(--color-rule)]' : 'bg-saffron'} ${state === 'active' ? 'shadow-[0_0_12px_var(--color-saffron)]' : ''}`}
            />
          </li>
        )
      })}
    </ol>
  )
}
