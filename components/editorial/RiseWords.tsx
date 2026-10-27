import { Fragment } from 'react'

type Token = { w: string; space: boolean; em: boolean; i: number }

/** Words with their stagger index and whether they fall inside `emphasis` (computed before render). */
function tokenize(text: string, emphasis: string | undefined, from: number): Token[] {
  const at = emphasis ? text.indexOf(emphasis) : -1
  const end = at >= 0 ? at + emphasis!.length : -1
  const out: Token[] = []
  let offset = 0
  let n = from
  for (const w of text.split(/(\s+)/)) {
    const space = !w.trim()
    out.push({ w, space, em: !space && at >= 0 && offset >= at && offset < end, i: space ? -1 : n++ })
    offset += w.length
  }
  return out
}

/**
 * One line of words that rise out of a mask from first paint (CSS .word-rise,
 * no hydration needed, waits for the logo opening). `from` continues the
 * stagger across lines. Decorative: put the sentence in an sr-only span beside it.
 */
export function RiseWords({ text, emphasis, from = 0 }: { text: string; emphasis?: string; from?: number }) {
  return (
    <>
      {tokenize(text, emphasis, from).map(({ w, space, em, i }, k) =>
        space ? (
          <Fragment key={k}> </Fragment>
        ) : (
          <span key={k} className="inline-block overflow-hidden pt-[0.06em] mt-[-0.06em] pb-[0.3em] mb-[-0.3em] align-bottom">
            <span className="word-rise" style={{ '--i': i } as React.CSSProperties}>
              {em ? <em>{w}</em> : w}
            </span>
          </span>
        ),
      )}
    </>
  )
}
