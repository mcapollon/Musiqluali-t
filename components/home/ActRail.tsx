import { useTranslations } from 'next-intl'

export const ACTS = [
  { id: 'overture', n: 'I', key: 'opening' },
  { id: 'the-gap', n: 'II', key: 'why' },
  { id: 'spotlight', n: 'III', key: 'mission' },
  { id: 'backstage', n: 'IV', key: 'backstage' },
  { id: 'since-2023', n: 'V', key: 'impact' },
  { id: 'now-showing', n: 'VI', key: 'formats' },
  { id: 'next-wave', n: 'VII', key: 'artists' },
  { id: 'next-show', n: 'VIII', key: 'nextShow' },
  { id: 'credits', n: 'IX', key: 'credits' },
  { id: 'house-lights', n: 'X', key: 'lights' },
  { id: 'your-seat', n: 'XI', key: 'finale' },
] as const

/**
 * The evening's programme, pinned to the left edge on wide screens: one
 * numeral per act, the current one lit (aria-current set by the motion system
 * from [data-act] sections), named on hover/focus. Also a way to jump between acts.
 */
export function ActRail() {
  const t = useTranslations('home.acts')
  return (
    <nav
      aria-label={t('label')}
      data-act-rail
      className="fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 mix-blend-difference xl:block"
    >
      <ol className="flex flex-col gap-2.5">
        {ACTS.map((act) => (
          <li key={act.id}>
            <a
              href={`#${act.id}`}
              data-act-link={act.id}
              className="group relative flex w-7 justify-end text-[0.625rem] font-medium tracking-[0.14em] text-white/60 tabular-nums transition-colors duration-500 hover:text-white focus-visible:text-white aria-[current=location]:text-white aria-[current=location]:underline aria-[current=location]:underline-offset-4"
            >
              {act.n}
              {/* Named on hover/focus only: a resting label would sit on the page's left gutter. */}
              <span className="pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 whitespace-nowrap uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {t(act.key)}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
