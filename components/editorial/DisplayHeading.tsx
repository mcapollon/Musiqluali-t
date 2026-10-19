'use client'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils/cn'

type Props = {
  text: string
  /** Substring of `text` set in gold italic — the "statement" word. */
  emphasis?: string | undefined
  size?: 'hero' | 'xl' | 'l' | 'm'
  className?: string
  as?: 'h1' | 'h2' | 'p'
  /** Seconds before the reveal starts. */
  delay?: number
  /** Drive the reveal explicitly (e.g. hold it behind the logo opening). Default: reveal on scroll into view. */
  play?: boolean | undefined
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

/** Display headline. Words rise out of a mask, line after line, like a curtain lifting. */
export function DisplayHeading({ text, emphasis, size = 'l', className, as: As = 'h2', delay = 0, play }: Props) {
  const reduced = useReducedMotion()
  const segments = splitEmphasis(text, emphasis)

  if (reduced) {
    return (
      <As className={cn(sizeCls[size], className)}>
        {segments.map((s, i) => (s.em ? <em key={i}>{s.str}</em> : <Fragment key={i}>{s.str}</Fragment>))}
      </As>
    )
  }

  // Tokens keep the source's own spacing, so "couleur" + "." stay joined across the emphasis boundary.
  const tokens = segments.flatMap((s) =>
    s.str
      .split(/(\s+)/)
      .filter(Boolean)
      .map((w) => ({ w, em: s.em, space: /^\s+$/.test(w) })),
  )
  const MotionTag = motion[As] as typeof motion.h2

  return (
    <MotionTag
      className={cn(sizeCls[size], className)}
      initial="hidden"
      {...(play === undefined
        ? { whileInView: 'show', viewport: { once: true, amount: 0.4 } }
        : { animate: play ? 'show' : 'hidden' })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tokens.map(({ w, em, space }, i) =>
          space ? (
            <Fragment key={i}> </Fragment>
          ) : (
            <span key={i} className={cn('inline-block overflow-hidden pb-[0.14em] mb-[-0.14em] align-bottom', em && 'pr-[0.06em]')}>
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {em ? <em>{w}</em> : w}
              </motion.span>
            </span>
          ),
        )}
      </span>
    </MotionTag>
  )
}
