/** Section label: "01  Mission". Plain and grey; space, not lines, separates sections. */
export function ChapterMark({ number, title, as: As = 'h2' }: { number: string; title: string; as?: 'h2' | 'div' }) {
  return (
    <As className="text-mono-meta flex items-baseline gap-4 text-bone-mute">
      <span>{number}</span>
      <span>{title}</span>
    </As>
  )
}
