'use client'
type Props = { value: string }
function score(v: string): number {
  let s = 0
  if (v.length >= 10) s++
  if (/[A-Z]/.test(v)) s++
  if (/\d/.test(v)) s++
  if (/[^A-Za-z0-9]/.test(v)) s++
  return s
}
export function PasswordStrengthMeter({ value }: Props) {
  const s = score(value)
  return (
    <div className="flex gap-1 mt-2" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`h-1 flex-1 rounded ${i < s ? 'bg-saffron' : 'bg-[color:var(--color-rule)]'}`} />
      ))}
    </div>
  )
}
