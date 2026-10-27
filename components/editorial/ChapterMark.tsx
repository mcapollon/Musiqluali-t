/** Act label: "IV  Coulisses". The numeral carries the gold; space, not lines, separates sections. */
export function ChapterMark({ number, title, as: As = 'h2' }: { number: string; title: string; as?: 'h2' | 'div' }) {
  return (
    <As className="text-mono-meta flex items-baseline gap-4 text-bone-mute">
      <span className="text-gold">{number}</span>
      <span>{title}</span>
    </As>
  )
}
