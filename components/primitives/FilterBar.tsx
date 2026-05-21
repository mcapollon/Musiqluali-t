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
    <div className="flex flex-wrap items-center gap-3" aria-label={label}>
      <span className="text-mono-meta text-bone-mute">{label}</span>
      <button type="button" onClick={() => onSelect('all')}><Pill active={selected === 'all'}>{allLabel}</Pill></button>
      {values.map((v) => (
        <button type="button" key={v} onClick={() => onSelect(v)}><Pill active={selected === v}>{v}</Pill></button>
      ))}
    </div>
  )
}
