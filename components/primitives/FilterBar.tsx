'use client'
import { Pill } from './Pill'

type Props<T extends string> = {
  label: string
  values: T[]
  selected: T | 'all'
  onSelect: (v: T | 'all') => void
  allLabel: string
}

export function FilterBar<T extends string>({ label, values, selected, onSelect, allLabel }: Props<T>) {
  return (
    <div role="group" className="flex flex-wrap items-center gap-3" aria-label={label}>
      <span aria-hidden className="text-mono-meta mr-2 text-gold">
        {label}
      </span>
      <button type="button" aria-pressed={selected === 'all'} onClick={() => onSelect('all')}>
        <Pill active={selected === 'all'}>{allLabel}</Pill>
      </button>
      {values.map((v) => (
        <button type="button" key={v} aria-pressed={selected === v} onClick={() => onSelect(v)}>
          <Pill active={selected === v}>{v}</Pill>
        </button>
      ))}
    </div>
  )
}
