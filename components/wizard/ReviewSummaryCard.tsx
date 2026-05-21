'use client'
import { Pencil } from 'lucide-react'
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
  return (
    <article className="border border-[color:var(--color-rule)] rounded-lg p-6 space-y-3">
      <header className="flex items-center justify-between">
        <h3 className="text-mono-meta text-bone-mute">{title}</h3>
        <button
          type="button"
          aria-label={`Edit ${title}`}
          onClick={() => setStep(gotoStep)}
          className="p-1 text-bone-mute hover:text-saffron"
        >
          <Pencil className="size-4" />
        </button>
      </header>
      <dl className="space-y-2 text-sm">
        {items.map((i) => (
          <div key={i.label} className="flex justify-between gap-4">
            <dt className="text-bone-mute">{i.label}</dt>
            <dd className="text-bone text-right">{i.value || '—'}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
