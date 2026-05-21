type Props = { value: string; label: string }
export function StatCell({ value, label }: Props) {
  return (
    <div className="flex flex-col gap-2 border-t border-[color:var(--color-rule)] pt-4">
      <span className="font-mono text-4xl">{value}</span>
      <span className="text-mono-meta text-bone-mute">{label}</span>
    </div>
  )
}
