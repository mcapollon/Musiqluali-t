'use client'
import { Fragment } from 'react'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/utils/cn'

type Props = {
  text: string
  /** Substring of `text` set in gold — the "statement" word. */
  emphasis?: string | undefined
  size?: 'hero' | 'xl' | 'l' | 'm'
  className?: string
  as?: 'h1' | 'h2' | 'p'
  /** Seconds before the reveal starts. */
  delay?: number
  /**
   * 'scroll' (default): words rise when the heading scrolls into view.
   * 'load': words rise from first paint, for above-the-fold headlines. Needs
   * no hydration (fast LCP, works without JS) and waits for the logo opening
   * via html[data-intro] (see globals.css).
   */
  reveal?: 'scroll' | 'load'
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
 * Display headline. Words rise out of a mask, line after line, like a curtain
 * lifting. Pure CSS (.word-rise); reduced motion shows the final state at once.
 */
export function DisplayHeading({ text, emphasis, size = 'l', className, as: As = 'h2', delay, reveal = 'scroll' }: Props) {
  const [ref, inView] = useInViewOnce<HTMLHeadingElement & HTMLParagraphElement>(0.4)
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
      ref={ref}
      className={cn(sizeCls[size], reveal === 'scroll' && !inView && 'reveal-wait', className)}
      style={delay !== undefined ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tokens.map(({ w, em, space }, i) =>
          space ? (
            <Fragment key={i}> </Fragment>
          ) : (
            <span key={i} className={cn('inline-block overflow-hidden pb-[0.14em] mb-[-0.14em] align-bottom')}>
              <span className="word-rise" style={{ '--i': n++ } as React.CSSProperties}>
                {em ? <em>{w}</em> : w}
              </span>
            </span>
          ),
        )}
      </span>
    </As>
  )
}
