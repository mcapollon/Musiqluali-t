'use client'
import { useWizardStore } from './useWizard'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

export function WizardProgress({ total = 5 }: { total?: number }) {
  const { step, setStep } = useWizardStore()
  const t = useTranslations('wizard')
  return (
    <ol className="flex max-w-xl items-center gap-2" aria-label={t('progressLabel')}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'pending'
        return (
          <li key={n} className="flex-1">
            {/* Tall hit area, thin visible rule. */}
            <button
              type="button"
              aria-label={t('goToStep', { n })}
              aria-current={state === 'active' ? 'step' : undefined}
              disabled={n > step}
              onClick={() => setStep(n)}
              className="group flex h-6 w-full items-center disabled:cursor-not-allowed"
            >
              <span
                className={cn(
                  'h-0.5 w-full transition-colors duration-700',
                  state === 'pending' && 'bg-rule-strong',
                  state === 'done' && 'bg-gold group-hover:bg-gold-bright',
                  state === 'active' && 'h-[3px] bg-gold-bright',
                )}
              />
            </button>
          </li>
        )
      })}
    </ol>
  )
}
