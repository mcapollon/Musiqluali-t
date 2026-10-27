import { Fragment } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  text: string
  /** Substring of `text` set in gold — the "statement" word. */
  emphasis?: string | undefined
  size?: 'hero' | 'xl' | 'l' | 'm'
  className?: string
  as?: 'h1' | 'h2' | 'p' | 'blockquote'
  /** Seconds before the reveal starts ('load' only). */
  delay?: number
  /**
   * 'scroll' (default): words rise out of a mask when the heading scrolls
   * into view (GSAP, via data-motion-text; see components/motion/motionSystem.ts).
   * 'load': words rise from first paint, for above-the-fold headlines. Pure
   * CSS: needs no hydration (fast LCP, works without JS) and waits for the
   * logo opening via html[data-intro] (see globals.css).
   * 'read': no rise; words brighten as they scroll through the viewport
   * (scrubbed, for long statements).
   * 'scene': masked words with no trigger of their own; a pinned scene
   * (data-scene in motionSystem.ts) decides when they rise.
   * Without JS or with reduced motion, every mode shows the final text.
   */
  reveal?: 'scroll' | 'load' | 'read' | 'scene'
}

const sizeCls = { hero: 'text-display-hero', xl: 'text-display-xl', l: 'text-display-l', m: 'text-display-m' } as const

function splitEmphasis(text: string, emphasis?: string | undefined) {
  const i = emphasis ? text.indexOf(emphasis) : -1
  if (!emphasis || i < 0) return [{ str: text, em: false }]
  return [
    { str: text.slice(0, i), em: false },
    { str: emphasis, em: true },
    { str: text.slice(i + emphasis.length), em: false },
  ].filter((s) => s.str.trim().length > 0)
}

/**
 * Display headline, split into words in markup (never by script, so React
 * keeps owning the DOM). Screen readers get the sentence once, unsplit.
 */
export function DisplayHeading({ text, emphasis, size = 'l', className, as: As = 'h2', delay, reveal = 'scroll' }: Props) {
  // Tokens keep the source's own spacing, so "couleur" + "." stay joined across the emphasis boundary.
  const tokens = splitEmphasis(text, emphasis).flatMap((s) =>
    s.str
      .split(/(\s+)/)
      .filter(Boolean)
      .map((w) => ({ w, em: s.em, space: /^\s+$/.test(w) })),
  )
  let n = 0

  return (
    <As
      data-motion-text={reveal === 'read' ? 'read' : reveal === 'scroll' ? 'words' : undefined}
      className={cn(sizeCls[size], className)}
      style={delay !== undefined ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tokens.map(({ w, em, space }, i) => {
          if (space) return <Fragment key={i}> </Fragment>
          const word = em ? <em>{w}</em> : w
          if (reveal === 'read') {
            return (
              <span key={i} className="motion-word">
                {word}
              </span>
            )
          }
          return (
            <span key={i} className="inline-block overflow-hidden pt-[0.06em] mt-[-0.06em] pb-[0.3em] mb-[-0.3em] align-bottom">
              {reveal === 'load' ? (
                <span className="word-rise" style={{ '--i': n++ } as React.CSSProperties}>
                  {word}
                </span>
              ) : (
                <span className="motion-word inline-block">{word}</span>
              )}
            </span>
          )
        })}
      </span>
    </As>
  )
}
