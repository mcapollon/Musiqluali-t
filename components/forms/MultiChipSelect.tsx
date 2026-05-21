'use client'
import { Pill } from '@/components/primitives/Pill'

type Props = {
  label: string
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
}
export function MultiChipSelect({ label, options, value, onChange }: Props) {
  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])
  return (
    <fieldset>
      <legend className="text-mono-meta text-bone-mute mb-3">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button type="button" key={o} onClick={() => toggle(o)} aria-pressed={value.includes(o)}>
            <Pill active={value.includes(o)}>{o}</Pill>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
