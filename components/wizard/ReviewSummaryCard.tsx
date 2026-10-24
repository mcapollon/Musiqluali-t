'use client'
import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useWizardStore } from './useWizard'

export function ReviewSummaryCard({
  title,
  items,
  gotoStep,
}: {
  title: string
  items: { label: string; value: string }[]
  gotoStep: number
}) {
  const setStep = useWizardStore((s) => s.setStep)
  const t = useTranslations('wizard')
  return (
    <article className="border-t border-rule pt-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-mono-meta text-bone-mute">{title}</h2>
        <button
          type="button"
          aria-label={t('edit', { section: title })}
          onClick={() => setStep(gotoStep)}
          className="grid size-10 place-items-center text-bone-mute transition-colors hover:text-gold-bright"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      </header>
      <dl className="space-y-3">
        {items.map((i) => (
          <div key={i.label} className="flex justify-between gap-6">
            <dt className="text-bone-mute">{i.label}</dt>
            <dd className="text-right">{i.value || '—'}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
