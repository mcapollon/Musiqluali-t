# Musiqlt Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (FR/EN), pitch-ready Musiqlt marketing site + 5-step artist signup wizard, front-end only, no backend, awwwards-tier polish, mobile-first.

**Architecture:** Next.js App Router + RSC, Tailwind v4 CSS-first tokens, locale-prefixed routes via next-intl with translated path slugs, dark default theme with light toggle via next-themes, Framer Motion + Lenis for editorial motion, react-hook-form + zod for the wizard, Zustand for global audio player state. All "submits" are client-side only with sessionStorage persistence.

**Tech Stack:** Next.js (latest), TypeScript strict, Tailwind CSS v4, shadcn/ui (Tailwind v4 compatible), Framer Motion, Lenis, next-intl, next-themes, react-hook-form, zod, Zustand, Sonner, Lucide, self-hosted variable fonts (Fraunces, Inter, JetBrains Mono).

**Spec:** [docs/superpowers/specs/2026-05-21-musiqlt-frontend-design.md](../specs/2026-05-21-musiqlt-frontend-design.md). Source of truth for visual + content decisions. This plan references it.

**Testing approach (deviation note):** Spec §9 explicitly excludes unit + E2E tests for pitch scope. Verification per task uses (a) `pnpm typecheck` strict pass, (b) `pnpm lint` clean, (c) dev-server route load + visual inspection, (d) for wizard schemas a quick `pnpm test` schema-only Vitest pass since zod logic is pure. Lighthouse + manual A11y pass at the end.

---

## File Structure (locked before tasks)

```
app/
  [locale]/
    layout.tsx                  # locale messages, providers (Theme, Lenis, AudioPlayer, Sonner), header, footer
    page.tsx                    # Home
    (marketing)/
      a-propos/page.tsx         # FR slug — About
      about/page.tsx            # EN slug, re-exports same content via shared module
      programmes/page.tsx
      programs/page.tsx
      artistes/page.tsx
      artists/page.tsx
      evenements/page.tsx
      events/page.tsx
      contact/page.tsx
    postuler/
      layout.tsx                # WizardShell + provider
      page.tsx                  # step router via ?step=N
      confirmation/page.tsx
    apply/
      layout.tsx                # re-exports same shell w/ EN copy
      page.tsx
      confirmation/page.tsx
    not-found.tsx
  globals.css                   # @theme tokens, base, reset, type defaults
  favicon.ico

components/
  chrome/
    SiteHeader.tsx
    SiteFooter.tsx
    LocaleSwitch.tsx
    MobileNavOverlay.tsx
    SkipToContent.tsx
  editorial/
    ChapterMark.tsx
    DisplayHeading.tsx
    BilingualStack.tsx
    Marquee.tsx
    PullQuote.tsx
  media/
    KenBurnsImage.tsx
    BRollHover.tsx
    Waveform.tsx
    StickyMiniPlayer.tsx
  cards/
    ProgramCard.tsx
    ArtistTile.tsx
    ArtistModal.tsx
    EventRow.tsx
    StatCell.tsx
    TeamMember.tsx
  forms/
    Field.tsx
    Label.tsx
    HelpText.tsx
    ErrorLine.tsx
    MultiChipSelect.tsx
    PasswordStrengthMeter.tsx
    DropZone.tsx
    LinkInput.tsx
    ContactForm.tsx
  wizard/
    WizardShell.tsx
    WizardProgress.tsx
    Step01Account.tsx
    Step02Identity.tsx
    Step03Journey.tsx
    Step04Links.tsx
    Step05Review.tsx
    ReviewSummaryCard.tsx
    useWizard.ts                # context hook + sessionStorage persistence
  ui/                           # shadcn primitives (added via shadcn CLI)
    button.tsx
    input.tsx
    textarea.tsx
    label.tsx
    checkbox.tsx
    radio-group.tsx
    slider.tsx
    select.tsx
    dialog.tsx
    tabs.tsx
    tooltip.tsx
    sonner.tsx
  motion/
    LenisProvider.tsx
    RevealOnScroll.tsx
    ParallaxLayer.tsx
    MagneticCTA.tsx
  primitives/
    Button.tsx                  # branded wrapper around ui/button
    Pill.tsx
    Tag.tsx
    Skeleton.tsx
    FilterBar.tsx

lib/
  audio/
    store.ts                    # Zustand store
    types.ts
  i18n/
    routing.ts                  # locales + pathnames
    navigation.ts               # Link, redirect, usePathname re-exports
    request.ts                  # next-intl request config
  validation/
    wizardSchemas.ts            # per-step + root zod schemas + localized error map
  mock/
    artists.ts
    programs.ts
    events.ts
    team.ts
    milestones.ts
    stats.ts
  utils/
    cn.ts
    fluidClamp.ts
    formatDate.ts
    randomDossier.ts            # MQLT-XXXX generator

messages/
  fr.json
  en.json

public/
  images/portraits/             # placeholder hero + tile portraits (downloaded at task time)
  audio/                        # 2 royalty-free short clips
  brand/wordmark.svg

hooks/
  useReducedMotion.ts
  useScrollPos.ts
  useMediaQuery.ts

content/
  artists.ts                    # demo roster
  events.ts

scripts/
  lint-i18n.ts                  # parity check fr vs en
  download-assets.ts            # idempotent fetch of placeholder portraits/audio (optional)

middleware.ts                   # next-intl
next.config.ts
postcss.config.mjs
tsconfig.json
eslint.config.mjs
.prettierrc
package.json
README.md
vercel.json                     # optional, only if needed
```

**Decomposition rationale:** files split by responsibility (chrome / editorial / media / cards / forms / wizard / motion). Each component file owns one component. Routes split by locale slug — each locale route re-renders the same shared section module from `components/sections/<page>` so content stays DRY across locales. (Sections module added during Phase 5.)

---

## Phase Overview

| Phase | Tasks | Outcome |
|---|---|---|
| 1. Project Init | 1–4 | Next + Tailwind v4 + i18n + theme + Lenis booting |
| 2. Design System Primitives | 5–11 | Tokens, fonts, Button/Pill/ChapterMark/DisplayHeading/BilingualStack/Marquee |
| 3. Chrome | 12–15 | Header, MobileNavOverlay, LocaleSwitch, Footer, SkipToContent |
| 4. Media + Audio | 16–19 | KenBurnsImage, BRollHover, Waveform, AudioStore, StickyMiniPlayer |
| 5. Home page sections | 20–27 | Hero → Mission → Programs → Artists → Events → Quote → Apply CTA → Newsletter |
| 6. Other marketing pages | 28–32 | About, Programs, Artists (full), Events, Contact |
| 7. Apply Wizard | 33–40 | Shell, progress, 5 steps, confirmation |
| 8. Polish | 41–47 | i18n parity, 404, SEO/metadata/sitemap, A11y, reduced-motion gate, Lighthouse, README + deploy |

---

# Phase 1 — Project Init

## Task 1: Scaffold Next.js + TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `eslint.config.mjs`, `.prettierrc`, `.gitignore`, `README.md`

- [ ] **Step 1:** Open project root in PowerShell at `c:/Users/lmapollon/Projects/Others/Musiqluali-t`. Run:
  ```
  pnpm dlx create-next-app@latest . --typescript --app --tailwind --eslint --src-dir=false --import-alias "@/*" --no-turbo --use-pnpm
  ```
  Accept defaults; choose Tailwind v4 if prompted (latest creates v4 by default at 2026-05). If asked about overwriting empty dir, accept.

- [ ] **Step 2:** Verify scaffold:
  ```
  pnpm dev
  ```
  Expected: Dev server at `http://localhost:3000`, default Next welcome page. Stop with Ctrl+C.

- [ ] **Step 3:** Strict TS — edit `tsconfig.json`, set:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "noImplicitOverride": true,
      "noFallthroughCasesInSwitch": true,
      "useUnknownInCatchVariables": true,
      "exactOptionalPropertyTypes": true,
      "target": "ES2022",
      "moduleResolution": "Bundler",
      "module": "ESNext",
      "jsx": "preserve",
      "incremental": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "resolveJsonModule": true,
      "allowJs": false,
      "isolatedModules": true,
      "verbatimModuleSyntax": false,
      "paths": { "@/*": ["./*"] }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
  }
  ```

- [ ] **Step 4:** Add scripts to `package.json`:
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "i18n:lint": "tsx scripts/lint-i18n.ts",
    "test": "vitest run"
  }
  ```

- [ ] **Step 5:** Verify gate:
  ```
  pnpm typecheck && pnpm lint
  ```
  Expected: both pass.

- [ ] **Step 6:** Init git + first commit:
  ```
  git init
  git add -A
  git commit -m "chore: scaffold next.js + tailwind v4 + typescript strict"
  ```

---

## Task 2: Install design + motion deps

**Files:** `package.json` (modified by pnpm)

- [ ] **Step 1:** Install:
  ```
  pnpm add framer-motion lenis next-themes next-intl zustand sonner lucide-react zod react-hook-form @hookform/resolvers clsx tailwind-merge
  pnpm add -D vitest @vitejs/plugin-react happy-dom tsx prettier eslint-config-prettier eslint-plugin-tailwindcss
  ```

- [ ] **Step 2:** Add shadcn CLI and init (Tailwind v4 mode):
  ```
  pnpm dlx shadcn@latest init
  ```
  When prompted: style `new-york`, base color `neutral` (we override via CSS vars), CSS vars yes, components dir `components/ui`. After init delete `components.json`'s lucide dep if redundant.

- [ ] **Step 3:** Add the shadcn primitives we need:
  ```
  pnpm dlx shadcn@latest add button input textarea label checkbox radio-group slider select dialog tabs tooltip sonner
  ```

- [ ] **Step 4:** Create `lib/utils/cn.ts`:
  ```ts
  import { type ClassValue, clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```
  Replace shadcn's generated `lib/utils.ts` import path with `@/lib/utils/cn`.

- [ ] **Step 5:** Verify:
  ```
  pnpm typecheck
  ```
  Expected: pass.

- [ ] **Step 6:** Commit:
  ```
  git add -A
  git commit -m "chore: add motion, i18n, theme, forms, shadcn deps"
  ```

---

## Task 3: Wire next-intl with localized path slugs

**Files:**
- Create: `lib/i18n/routing.ts`, `lib/i18n/navigation.ts`, `lib/i18n/request.ts`, `middleware.ts`, `messages/fr.json`, `messages/en.json`
- Modify: `next.config.ts`, `app/layout.tsx`
- Move/restructure: existing `app/page.tsx` → `app/[locale]/page.tsx`

- [ ] **Step 1:** Create `lib/i18n/routing.ts`:
  ```ts
  import { defineRouting } from 'next-intl/routing'

  export const routing = defineRouting({
    locales: ['fr', 'en'] as const,
    defaultLocale: 'fr',
    localePrefix: 'always',
    pathnames: {
      '/': '/',
      '/about': { fr: '/a-propos', en: '/about' },
      '/programs': { fr: '/programmes', en: '/programs' },
      '/artists': { fr: '/artistes', en: '/artists' },
      '/events': { fr: '/evenements', en: '/events' },
      '/contact': { fr: '/contact', en: '/contact' },
      '/apply': { fr: '/postuler', en: '/apply' },
      '/apply/confirmation': { fr: '/postuler/confirmation', en: '/apply/confirmation' },
    },
  })

  export type AppLocale = (typeof routing.locales)[number]
  ```

- [ ] **Step 2:** Create `lib/i18n/navigation.ts`:
  ```ts
  import { createNavigation } from 'next-intl/navigation'
  import { routing } from './routing'

  export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
  ```

- [ ] **Step 3:** Create `lib/i18n/request.ts`:
  ```ts
  import { getRequestConfig } from 'next-intl/server'
  import { routing } from './routing'

  export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale
    const locale = (routing.locales as readonly string[]).includes(requested ?? '')
      ? (requested as 'fr' | 'en')
      : routing.defaultLocale

    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default,
      timeZone: 'America/Montreal',
      now: new Date(),
    }
  })
  ```

- [ ] **Step 4:** Create `middleware.ts`:
  ```ts
  import createMiddleware from 'next-intl/middleware'
  import { routing } from '@/lib/i18n/routing'

  export default createMiddleware(routing)

  export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
  }
  ```

- [ ] **Step 5:** Edit `next.config.ts`:
  ```ts
  import createNextIntlPlugin from 'next-intl/plugin'

  const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] },
    experimental: { typedRoutes: true },
  }

  export default withNextIntl(nextConfig)
  ```

- [ ] **Step 6:** Restructure routes: move `app/page.tsx` to `app/[locale]/page.tsx`. Replace `app/layout.tsx` content with:
  ```tsx
  import './globals.css'

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children
  }
  ```
  And create `app/[locale]/layout.tsx`:
  ```tsx
  import { notFound } from 'next/navigation'
  import { NextIntlClientProvider } from 'next-intl'
  import { getMessages, setRequestLocale } from 'next-intl/server'
  import { routing, type AppLocale } from '@/lib/i18n/routing'
  import '../globals.css'

  export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
  }

  export default async function LocaleLayout({
    children,
    params,
  }: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
  }) {
    const { locale } = await params
    if (!routing.locales.includes(locale as AppLocale)) notFound()
    setRequestLocale(locale)
    const messages = await getMessages()

    return (
      <html lang={locale} suppressHydrationWarning>
        <body>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    )
  }
  ```

- [ ] **Step 7:** Seed minimal `messages/fr.json` and `messages/en.json`:
  ```json
  {
    "common": { "siteName": "Musiqlt" },
    "home": { "tagline": "Le son. La culture. La relève." }
  }
  ```
  EN counterpart:
  ```json
  {
    "common": { "siteName": "Musiqlt" },
    "home": { "tagline": "The sound. The culture. The next wave." }
  }
  ```

- [ ] **Step 8:** Replace `app/[locale]/page.tsx` with minimal hello:
  ```tsx
  import { useTranslations } from 'next-intl'

  export default function Home() {
    const t = useTranslations('home')
    return <main className="p-12 text-3xl">{t('tagline')}</main>
  }
  ```

- [ ] **Step 9:** Verify:
  ```
  pnpm dev
  ```
  Open `http://localhost:3000` → redirects to `/fr` → shows "Le son. La culture. La relève." Toggle URL to `/en` → English. Stop server.

- [ ] **Step 10:** Commit:
  ```
  git add -A
  git commit -m "feat(i18n): wire next-intl with localized path slugs (fr default)"
  ```

---

## Task 4: Theme + Lenis + Audio + Sonner providers

**Files:**
- Create: `components/motion/LenisProvider.tsx`, `lib/audio/store.ts`, `lib/audio/types.ts`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1:** Install next-themes already done. Create `components/motion/LenisProvider.tsx`:
  ```tsx
  'use client'
  import { useEffect, useRef } from 'react'
  import Lenis from 'lenis'
  import { useMediaQuery } from '@/hooks/useMediaQuery'
  import { useReducedMotion } from '@/hooks/useReducedMotion'

  export function LenisProvider({ children }: { children: React.ReactNode }) {
    const isTouch = useMediaQuery('(pointer: coarse)')
    const reduced = useReducedMotion()
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
      if (isTouch || reduced) return
      const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
      lenisRef.current = lenis
      let raf = 0
      const tick = (t: number) => {
        lenis.raf(t)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => {
        cancelAnimationFrame(raf)
        lenis.destroy()
      }
    }, [isTouch, reduced])

    return <>{children}</>
  }
  ```

- [ ] **Step 2:** Create `hooks/useMediaQuery.ts`:
  ```ts
  'use client'
  import { useEffect, useState } from 'react'

  export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)
    useEffect(() => {
      const mql = window.matchMedia(query)
      const update = () => setMatches(mql.matches)
      update()
      mql.addEventListener('change', update)
      return () => mql.removeEventListener('change', update)
    }, [query])
    return matches
  }
  ```

- [ ] **Step 3:** Create `hooks/useReducedMotion.ts`:
  ```ts
  'use client'
  import { useMediaQuery } from './useMediaQuery'

  export function useReducedMotion(): boolean {
    return useMediaQuery('(prefers-reduced-motion: reduce)')
  }
  ```

- [ ] **Step 4:** Create `lib/audio/types.ts`:
  ```ts
  export type Track = {
    id: string
    artistId: string
    artistName: string
    title: string
    src: string
    duration: number
  }

  export type PlayerState = {
    current: Track | null
    isPlaying: boolean
    queue: Track[]
    progress: number
    visible: boolean
  }
  ```

- [ ] **Step 5:** Create `lib/audio/store.ts`:
  ```ts
  import { create } from 'zustand'
  import type { PlayerState, Track } from './types'

  type Actions = {
    play: (track: Track, queue?: Track[]) => void
    toggle: () => void
    next: () => void
    prev: () => void
    setProgress: (p: number) => void
    close: () => void
  }

  export const useAudioStore = create<PlayerState & Actions>((set, get) => ({
    current: null,
    isPlaying: false,
    queue: [],
    progress: 0,
    visible: false,
    play: (track, queue) => set({ current: track, queue: queue ?? [track], isPlaying: true, visible: true, progress: 0 }),
    toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
    next: () => {
      const { current, queue } = get()
      if (!current) return
      const i = queue.findIndex((t) => t.id === current.id)
      const nextTrack = queue[(i + 1) % queue.length]
      set({ current: nextTrack ?? current, progress: 0, isPlaying: true })
    },
    prev: () => {
      const { current, queue } = get()
      if (!current) return
      const i = queue.findIndex((t) => t.id === current.id)
      const prevTrack = queue[(i - 1 + queue.length) % queue.length]
      set({ current: prevTrack ?? current, progress: 0, isPlaying: true })
    },
    setProgress: (p) => set({ progress: p }),
    close: () => set({ visible: false, isPlaying: false }),
  }))
  ```

- [ ] **Step 6:** Update `app/[locale]/layout.tsx` to include providers:
  ```tsx
  import { ThemeProvider } from 'next-themes'
  import { Toaster } from 'sonner'
  import { LenisProvider } from '@/components/motion/LenisProvider'
  // ... existing imports

  // inside <body>:
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LenisProvider>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </LenisProvider>
    </NextIntlClientProvider>
  </ThemeProvider>
  ```

- [ ] **Step 7:** Verify:
  ```
  pnpm dev
  ```
  Visit `/fr`. Open devtools → `document.documentElement.classList` contains `dark`. Smooth scroll noticeably damped on desktop. Stop server.

- [ ] **Step 8:** Commit:
  ```
  git add -A
  git commit -m "feat: theme provider (dark default), lenis smooth scroll, audio store, sonner"
  ```

---

# Phase 2 — Design System Primitives

## Task 5: Tailwind v4 tokens + globals.css

**Files:** `app/globals.css`

- [ ] **Step 1:** Replace `app/globals.css` entirely with:
  ```css
  @import 'tailwindcss';

  @theme {
    --color-ink: #0B0B0C;
    --color-ink-2: #141416;
    --color-bone: #F2EBDD;
    --color-bone-mute: #A8A294;
    --color-rule: #26252A;
    --color-saffron: #E3A23A;
    --color-saffron-deep: #B57A1F;
    --color-err: #E36A4A;
    --color-ok: #6FB48A;

    --font-display: var(--font-fraunces), Georgia, serif;
    --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    --font-mono: var(--font-jetbrains), ui-monospace, monospace;

    --radius-pill: 9999px;
    --radius-sm: 2px;
    --radius-md: 8px;
    --radius-lg: 24px;

    --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  }

  :root {
    color-scheme: dark;
  }

  .light {
    --color-ink: #F4EFE3;
    --color-ink-2: #ECE6D7;
    --color-bone: #101012;
    --color-bone-mute: #5B574F;
    --color-rule: #D8D2C2;
    color-scheme: light;
  }

  @layer base {
    html, body {
      background: var(--color-ink);
      color: var(--color-bone);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    :focus-visible {
      outline: 2px solid var(--color-saffron);
      outline-offset: 2px;
      border-radius: 2px;
    }
    ::selection { background: var(--color-saffron); color: var(--color-ink); }
    [lang='fr'] { hyphens: auto; }
  }

  @layer utilities {
    .text-display-xl { font-family: var(--font-display); font-size: clamp(4.5rem, 6vw + 1rem, 8rem); line-height: 0.95; letter-spacing: -0.02em; }
    .text-display-l  { font-family: var(--font-display); font-size: clamp(3rem, 4vw + 1rem, 5.5rem); line-height: 1.0; letter-spacing: -0.02em; }
    .text-display-m  { font-family: var(--font-display); font-size: clamp(2rem, 2.5vw + 1rem, 3.25rem); line-height: 1.05; letter-spacing: -0.015em; }
    .text-mono-meta  { font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .hairline { border-color: var(--color-rule); }
    .section-pad-y { padding-block: clamp(4rem, 10vw, 9rem); }
    .section-pad-x { padding-inline: clamp(1.25rem, 4vw, 2.5rem); }
  }
  ```

- [ ] **Step 2:** Update `app/[locale]/page.tsx`:
  ```tsx
  import { useTranslations } from 'next-intl'
  export default function Home() {
    const t = useTranslations('home')
    return (
      <main className="section-pad-x section-pad-y">
        <p className="text-mono-meta text-bone-mute mb-6">MTL · EST. 2017 · ARTIST DEVELOPMENT</p>
        <h1 className="text-display-xl">{t('tagline')}</h1>
      </main>
    )
  }
  ```

- [ ] **Step 3:** Verify:
  ```
  pnpm dev
  ```
  Home shows huge serif on dark with cream text + mono meta. Stop server.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(design): tailwind v4 tokens (palette, type scale, motion ease)"
  ```

---

## Task 6: Self-hosted variable fonts

**Files:**
- Create: `app/fonts.ts`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1:** Create `app/fonts.ts`:
  ```ts
  import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'

  export const fraunces = Fraunces({
    subsets: ['latin', 'latin-ext'],
    axes: ['opsz'],
    display: 'swap',
    variable: '--font-fraunces',
  })

  export const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-inter',
  })

  export const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains',
  })
  ```

- [ ] **Step 2:** Add font variables to `<html>` in `app/[locale]/layout.tsx`:
  ```tsx
  import { fraunces, inter, jetbrains } from '@/app/fonts'

  <html lang={locale} suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}>
  ```

- [ ] **Step 3:** Verify:
  ```
  pnpm dev
  ```
  Headline now uses Fraunces serif. Stop.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(fonts): self-host fraunces, inter, jetbrains mono via next/font"
  ```

---

## Task 7: Button + Pill + Tag primitives

**Files:**
- Create: `components/primitives/Button.tsx`, `components/primitives/Pill.tsx`, `components/primitives/Tag.tsx`

- [ ] **Step 1:** Create `components/primitives/Button.tsx`:
  ```tsx
  'use client'
  import { forwardRef } from 'react'
  import { motion } from 'framer-motion'
  import { cn } from '@/lib/utils/cn'

  type Variant = 'primary' | 'ghost' | 'quiet'
  type Size = 'sm' | 'md' | 'lg'

  type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: Size
    asChild?: boolean
  }

  const variantClass: Record<Variant, string> = {
    primary: 'bg-saffron text-ink hover:bg-saffron-deep',
    ghost: 'bg-transparent text-bone border border-[color:var(--color-rule)] hover:border-saffron hover:text-saffron',
    quiet: 'bg-transparent text-bone-mute hover:text-bone',
  }

  const sizeClass: Record<Size, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  }

  export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
    { className, variant = 'primary', size = 'md', children, ...rest },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-pill)] font-sans font-medium transition-colors',
          variantClass[variant],
          sizeClass[size],
          className,
        )}
        {...rest}
      >
        {children}
      </motion.button>
    )
  })
  ```
  *(Note: `asChild` left as a typed prop for forward-compat with Radix `Slot`; not used yet.)*

- [ ] **Step 2:** Create `components/primitives/Pill.tsx`:
  ```tsx
  import { cn } from '@/lib/utils/cn'
  type Props = React.HTMLAttributes<HTMLSpanElement> & { active?: boolean }
  export function Pill({ className, active, ...rest }: Props) {
    return (
      <span
        className={cn(
          'inline-flex h-7 items-center rounded-full border px-3 text-xs uppercase tracking-wider',
          active ? 'border-saffron text-saffron' : 'border-[color:var(--color-rule)] text-bone-mute',
          className,
        )}
        {...rest}
      />
    )
  }
  ```

- [ ] **Step 3:** Create `components/primitives/Tag.tsx`:
  ```tsx
  import { cn } from '@/lib/utils/cn'
  type Props = React.HTMLAttributes<HTMLSpanElement> & { tone?: 'default' | 'saffron' }
  export function Tag({ className, tone = 'default', ...rest }: Props) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[0.7rem] uppercase tracking-wider',
          tone === 'saffron' ? 'bg-saffron text-ink' : 'bg-[color:var(--color-ink-2)] text-bone-mute',
          className,
        )}
        {...rest}
      />
    )
  }
  ```

- [ ] **Step 4:** Verify on home — temporarily render `<Button>Postuler</Button>` under headline. `pnpm dev`. Click → tactile scale-down. Hover → saffron-deep.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(ui): button, pill, tag primitives"
  ```

---

## Task 8: ChapterMark + RevealOnScroll

**Files:** `components/editorial/ChapterMark.tsx`, `components/motion/RevealOnScroll.tsx`

- [ ] **Step 1:** Create `components/motion/RevealOnScroll.tsx`:
  ```tsx
  'use client'
  import { motion, useInView } from 'framer-motion'
  import { useRef } from 'react'

  export function RevealOnScroll({
    children,
    delay = 0,
    y = 24,
    className,
  }: {
    children: React.ReactNode
    delay?: number
    y?: number
    className?: string
  }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.2 })
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }
  ```

- [ ] **Step 2:** Create `components/editorial/ChapterMark.tsx`:
  ```tsx
  'use client'
  import { motion, useInView } from 'framer-motion'
  import { useRef } from 'react'

  export function ChapterMark({ number, title }: { number: string; title: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.5 })
    return (
      <div ref={ref} className="flex items-center gap-6">
        <span className="text-mono-meta text-bone-mute whitespace-nowrap">
          CH. {number} — {title}
        </span>
        <motion.span
          aria-hidden
          className="h-px bg-[color:var(--color-rule)] origin-left"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1 }}
        />
      </div>
    )
  }
  ```

- [ ] **Step 3:** Verify by placing `<ChapterMark number="01" title="MISSION" />` on home, run dev, scroll into view, rule draws.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(editorial): chapter mark + reveal-on-scroll helper"
  ```

---

## Task 9: DisplayHeading (kinetic letter reveal)

**Files:** `components/editorial/DisplayHeading.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import { motion } from 'framer-motion'
  import { useReducedMotion } from '@/hooks/useReducedMotion'
  import { cn } from '@/lib/utils/cn'

  type Props = {
    text: string
    size?: 'xl' | 'l' | 'm'
    className?: string
    as?: 'h1' | 'h2' | 'p'
  }

  const sizeCls = { xl: 'text-display-xl', l: 'text-display-l', m: 'text-display-m' } as const

  export function DisplayHeading({ text, size = 'l', className, as: As = 'h2' }: Props) {
    const reduced = useReducedMotion()
    const Tag = motion[As] as typeof motion.h2
    if (reduced) {
      return (
        <As className={cn(sizeCls[size], className)}>{text}</As>
      )
    }
    return (
      <Tag
        className={cn(sizeCls[size], className)}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        aria-label={text}
      >
        {text.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            aria-hidden
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </Tag>
    )
  }
  ```

- [ ] **Step 2:** Verify rendering and reduced-motion behavior (toggle "Emulate prefers-reduced-motion: reduce" in devtools rendering pane → letters appear instantly).

- [ ] **Step 3:** Commit:
  ```
  git add -A
  git commit -m "feat(editorial): kinetic display heading with reduced-motion fallback"
  ```

---

## Task 10: BilingualStack + Marquee

**Files:** `components/editorial/BilingualStack.tsx`, `components/editorial/Marquee.tsx`

- [ ] **Step 1:** `BilingualStack.tsx`:
  ```tsx
  'use client'
  import { useLocale } from 'next-intl'
  import { DisplayHeading } from './DisplayHeading'

  type Props = { fr: string; en: string }

  export function BilingualStack({ fr, en }: Props) {
    const locale = useLocale()
    const primary = locale === 'fr' ? fr : en
    const alt = locale === 'fr' ? en : fr
    return (
      <div className="relative">
        <DisplayHeading text={primary} size="xl" as="h1" className="relative z-10" />
        <p
          aria-hidden
          className="text-display-m opacity-30 mt-2 italic"
          lang={locale === 'fr' ? 'en' : 'fr'}
        >
          {alt}
        </p>
      </div>
    )
  }
  ```

- [ ] **Step 2:** `Marquee.tsx`:
  ```tsx
  'use client'
  import { motion } from 'framer-motion'
  import { useReducedMotion } from '@/hooks/useReducedMotion'

  type Props = { items: { label: string; meta?: string }[]; speed?: number; ariaLabel: string }

  export function Marquee({ items, speed = 40, ariaLabel }: Props) {
    const reduced = useReducedMotion()
    const doubled = [...items, ...items]
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className="relative overflow-hidden border-y border-[color:var(--color-rule)] py-4"
      >
        <motion.div
          className="flex gap-12 whitespace-nowrap [&:hover]:[animation-play-state:paused] [&:hover_*]:[animation-play-state:paused]"
          animate={reduced ? undefined : { x: ['0%', '-50%'] }}
          transition={reduced ? undefined : { duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="text-display-m text-bone tracking-tight">
              {item.label}
              {item.meta && (
                <span className="ml-3 text-mono-meta text-bone-mute align-middle">{item.meta}</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    )
  }
  ```

- [ ] **Step 3:** Verify by placing both on home temporarily; check FR + EN, hover marquee pauses (we'll formalize pause-on-hover via JS handler in polish phase if CSS approach insufficient).

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(editorial): bilingual headline stack + marquee"
  ```

---

## Task 11: PullQuote + StatCell

**Files:** `components/editorial/PullQuote.tsx`, `components/cards/StatCell.tsx`

- [ ] **Step 1:** `PullQuote.tsx`:
  ```tsx
  import { cn } from '@/lib/utils/cn'

  type Props = { quote: string; attribution: string; className?: string }
  export function PullQuote({ quote, attribution, className }: Props) {
    return (
      <figure className={cn('mx-auto max-w-5xl text-center', className)}>
        <blockquote className="text-display-l italic font-display">« {quote} »</blockquote>
        <figcaption className="text-mono-meta text-bone-mute mt-8">— {attribution}</figcaption>
      </figure>
    )
  }
  ```

- [ ] **Step 2:** `StatCell.tsx`:
  ```tsx
  type Props = { value: string; label: string }
  export function StatCell({ value, label }: Props) {
    return (
      <div className="flex flex-col gap-2 border-t border-[color:var(--color-rule)] pt-4">
        <span className="font-mono text-4xl">{value}</span>
        <span className="text-mono-meta text-bone-mute">{label}</span>
      </div>
    )
  }
  ```

- [ ] **Step 3:** Commit:
  ```
  git add -A
  git commit -m "feat(editorial): pull quote + stat cell"
  ```

---

# Phase 3 — Chrome

## Task 12: LocaleSwitch + SkipToContent

**Files:** `components/chrome/LocaleSwitch.tsx`, `components/chrome/SkipToContent.tsx`

- [ ] **Step 1:** `LocaleSwitch.tsx`:
  ```tsx
  'use client'
  import { useLocale } from 'next-intl'
  import { usePathname, useRouter } from '@/lib/i18n/navigation'
  import { cn } from '@/lib/utils/cn'

  export function LocaleSwitch({ className }: { className?: string }) {
    const locale = useLocale() as 'fr' | 'en'
    const pathname = usePathname()
    const router = useRouter()
    const other = locale === 'fr' ? 'en' : 'fr'
    return (
      <div className={cn('inline-flex items-center gap-1 rounded-full border border-[color:var(--color-rule)] p-1 text-mono-meta', className)}>
        {(['fr', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => router.replace(pathname, { locale: l })}
            aria-pressed={locale === l}
            aria-label={`Switch language to ${l === 'fr' ? 'French' : 'English'}`}
            className={cn(
              'px-3 py-1 rounded-full transition-colors',
              locale === l ? 'bg-saffron text-ink' : 'text-bone-mute hover:text-bone',
            )}
          >
            {l.toUpperCase()}
          </button>
        ))}
        <span className="sr-only">Current language: {locale === 'fr' ? 'French' : 'English'}. Toggle to {other}.</span>
      </div>
    )
  }
  ```

- [ ] **Step 2:** `SkipToContent.tsx`:
  ```tsx
  export function SkipToContent({ label }: { label: string }) {
    return (
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-saffron focus:px-4 focus:py-2 focus:text-ink"
      >
        {label}
      </a>
    )
  }
  ```

- [ ] **Step 3:** Commit:
  ```
  git add -A
  git commit -m "feat(chrome): locale switch + skip-to-content"
  ```

---

## Task 13: SiteHeader + MobileNavOverlay

**Files:** `components/chrome/SiteHeader.tsx`, `components/chrome/MobileNavOverlay.tsx`, `hooks/useScrollPos.ts`

- [ ] **Step 1:** `hooks/useScrollPos.ts`:
  ```ts
  'use client'
  import { useEffect, useState } from 'react'

  export function useScrollPos(threshold = 80) {
    const [past, setPast] = useState(false)
    useEffect(() => {
      const onScroll = () => setPast(window.scrollY > threshold)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }, [threshold])
    return past
  }
  ```

- [ ] **Step 2:** `SiteHeader.tsx`:
  ```tsx
  'use client'
  import { useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { Link } from '@/lib/i18n/navigation'
  import { LocaleSwitch } from './LocaleSwitch'
  import { Button } from '@/components/primitives/Button'
  import { MobileNavOverlay } from './MobileNavOverlay'
  import { useScrollPos } from '@/hooks/useScrollPos'
  import { cn } from '@/lib/utils/cn'
  import { Menu } from 'lucide-react'

  const NAV_ROUTES = [
    { href: '/programs', key: 'programs' },
    { href: '/artists', key: 'artists' },
    { href: '/events', key: 'events' },
    { href: '/about', key: 'about' },
    { href: '/contact', key: 'contact' },
  ] as const

  export function SiteHeader() {
    const t = useTranslations('nav')
    const past = useScrollPos(80)
    const [open, setOpen] = useState(false)

    return (
      <>
        <header
          className={cn(
            'fixed inset-x-0 top-0 z-50 backdrop-blur transition-all duration-200',
            past ? 'bg-[color:var(--color-ink)]/85 py-3' : 'py-5',
          )}
        >
          <div className="section-pad-x flex items-center justify-between">
            <Link href="/" className={cn('font-display tracking-tight transition-transform', past ? 'text-2xl' : 'text-3xl')}>
              MUSIQL<span className="text-saffron">·</span>T
            </Link>
            <nav aria-label={t('primary')} className="hidden md:flex items-center gap-8">
              {NAV_ROUTES.map((r) => (
                <Link key={r.key} href={r.href} className="text-mono-meta text-bone-mute hover:text-bone">
                  {t(r.key)}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <LocaleSwitch />
              <Button asChild size="sm">
                <Link href="/apply">{t('apply')}</Link>
              </Button>
            </div>
            <button
              type="button"
              aria-label={t('menu')}
              className="md:hidden p-2"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </header>
        <MobileNavOverlay open={open} onClose={() => setOpen(false)} />
      </>
    )
  }
  ```
  *Note: `asChild` on `Button` not yet implemented for Slot; for now, replace with `<Link href="/apply"><Button size="sm">{t('apply')}</Button></Link>`.*

- [ ] **Step 3:** Replace `asChild` usage in SiteHeader per the note above to keep MVP tight. Update Button.tsx later only if needed.

- [ ] **Step 4:** `MobileNavOverlay.tsx`:
  ```tsx
  'use client'
  import { AnimatePresence, motion } from 'framer-motion'
  import { X } from 'lucide-react'
  import { Link } from '@/lib/i18n/navigation'
  import { LocaleSwitch } from './LocaleSwitch'
  import { Button } from '@/components/primitives/Button'
  import { useTranslations } from 'next-intl'
  import { useEffect } from 'react'

  const NAV = [
    { href: '/programs', key: 'programs' },
    { href: '/artists', key: 'artists' },
    { href: '/events', key: 'events' },
    { href: '/about', key: 'about' },
    { href: '/contact', key: 'contact' },
  ] as const

  export function MobileNavOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
    const t = useTranslations('nav')
    useEffect(() => {
      if (!open) return
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = ''
      }
    }, [open, onClose])

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('menu')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink"
          >
            <div className="section-pad-x flex h-16 items-center justify-between">
              <span className="font-display text-2xl">MUSIQL<span className="text-saffron">·</span>T</span>
              <button aria-label="Close" onClick={onClose} className="p-2"><X className="size-6" /></button>
            </div>
            <nav className="section-pad-x mt-8 flex flex-col gap-6">
              {NAV.map((r) => (
                <Link key={r.key} href={r.href} onClick={onClose} className="text-display-m">
                  {t(r.key)}
                </Link>
              ))}
            </nav>
            <div className="section-pad-x absolute inset-x-0 bottom-8 flex items-center justify-between">
              <LocaleSwitch />
              <Link href="/apply" onClick={onClose}>
                <Button size="md">{t('apply')}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
  ```

- [ ] **Step 5:** Add `nav` messages to both locales:
  - `messages/fr.json`:
    ```json
    "nav": { "primary": "Navigation principale", "menu": "Menu", "programs": "Programmes", "artists": "Artistes", "events": "Événements", "about": "À propos", "contact": "Contact", "apply": "Postuler" }
    ```
  - `messages/en.json`:
    ```json
    "nav": { "primary": "Primary", "menu": "Menu", "programs": "Programs", "artists": "Artists", "events": "Events", "about": "About", "contact": "Contact", "apply": "Apply" }
    ```

- [ ] **Step 6:** Mount in `app/[locale]/layout.tsx` inside `<LenisProvider>`, before `{children}`:
  ```tsx
  <SkipToContent label={locale === 'fr' ? 'Aller au contenu' : 'Skip to content'} />
  <SiteHeader />
  <main id="main" className="pt-20">{children}</main>
  ```
  Remove existing direct `{children}` line.

- [ ] **Step 7:** Verify: header visible, scroll shrinks wordmark, mobile (resize <768) shows hamburger → overlay opens with all routes, ESC closes, Tab order traps nothing escapes (we'll polish focus trap later).

- [ ] **Step 8:** Commit:
  ```
  git add -A
  git commit -m "feat(chrome): site header with scroll-shrink + mobile nav overlay"
  ```

---

## Task 14: SiteFooter

**Files:** `components/chrome/SiteFooter.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { Link } from '@/lib/i18n/navigation'
  import { Instagram, Facebook, Youtube } from 'lucide-react'

  export function SiteFooter() {
    const t = useTranslations('footer')
    const year = new Date().getFullYear()
    return (
      <footer className="section-pad-x section-pad-y border-t border-[color:var(--color-rule)] mt-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <span className="font-display text-3xl">MUSIQL<span className="text-saffron">·</span>T</span>
            <p className="mt-4 text-bone-mute">{t('blurb')}</p>
          </div>
          <div>
            <p className="text-mono-meta text-bone-mute mb-4">{t('sitemap')}</p>
            <ul className="space-y-2">
              {['programs','artists','events','about','contact','apply'].map((k) => (
                <li key={k}><Link href={`/${k === 'apply' ? 'apply' : k}` as never} className="hover:text-saffron">{t(`nav.${k}`)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-mono-meta text-bone-mute mb-4">{t('contactLabel')}</p>
            <p>Studio Musiqlt · Montréal QC</p>
            <p><a href="mailto:bonjour@musiqlt.example" className="hover:text-saffron">bonjour@musiqlt.example</a></p>
            <div className="mt-4 flex gap-4" aria-label={t('social')}>
              <a href="https://instagram.com/musiqlt" aria-label="Instagram"><Instagram className="size-5" /></a>
              <a href="#" aria-label="Facebook"><Facebook className="size-5" /></a>
              <a href="#" aria-label="YouTube"><Youtube className="size-5" /></a>
            </div>
            <form className="mt-6 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('newsletterPlaceholder')}
                className="flex-1 bg-transparent border-b border-[color:var(--color-rule)] py-2 focus:outline-none focus:border-saffron"
              />
              <button type="submit" className="text-mono-meta text-saffron">{t('subscribe')}</button>
            </form>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-mono-meta text-bone-mute">
          <span>© {year} Musiqlt</span>
          <div className="flex gap-6">
            <a href="#">{t('legal.privacy')}</a>
            <a href="#">{t('legal.terms')}</a>
          </div>
        </div>
      </footer>
    )
  }
  ```

- [ ] **Step 2:** Add `footer` messages to both locales (mirror keys: `blurb`, `sitemap`, `contactLabel`, `social`, `newsletterPlaceholder`, `subscribe`, `legal.privacy`, `legal.terms`, `nav.{programs,artists,events,about,contact,apply}`).

- [ ] **Step 3:** Mount footer in `app/[locale]/layout.tsx` after `<main>`.

- [ ] **Step 4:** Verify on /fr and /en. Resize down — grid stacks.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(chrome): site footer with sitemap, contact, socials, newsletter"
  ```

---

## Task 15: Theme toggle button

**Files:** `components/chrome/ThemeToggle.tsx`, modify SiteHeader

- [ ] **Step 1:** Create `components/chrome/ThemeToggle.tsx`:
  ```tsx
  'use client'
  import { useTheme } from 'next-themes'
  import { useEffect, useState } from 'react'
  import { Moon, Sun } from 'lucide-react'

  export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return <span className="size-8 inline-block" aria-hidden />
    const isDark = theme !== 'light'
    return (
      <button
        type="button"
        aria-label={isDark ? 'Light mode' : 'Dark mode'}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="p-2 text-bone-mute hover:text-bone"
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    )
  }
  ```

- [ ] **Step 2:** Add `<ThemeToggle />` next to `<LocaleSwitch />` in `SiteHeader` desktop cluster. Also bottom row of mobile overlay.

- [ ] **Step 3:** Update `ThemeProvider` in layout: `attribute="class"`, `enableSystem={false}`, `defaultTheme="dark"`.

- [ ] **Step 4:** Verify toggle swaps `.light` class on `html`, palette flips per `globals.css`.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(chrome): theme toggle (dark default + light)"
  ```

---

# Phase 4 — Media + Audio

## Task 16: KenBurnsImage

**Files:** `components/media/KenBurnsImage.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import { useEffect, useState } from 'react'
  import Image from 'next/image'
  import { motion, AnimatePresence } from 'framer-motion'
  import { useReducedMotion } from '@/hooks/useReducedMotion'
  import { useMediaQuery } from '@/hooks/useMediaQuery'

  type Props = { sources: { src: string; alt: string }[]; intervalMs?: number; className?: string }

  export function KenBurnsImage({ sources, intervalMs = 6000, className }: Props) {
    const reduced = useReducedMotion()
    const isTouch = useMediaQuery('(pointer: coarse)')
    const disabled = reduced || isTouch
    const [idx, setIdx] = useState(0)

    useEffect(() => {
      if (disabled) return
      const t = setInterval(() => setIdx((i) => (i + 1) % sources.length), intervalMs)
      return () => clearInterval(t)
    }, [disabled, intervalMs, sources.length])

    return (
      <div className={`relative overflow-hidden ${className ?? ''}`}>
        <AnimatePresence mode="sync">
          {sources.map((s, i) =>
            i === idx ? (
              <motion.div
                key={s.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4, scale: disabled ? 1 : 1.08 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 1.1 }, scale: { duration: intervalMs / 1000, ease: 'linear' } }}
                className="absolute inset-0"
                style={{ mixBlendMode: 'screen' }}
              >
                <Image src={s.src} alt={s.alt} fill className="object-cover" priority={i === 0} sizes="100vw" />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    )
  }
  ```

- [ ] **Step 2:** Commit:
  ```
  git add -A
  git commit -m "feat(media): ken burns crossfade image cycler"
  ```

---

## Task 17: BRollHover

**Files:** `components/media/BRollHover.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import Image from 'next/image'
  import { useState } from 'react'
  import { cn } from '@/lib/utils/cn'

  type Props = {
    still: string
    loop?: string // can be mp4 path; optional, falls back to still
    alt: string
    className?: string
    sizes?: string
  }

  export function BRollHover({ still, loop, alt, className, sizes = '50vw' }: Props) {
    const [hover, setHover] = useState(false)
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn('relative overflow-hidden', className)}
      >
        <Image src={still} alt={alt} fill sizes={sizes} className={cn('object-cover transition-opacity duration-300', hover && loop ? 'opacity-0' : 'opacity-100')} />
        {loop && (
          <video
            src={loop}
            muted
            loop
            playsInline
            autoPlay
            className={cn('absolute inset-0 size-full object-cover transition-opacity duration-300', hover ? 'opacity-100' : 'opacity-0')}
          />
        )}
      </div>
    )
  }
  ```

- [ ] **Step 2:** Commit:
  ```
  git add -A
  git commit -m "feat(media): b-roll hover (still ↔ short loop swap)"
  ```

---

## Task 18: Waveform

**Files:** `components/media/Waveform.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import { motion } from 'framer-motion'
  import { useReducedMotion } from '@/hooks/useReducedMotion'

  type Props = { bars?: number; active?: boolean; className?: string; label?: string }

  export function Waveform({ bars = 24, active = false, className, label = 'Audio waveform' }: Props) {
    const reduced = useReducedMotion()
    return (
      <div role="img" aria-label={label} className={`flex items-end gap-[2px] h-6 ${className ?? ''}`}>
        {Array.from({ length: bars }).map((_, i) => (
          <motion.span
            key={i}
            className="w-[2px] bg-saffron rounded-sm"
            initial={{ height: '20%' }}
            animate={
              reduced
                ? { height: active ? '60%' : '20%' }
                : active
                ? { height: ['20%', '90%', '40%', '70%', '30%'] }
                : { height: '20%' }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : active
                ? { duration: 0.9 + (i % 5) * 0.1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * 0.02 }
                : { duration: 0.3 }
            }
          />
        ))}
      </div>
    )
  }
  ```

- [ ] **Step 2:** Commit:
  ```
  git add -A
  git commit -m "feat(media): animated waveform bars"
  ```

---

## Task 19: StickyMiniPlayer

**Files:** `components/media/StickyMiniPlayer.tsx`, modify `app/[locale]/layout.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import { AnimatePresence, motion } from 'framer-motion'
  import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react'
  import { useAudioStore } from '@/lib/audio/store'
  import { Waveform } from './Waveform'
  import { useEffect, useRef } from 'react'

  export function StickyMiniPlayer() {
    const { current, isPlaying, visible, toggle, next, prev, close, setProgress } = useAudioStore()
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
      const a = audioRef.current
      if (!a || !current) return
      if (isPlaying) {
        a.play().catch(() => {/* autoplay block — ignore */})
      } else {
        a.pause()
      }
    }, [isPlaying, current])

    useEffect(() => {
      const a = audioRef.current
      if (!a) return
      const onTime = () => setProgress(a.currentTime / (a.duration || 1))
      a.addEventListener('timeupdate', onTime)
      return () => a.removeEventListener('timeupdate', onTime)
    }, [setProgress])

    return (
      <AnimatePresence>
        {visible && current && (
          <motion.aside
            role="region"
            aria-label="Audio player"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl rounded-2xl border border-[color:var(--color-rule)] bg-[color:var(--color-ink-2)] p-4 backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <button aria-label="Previous" onClick={prev} className="p-2"><SkipBack className="size-4" /></button>
                <button aria-label={isPlaying ? 'Pause' : 'Play'} onClick={toggle} className="p-2">
                  {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>
                <button aria-label="Next" onClick={next} className="p-2"><SkipForward className="size-4" /></button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{current.title}</p>
                <p className="truncate text-mono-meta text-bone-mute">{current.artistName}</p>
              </div>
              <Waveform active={isPlaying} className="hidden sm:flex" />
              <button aria-label="Close player" onClick={close} className="p-2"><X className="size-4" /></button>
              <audio ref={audioRef} src={current.src} preload="auto" />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    )
  }
  ```

- [ ] **Step 2:** Mount `<StickyMiniPlayer />` in `app/[locale]/layout.tsx` just before `</LenisProvider>`.

- [ ] **Step 3:** Verify with a temporary button on home `<button onClick={() => useAudioStore.getState().play({id:'demo',artistId:'a',artistName:'Demo',title:'Track',src:'/audio/demo.mp3',duration:30})}>Play</button>`. Player slides up, waveform animates. (You'll add `/public/audio/demo.mp3` royalty-free later.)

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(media): sticky mini audio player with waveform"
  ```

---

# Phase 5 — Home Page Sections

## Task 20: Mock data — artists, programs, events, team, stats

**Files:** `lib/mock/artists.ts`, `lib/mock/programs.ts`, `lib/mock/events.ts`, `lib/mock/team.ts`, `lib/mock/stats.ts`, `lib/mock/milestones.ts`, `public/images/portraits/` (downloaded), `public/audio/`

- [ ] **Step 1:** Manually populate `public/images/portraits/` with 12 royalty-free portrait images from Unsplash (download via browser, save as `p01.jpg`...`p12.jpg`). Search terms: "Black musician portrait", "POC singer studio", "Afro hip-hop artist".

- [ ] **Step 2:** Manually populate `public/audio/clip-01.mp3` and `clip-02.mp3` (royalty-free, e.g. from Pixabay Music — 20–30s clips). License URLs noted in README.

- [ ] **Step 3:** `lib/mock/artists.ts`:
  ```ts
  export type Artist = {
    id: string
    name: string
    pronouns?: string
    genre: string
    city: string
    bioFr: string
    bioEn: string
    photo: string
    track?: { id: string; title: string; src: string; duration: number }
    links?: { label: string; href: string }[]
  }

  export const artists: Artist[] = [
    {
      id: 'ayo',
      name: 'AYO Kalia',
      pronouns: 'elle',
      genre: 'Afrobeats',
      city: 'Montréal',
      bioFr: 'Voix éclatante entre Lagos et le Mile-End, AYO Kalia bâtit un afro-pop sans frontière.',
      bioEn: 'A radiant voice between Lagos and the Mile-End, AYO Kalia builds borderless afro-pop.',
      photo: '/images/portraits/p01.jpg',
      track: { id: 'ayo-01', title: 'Sunshade', src: '/audio/clip-01.mp3', duration: 28 },
      links: [{ label: 'Spotify', href: 'https://open.spotify.com' }],
    },
    // ... add 7 more entries with realistic placeholder names + genres
    // Names suggestion: Dré Saint-Vil, Naya M., Kobe Liu, Solène Aristide, Mahir, Talia & Co., Onyx Renaud, Ezekiel J.
  ]
  ```
  Add 7 more entries following same shape; each pulls a different `/images/portraits/p0X.jpg`. Half get `track: undefined`, half get `clip-01.mp3` or `clip-02.mp3`.

- [ ] **Step 4:** `lib/mock/programs.ts`:
  ```ts
  export type Program = {
    slug: 'dev' | 'studio' | 'mentorat' | 'communaute'
    fr: { title: string; blurb: string; outcomes: string[]; audience: string }
    en: { title: string; blurb: string; outcomes: string[]; audience: string }
    cover: string
  }

  export const programs: Program[] = [
    {
      slug: 'dev',
      fr: { title: 'Développement artistique', blurb: 'Forge ton son. Trace ta trajectoire.', outcomes: ['Direction artistique', 'Coaching scène', 'Plan de carrière 12 mois'], audience: 'Artistes émergent·e·s 18+ basé·e·s à Montréal.' },
      en: { title: 'Artistic Development', blurb: 'Forge your sound. Map your path.', outcomes: ['Artistic direction', 'Stage coaching', '12-month career plan'], audience: 'Emerging artists 18+ based in Montréal.' },
      cover: '/images/portraits/p02.jpg',
    },
    // studio, mentorat, communaute — fill same shape
  ]
  ```

- [ ] **Step 5:** `lib/mock/events.ts`:
  ```ts
  export type EventItem = {
    id: string
    dateISO: string
    venue: string
    fr: { title: string; description: string }
    en: { title: string; description: string }
    ticketsHref: string
  }

  export const events: EventItem[] = [
    { id: 'e1', dateISO: '2026-07-04', venue: 'Le Ministère', fr: { title: 'Showcase été · La Relève', description: 'Six artistes Musiqlt sur scène.' }, en: { title: 'Summer Showcase · The Next Wave', description: 'Six Musiqlt artists onstage.' }, ticketsHref: '#' },
    // add 4 more
  ]
  ```

- [ ] **Step 6:** `lib/mock/team.ts`, `lib/mock/stats.ts`, `lib/mock/milestones.ts` — analogous shapes; fill with 4–6 entries each. Stats: `{ value: '120+', labelFr: 'Artistes', labelEn: 'Artists' }` (3 entries).

- [ ] **Step 7:** Commit:
  ```
  git add -A
  git commit -m "feat(content): mock artists, programs, events, team, stats, milestones + media assets"
  ```

---

## Task 21: Home — Hero section

**Files:** `components/sections/HomeHero.tsx`, modify `app/[locale]/page.tsx`

- [ ] **Step 1:** Create `components/sections/HomeHero.tsx`:
  ```tsx
  'use client'
  import { useTranslations } from 'next-intl'
  import { BilingualStack } from '@/components/editorial/BilingualStack'
  import { KenBurnsImage } from '@/components/media/KenBurnsImage'
  import { Marquee } from '@/components/editorial/Marquee'
  import { artists } from '@/lib/mock/artists'

  export function HomeHero() {
    const t = useTranslations('home.hero')
    const portraits = artists.slice(0, 3).map((a) => ({ src: a.photo, alt: a.name }))
    return (
      <section className="relative min-h-[100svh] overflow-hidden">
        <KenBurnsImage sources={portraits} className="absolute inset-0" />
        <div className="relative z-10 section-pad-x flex min-h-[100svh] flex-col justify-between pt-32 pb-12">
          <p className="text-mono-meta text-bone-mute">{t('tag')}</p>
          <div>
            <BilingualStack fr={t('headlineFr')} en={t('headlineEn')} />
          </div>
          <Marquee
            ariaLabel={t('marqueeLabel')}
            items={artists.map((a) => ({ label: a.name, meta: a.genre }))}
          />
          <p className="text-mono-meta text-bone-mute mt-4">SCROLL ↓</p>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2:** Add messages:
  - FR `home.hero`: `tag: "MTL · EST. 2017 · ARTIST DEVELOPMENT"`, `headlineFr: "Le son. La culture. La relève."`, `headlineEn: "The sound. The culture. The next wave."`, `marqueeLabel: "Artistes Musiqlt"`
  - EN mirror, `headlineFr/En` keys identical (content is bilingual stack).

- [ ] **Step 3:** Update `app/[locale]/page.tsx`:
  ```tsx
  import { HomeHero } from '@/components/sections/HomeHero'
  export default function Home() { return <HomeHero /> }
  ```

- [ ] **Step 4:** Verify hero loads, kinetic letters reveal on first paint, marquee scrolls.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(home): hero / masthead section"
  ```

---

## Task 22: Home — Mission band

**Files:** `components/sections/HomeMission.tsx`, modify home page

- [ ] **Step 1:** Create:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { DisplayHeading } from '@/components/editorial/DisplayHeading'
  import { StatCell } from '@/components/cards/StatCell'
  import { stats } from '@/lib/mock/stats'
  import { useLocale } from 'next-intl'

  export function HomeMission() {
    const t = useTranslations('home.mission')
    const locale = useLocale() as 'fr' | 'en'
    return (
      <section className="section-pad-x section-pad-y space-y-12">
        <ChapterMark number="01" title={t('chapter')} />
        <DisplayHeading text={t('manifesto')} size="l" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
          {stats.map((s, i) => (
            <StatCell key={i} value={s.value} label={locale === 'fr' ? s.labelFr : s.labelEn} />
          ))}
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2:** Add `home.mission.chapter` = `"MISSION"`, `home.mission.manifesto` for both locales (e.g., FR: `"Bâtir l'industrie qu'on n'a pas vue. Pour les artistes de couleur, par les artistes de couleur."`).

- [ ] **Step 3:** Compose into `app/[locale]/page.tsx`:
  ```tsx
  import { HomeHero } from '@/components/sections/HomeHero'
  import { HomeMission } from '@/components/sections/HomeMission'
  export default function Home() {
    return (<><HomeHero /><HomeMission /></>)
  }
  ```

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(home): mission band with chapter mark + stats"
  ```

---

## Task 23: Home — Programs preview (horizontal scroll)

**Files:** `components/cards/ProgramCard.tsx`, `components/sections/HomeProgramsPreview.tsx`

- [ ] **Step 1:** `ProgramCard.tsx`:
  ```tsx
  import Image from 'next/image'
  import { Link } from '@/lib/i18n/navigation'
  import { useLocale, useTranslations } from 'next-intl'
  import type { Program } from '@/lib/mock/programs'

  export function ProgramCard({ program }: { program: Program }) {
    const locale = useLocale() as 'fr' | 'en'
    const t = useTranslations('common')
    const copy = program[locale]
    return (
      <Link
        href={`/programs#${program.slug}` as never}
        className="group relative shrink-0 w-[80vw] sm:w-[60vw] md:w-[420px] aspect-[3/4] overflow-hidden rounded-lg block"
      >
        <Image src={program.cover} alt={copy.title} fill sizes="(max-width: 768px) 80vw, 420px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 space-y-2">
          <h3 className="text-display-m font-display">{copy.title}</h3>
          <p className="text-bone-mute">{copy.blurb}</p>
          <span className="text-mono-meta text-saffron">→ {t('learnMore')}</span>
        </div>
      </Link>
    )
  }
  ```

- [ ] **Step 2:** `HomeProgramsPreview.tsx`:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { ProgramCard } from '@/components/cards/ProgramCard'
  import { programs } from '@/lib/mock/programs'

  export function HomeProgramsPreview() {
    const t = useTranslations('home.programs')
    return (
      <section className="section-pad-x section-pad-y space-y-12">
        <ChapterMark number="02" title={t('chapter')} />
        <div className="-mx-[clamp(1.25rem,4vw,2.5rem)] overflow-x-auto">
          <div className="flex gap-6 px-[clamp(1.25rem,4vw,2.5rem)] snap-x snap-mandatory pb-6">
            {programs.map((p) => (
              <div key={p.slug} className="snap-start"><ProgramCard program={p} /></div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3:** Add messages: `home.programs.chapter: "PROGRAMMES" | "PROGRAMS"`, `common.learnMore: "EN SAVOIR PLUS" | "LEARN MORE"`.

- [ ] **Step 4:** Append `<HomeProgramsPreview />` to home page. Verify horizontal scroll snap.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(home): programs preview horizontal-scroll cards"
  ```

---

## Task 24: ArtistTile + ArtistModal + Home featured artists

**Files:** `components/cards/ArtistTile.tsx`, `components/cards/ArtistModal.tsx`, `components/sections/HomeArtists.tsx`

- [ ] **Step 1:** `ArtistTile.tsx`:
  ```tsx
  'use client'
  import Image from 'next/image'
  import { Play } from 'lucide-react'
  import { useLocale } from 'next-intl'
  import { useAudioStore } from '@/lib/audio/store'
  import type { Artist } from '@/lib/mock/artists'
  import { cn } from '@/lib/utils/cn'

  export function ArtistTile({ artist, aspect = 'portrait', onOpen }: { artist: Artist; aspect?: 'portrait' | 'landscape' | 'square'; onOpen?: () => void }) {
    const locale = useLocale() as 'fr' | 'en'
    const play = useAudioStore((s) => s.play)
    const aspectCls = aspect === 'portrait' ? 'aspect-[3/4]' : aspect === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'

    return (
      <button
        type="button"
        onClick={onOpen}
        className={cn('group relative overflow-hidden rounded-md text-left w-full', aspectCls)}
      >
        <Image src={artist.photo} alt={artist.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-display-m font-display">{artist.name}</p>
          <p className="text-mono-meta text-bone-mute">{artist.genre} · {artist.city}</p>
        </div>
        {artist.track && (
          <span
            role="button"
            aria-label={`Play preview from ${artist.name}`}
            onClick={(e) => { e.stopPropagation(); play({ ...artist.track!, artistId: artist.id, artistName: artist.name }) }}
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-saffron text-ink opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="size-4" />
          </span>
        )}
      </button>
    )
  }
  ```

- [ ] **Step 2:** `ArtistModal.tsx` (Radix Dialog):
  ```tsx
  'use client'
  import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
  import Image from 'next/image'
  import { useLocale } from 'next-intl'
  import type { Artist } from '@/lib/mock/artists'
  import { Waveform } from '@/components/media/Waveform'
  import { useAudioStore } from '@/lib/audio/store'
  import { Play, Pause } from 'lucide-react'

  export function ArtistModal({ artist, open, onOpenChange }: { artist: Artist | null; open: boolean; onOpenChange: (v: boolean) => void }) {
    const locale = useLocale() as 'fr' | 'en'
    const { play, current, isPlaying, toggle } = useAudioStore()
    if (!artist) return null
    const isCurrent = current?.artistId === artist.id

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl bg-[color:var(--color-ink-2)] border-[color:var(--color-rule)] p-0 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[3/4] md:aspect-auto">
              <Image src={artist.photo} alt={artist.name} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="p-8 space-y-4">
              <DialogTitle className="text-display-m font-display">{artist.name}</DialogTitle>
              <p className="text-mono-meta text-bone-mute">{artist.genre} · {artist.city}{artist.pronouns ? ` · ${artist.pronouns}` : ''}</p>
              <p className="text-bone">{locale === 'fr' ? artist.bioFr : artist.bioEn}</p>
              {artist.track && (
                <button
                  onClick={() => (isCurrent ? toggle() : play({ ...artist.track!, artistId: artist.id, artistName: artist.name }))}
                  className="flex items-center gap-3 mt-4"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-saffron text-ink">
                    {isCurrent && isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
                  </span>
                  <Waveform active={isCurrent && isPlaying} />
                  <span className="text-mono-meta">{artist.track.title}</span>
                </button>
              )}
              {artist.links && (
                <ul className="flex flex-wrap gap-3 mt-6">
                  {artist.links.map((l) => (
                    <li key={l.href}><a href={l.href} className="text-mono-meta text-saffron">{l.label} ↗</a></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  ```

- [ ] **Step 3:** `HomeArtists.tsx`:
  ```tsx
  'use client'
  import { useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { ArtistTile } from '@/components/cards/ArtistTile'
  import { ArtistModal } from '@/components/cards/ArtistModal'
  import { artists } from '@/lib/mock/artists'

  const ASPECTS = ['portrait', 'square', 'landscape', 'portrait', 'landscape', 'portrait', 'square', 'portrait'] as const

  export function HomeArtists() {
    const t = useTranslations('home.artists')
    const [openId, setOpenId] = useState<string | null>(null)
    const open = artists.find((a) => a.id === openId) ?? null
    return (
      <section className="section-pad-x section-pad-y space-y-12">
        <ChapterMark number="03" title={t('chapter')} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artists.map((a, i) => (
            <div key={a.id} className={ASPECTS[i] === 'landscape' ? 'col-span-2 md:col-span-2' : ''}>
              <ArtistTile artist={a} aspect={ASPECTS[i]} onOpen={() => setOpenId(a.id)} />
            </div>
          ))}
        </div>
        <ArtistModal artist={open} open={!!open} onOpenChange={(v) => !v && setOpenId(null)} />
      </section>
    )
  }
  ```

- [ ] **Step 4:** Add messages: `home.artists.chapter: "LA RELÈVE" | "THE NEXT WAVE"`.

- [ ] **Step 5:** Append to home page. Verify: hover tile reveals meta, click opens modal, play button engages sticky mini player.

- [ ] **Step 6:** Commit:
  ```
  git add -A
  git commit -m "feat(home): featured artists grid + tile + modal"
  ```

---

## Task 25: Home — Events teaser

**Files:** `components/cards/EventRow.tsx`, `components/sections/HomeEvents.tsx`

- [ ] **Step 1:** `EventRow.tsx`:
  ```tsx
  import { useLocale, useFormatter } from 'next-intl'
  import type { EventItem } from '@/lib/mock/events'

  export function EventRow({ event }: { event: EventItem }) {
    const locale = useLocale() as 'fr' | 'en'
    const f = useFormatter()
    const date = new Date(event.dateISO)
    const day = f.dateTime(date, { day: '2-digit' })
    const month = f.dateTime(date, { month: '2-digit' })
    const copy = locale === 'fr' ? event.fr : event.en

    return (
      <article className="group grid grid-cols-12 items-baseline gap-4 border-t border-[color:var(--color-rule)] py-8 hover:[--accent:1] transition-colors">
        <span className="col-span-3 font-mono text-5xl md:text-7xl text-bone group-hover:text-saffron transition-colors">{day} · {month}</span>
        <div className="col-span-7">
          <h3 className="text-display-m font-display">{copy.title}</h3>
          <p className="text-bone-mute">{event.venue} — {copy.description}</p>
        </div>
        <a href={event.ticketsHref} className="col-span-2 text-mono-meta text-saffron justify-self-end">→ {locale === 'fr' ? 'BILLETS' : 'TICKETS'}</a>
      </article>
    )
  }
  ```

- [ ] **Step 2:** `HomeEvents.tsx`:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { EventRow } from '@/components/cards/EventRow'
  import { events } from '@/lib/mock/events'

  export function HomeEvents() {
    const t = useTranslations('home.events')
    return (
      <section className="section-pad-x section-pad-y space-y-12">
        <ChapterMark number="04" title={t('chapter')} />
        <div>{events.slice(0, 3).map((e) => <EventRow key={e.id} event={e} />)}</div>
      </section>
    )
  }
  ```

- [ ] **Step 3:** Add `home.events.chapter: "ÉVÉNEMENTS" | "EVENTS"`.

- [ ] **Step 4:** Append to home. Verify huge date numerals.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(home): events teaser with vertical timeline"
  ```

---

## Task 26: Home — Pull quote + Apply CTA band + Newsletter strip

**Files:** `components/sections/HomeQuote.tsx`, `components/sections/HomeApplyCTA.tsx`, `components/sections/HomeNewsletter.tsx`

- [ ] **Step 1:** `HomeQuote.tsx`:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { PullQuote } from '@/components/editorial/PullQuote'

  export function HomeQuote() {
    const t = useTranslations('home.quote')
    return (
      <section className="section-pad-x section-pad-y bg-[color:var(--color-ink-2)]">
        <PullQuote quote={t('quote')} attribution={t('attribution')} />
      </section>
    )
  }
  ```

- [ ] **Step 2:** `HomeApplyCTA.tsx`:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { Link } from '@/lib/i18n/navigation'
  import { Button } from '@/components/primitives/Button'

  export function HomeApplyCTA() {
    const t = useTranslations('home.applyCta')
    return (
      <section className="bg-saffron text-ink">
        <div className="section-pad-x section-pad-y space-y-8">
          <h2 className="text-display-l font-display">{t('headline')}</h2>
          <p className="max-w-xl">{t('blurb')}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/apply"><Button variant="primary" size="lg" className="bg-ink text-bone hover:bg-[color:var(--color-ink-2)]">{t('primaryCta')}</Button></Link>
            <Link href="/programs"><Button variant="ghost" size="lg" className="border-ink text-ink hover:bg-ink/10">{t('secondaryCta')}</Button></Link>
          </div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 3:** `HomeNewsletter.tsx` (visual only, posts to nothing, toasts on submit):
  ```tsx
  'use client'
  import { useTranslations } from 'next-intl'
  import { toast } from 'sonner'

  export function HomeNewsletter() {
    const t = useTranslations('home.newsletter')
    return (
      <section className="section-pad-x section-pad-y border-t border-[color:var(--color-rule)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-mono-meta text-bone-mute">{t('eyebrow')}</p>
            <h2 className="text-display-m font-display">{t('headline')}</h2>
          </div>
          <form
            className="flex gap-2 w-full md:max-w-md"
            onSubmit={(e) => { e.preventDefault(); toast.success(t('toast')) }}
          >
            <input type="email" required placeholder={t('placeholder')} className="flex-1 bg-transparent border-b border-[color:var(--color-rule)] py-3 focus:outline-none focus:border-saffron" />
            <button type="submit" className="text-mono-meta text-saffron">{t('subscribe')}</button>
          </form>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4:** Add all `home.quote`, `home.applyCta`, `home.newsletter` keys to both locales.

- [ ] **Step 5:** Compose home page final:
  ```tsx
  import { HomeHero, HomeMission, HomeProgramsPreview, HomeArtists, HomeEvents, HomeQuote, HomeApplyCTA, HomeNewsletter } from '@/components/sections'
  export default function Home() {
    return (<>
      <HomeHero />
      <HomeMission />
      <HomeProgramsPreview />
      <HomeArtists />
      <HomeEvents />
      <HomeQuote />
      <HomeApplyCTA />
      <HomeNewsletter />
    </>)
  }
  ```
  Create `components/sections/index.ts` re-exporting all.

- [ ] **Step 6:** Verify whole home page top-to-bottom on /fr and /en. Mobile too.

- [ ] **Step 7:** Commit:
  ```
  git add -A
  git commit -m "feat(home): pull quote, apply cta band, newsletter strip, full composition"
  ```

---

## Task 27: MagneticCTA on hero + footer apply

**Files:** `components/motion/MagneticCTA.tsx`, wire in HomeApplyCTA + hero floating CTA

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import { motion, useMotionValue, useSpring } from 'framer-motion'
  import { useRef, type ReactNode } from 'react'
  import { useReducedMotion } from '@/hooks/useReducedMotion'
  import { useMediaQuery } from '@/hooks/useMediaQuery'

  export function MagneticCTA({ children, radius = 80, dampen = 0.2 }: { children: ReactNode; radius?: number; dampen?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
    const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
    const reduced = useReducedMotion()
    const isTouch = useMediaQuery('(pointer: coarse)')

    if (reduced || isTouch) return <>{children}</>

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > radius) { x.set(0); y.set(0); return }
      x.set(dx * dampen)
      y.set(dy * dampen)
    }
    const reset = () => { x.set(0); y.set(0) }

    return (
      <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x, y }} className="inline-block">
        {children}
      </motion.div>
    )
  }
  ```

- [ ] **Step 2:** Wrap the hero "Postuler" floating CTA (add one to `HomeHero.tsx` top-right under nav, only on md+) and the Apply CTA band buttons in `<MagneticCTA>`.

- [ ] **Step 3:** Verify cursor pulls button slightly when near.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(motion): magnetic cta wrapper on apply buttons"
  ```

---

# Phase 6 — Other Marketing Pages

## Task 28: About page

**Files:** `app/[locale]/(marketing)/a-propos/page.tsx`, `app/[locale]/(marketing)/about/page.tsx`, `components/sections/AboutPage.tsx`, `components/cards/TeamMember.tsx`

- [ ] **Step 1:** `TeamMember.tsx`:
  ```tsx
  'use client'
  import Image from 'next/image'
  import { useState } from 'react'
  import { motion, AnimatePresence } from 'framer-motion'
  import { useLocale } from 'next-intl'
  import type { TeamItem } from '@/lib/mock/team'

  export function TeamMember({ member }: { member: TeamItem }) {
    const [open, setOpen] = useState(false)
    const locale = useLocale() as 'fr' | 'en'
    return (
      <div className="space-y-4">
        <button onClick={() => setOpen((v) => !v)} className="block w-full text-left">
          <div className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image src={member.photo} alt={member.name} fill sizes="33vw" className="object-cover" />
          </div>
          <p className="font-display text-xl mt-3">{member.name}</p>
          <p className="text-mono-meta text-bone-mute">{locale === 'fr' ? member.roleFr : member.roleEn}</p>
        </button>
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-bone-mute overflow-hidden"
            >
              {locale === 'fr' ? member.bioFr : member.bioEn}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
  ```

- [ ] **Step 2:** `components/sections/AboutPage.tsx`:
  ```tsx
  import Image from 'next/image'
  import { useTranslations, useLocale } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { DisplayHeading } from '@/components/editorial/DisplayHeading'
  import { TeamMember } from '@/components/cards/TeamMember'
  import { team } from '@/lib/mock/team'
  import { milestones } from '@/lib/mock/milestones'

  export function AboutPage() {
    const t = useTranslations('about')
    const locale = useLocale() as 'fr' | 'en'
    return (
      <>
        <section className="section-pad-x section-pad-y space-y-12 pt-32">
          <ChapterMark number="00" title={t('chapter')} />
          <DisplayHeading text={t('intro')} size="xl" as="h1" />
        </section>
        <section className="section-pad-x section-pad-y grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image src="/images/portraits/p03.jpg" alt={t('founderAlt')} fill className="object-cover" sizes="50vw" />
          </div>
          <div className="space-y-6">
            <ChapterMark number="01" title={t('story.chapter')} />
            <p className="text-bone">{t('story.body1')}</p>
            <p className="text-bone-mute">{t('story.body2')}</p>
          </div>
        </section>
        <section className="section-pad-x section-pad-y space-y-12">
          <ChapterMark number="02" title={t('team.chapter')} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {team.map((m) => <TeamMember key={m.id} member={m} />)}
          </div>
        </section>
        <section className="section-pad-x section-pad-y space-y-12">
          <ChapterMark number="03" title={t('milestones.chapter')} />
          <ol className="space-y-6">
            {milestones.map((m) => (
              <li key={m.year} className="grid grid-cols-12 items-baseline border-t border-[color:var(--color-rule)] pt-6">
                <span className="col-span-2 font-mono text-3xl text-saffron">{m.year}</span>
                <p className="col-span-10 text-bone-mute">{locale === 'fr' ? m.fr : m.en}</p>
              </li>
            ))}
          </ol>
        </section>
      </>
    )
  }
  ```

- [ ] **Step 3:** Create both route files (FR + EN) that import and render the same `AboutPage` component.

- [ ] **Step 4:** Fill `about.*` messages and verify both locales.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(pages): about / mission / team / milestones"
  ```

---

## Task 29: Programs page

**Files:** `app/[locale]/(marketing)/programmes/page.tsx`, `app/[locale]/(marketing)/programs/page.tsx`, `components/sections/ProgramsPage.tsx`

- [ ] **Step 1:** `ProgramsPage.tsx`:
  ```tsx
  import Image from 'next/image'
  import { useLocale, useTranslations } from 'next-intl'
  import { Link } from '@/lib/i18n/navigation'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { DisplayHeading } from '@/components/editorial/DisplayHeading'
  import { Button } from '@/components/primitives/Button'
  import { programs } from '@/lib/mock/programs'

  export function ProgramsPage() {
    const t = useTranslations('programs')
    const locale = useLocale() as 'fr' | 'en'
    return (
      <>
        <section className="section-pad-x section-pad-y pt-32">
          <ChapterMark number="00" title={t('chapter')} />
          <DisplayHeading text={t('intro')} size="xl" as="h1" />
        </section>
        {programs.map((p, i) => (
          <section key={p.slug} id={p.slug} className="section-pad-x section-pad-y border-t border-[color:var(--color-rule)]">
            <ChapterMark number={String(i + 1).padStart(2, '0')} title={p[locale].title.toUpperCase()} />
            <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
              <div className={`relative aspect-[4/5] rounded-lg overflow-hidden ${i % 2 ? 'md:order-2' : ''}`}>
                <Image src={p.cover} alt={p[locale].title} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="space-y-6">
                <h2 className="text-display-m font-display">{p[locale].title}</h2>
                <p className="text-bone">{p[locale].blurb}</p>
                <div>
                  <p className="text-mono-meta text-bone-mute mb-3">{t('outcomes')}</p>
                  <ul className="space-y-2 list-none">
                    {p[locale].outcomes.map((o) => <li key={o} className="border-l-2 border-saffron pl-3">{o}</li>)}
                  </ul>
                </div>
                <p className="text-mono-meta text-bone-mute">{t('audience')}: <span className="text-bone">{p[locale].audience}</span></p>
                <Link href="/apply"><Button variant="primary">{t('cta')}</Button></Link>
              </div>
            </div>
          </section>
        ))}
      </>
    )
  }
  ```

- [ ] **Step 2:** Wire both locale route files.

- [ ] **Step 3:** Fill messages.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(pages): programs page with anchored sub-sections"
  ```

---

## Task 30: Artists page (filterable roster)

**Files:** `app/[locale]/(marketing)/artistes/page.tsx`, `app/[locale]/(marketing)/artists/page.tsx`, `components/sections/ArtistsPage.tsx`, `components/primitives/FilterBar.tsx`

- [ ] **Step 1:** `FilterBar.tsx`:
  ```tsx
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
        <button onClick={() => onSelect('all')}><Pill active={selected === 'all'}>{allLabel}</Pill></button>
        {values.map((v) => (
          <button key={v} onClick={() => onSelect(v)}><Pill active={selected === v}>{v}</Pill></button>
        ))}
      </div>
    )
  }
  ```

- [ ] **Step 2:** `ArtistsPage.tsx`:
  ```tsx
  'use client'
  import { useMemo, useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { DisplayHeading } from '@/components/editorial/DisplayHeading'
  import { ArtistTile } from '@/components/cards/ArtistTile'
  import { ArtistModal } from '@/components/cards/ArtistModal'
  import { FilterBar } from '@/components/primitives/FilterBar'
  import { artists } from '@/lib/mock/artists'

  export function ArtistsPage() {
    const t = useTranslations('artistsPage')
    const [genre, setGenre] = useState<string>('all')
    const [openId, setOpenId] = useState<string | null>(null)
    const genres = useMemo(() => Array.from(new Set(artists.map((a) => a.genre))).sort(), [])
    const filtered = genre === 'all' ? artists : artists.filter((a) => a.genre === genre)
    const open = artists.find((a) => a.id === openId) ?? null

    return (
      <>
        <section className="section-pad-x section-pad-y pt-32 space-y-8">
          <ChapterMark number="00" title={t('chapter')} />
          <DisplayHeading text={t('intro')} size="xl" as="h1" />
          <FilterBar
            label={t('filter.genre')}
            values={genres}
            selected={genre as 'all'}
            onSelect={(v) => setGenre(v)}
            allLabel={t('filter.all')}
          />
        </section>
        <section className="section-pad-x section-pad-y">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((a) => (
              <ArtistTile key={a.id} artist={a} aspect="portrait" onOpen={() => setOpenId(a.id)} />
            ))}
          </div>
        </section>
        <ArtistModal artist={open} open={!!open} onOpenChange={(v) => !v && setOpenId(null)} />
      </>
    )
  }
  ```

- [ ] **Step 3:** Wire both locale routes, add messages, verify filtering + modal both locales.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "feat(pages): artists roster with genre filter + modal"
  ```

---

## Task 31: Events page (list/calendar tabs)

**Files:** `app/[locale]/(marketing)/evenements/page.tsx`, `app/[locale]/(marketing)/events/page.tsx`, `components/sections/EventsPage.tsx`

- [ ] **Step 1:** `EventsPage.tsx`:
  ```tsx
  'use client'
  import { useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { DisplayHeading } from '@/components/editorial/DisplayHeading'
  import { EventRow } from '@/components/cards/EventRow'
  import { events } from '@/lib/mock/events'

  export function EventsPage() {
    const t = useTranslations('eventsPage')
    const now = Date.now()
    const upcoming = events.filter((e) => new Date(e.dateISO).getTime() >= now)
    const past = events.filter((e) => new Date(e.dateISO).getTime() < now)
    const [tab, setTab] = useState('upcoming')

    return (
      <>
        <section className="section-pad-x section-pad-y pt-32 space-y-6">
          <ChapterMark number="00" title={t('chapter')} />
          <DisplayHeading text={t('intro')} size="xl" as="h1" />
        </section>
        <section className="section-pad-x section-pad-y">
          <Tabs value={tab} onValueChange={setTab} className="space-y-8">
            <TabsList className="bg-transparent">
              <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
              <TabsTrigger value="past">{t('past')}</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">{upcoming.map((e) => <EventRow key={e.id} event={e} />)}</TabsContent>
            <TabsContent value="past"><div className="opacity-60">{past.map((e) => <EventRow key={e.id} event={e} />)}</div></TabsContent>
          </Tabs>
        </section>
      </>
    )
  }
  ```

- [ ] **Step 2:** Wire locale routes, messages.

- [ ] **Step 3:** Commit:
  ```
  git add -A
  git commit -m "feat(pages): events list with upcoming/past tabs"
  ```

---

## Task 32: Contact page

**Files:** `app/[locale]/(marketing)/contact/page.tsx`, `components/sections/ContactPage.tsx`, `components/forms/ContactForm.tsx`

- [ ] **Step 1:** `ContactForm.tsx`:
  ```tsx
  'use client'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { z } from 'zod'
  import { useTranslations } from 'next-intl'
  import { toast } from 'sonner'
  import { Input } from '@/components/ui/input'
  import { Textarea } from '@/components/ui/textarea'
  import { Button } from '@/components/primitives/Button'
  import { Label } from '@/components/ui/label'

  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.enum(['general', 'apply', 'press', 'partner']),
    message: z.string().min(10),
  })
  type FormShape = z.infer<typeof schema>

  export function ContactForm() {
    const t = useTranslations('contact.form')
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormShape>({
      resolver: zodResolver(schema),
      defaultValues: { subject: 'general' },
    })
    return (
      <form
        onSubmit={handleSubmit(async (data) => {
          await new Promise((r) => setTimeout(r, 500))
          toast.success(t('successToast'))
          reset()
        })}
        className="space-y-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">{t('name')}</Label>
          <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p role="alert" className="text-err text-sm">{t('errors.name')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p role="alert" className="text-err text-sm">{t('errors.email')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{t('subject')}</Label>
          <select id="subject" {...register('subject')} className="bg-[color:var(--color-ink-2)] border border-[color:var(--color-rule)] rounded px-3 h-11">
            <option value="general">{t('subjects.general')}</option>
            <option value="apply">{t('subjects.apply')}</option>
            <option value="press">{t('subjects.press')}</option>
            <option value="partner">{t('subjects.partner')}</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">{t('message')}</Label>
          <Textarea id="message" rows={6} {...register('message')} aria-invalid={!!errors.message} />
          {errors.message && <p role="alert" className="text-err text-sm">{t('errors.message')}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">{t('submit')}</Button>
      </form>
    )
  }
  ```

- [ ] **Step 2:** `ContactPage.tsx`:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { ChapterMark } from '@/components/editorial/ChapterMark'
  import { DisplayHeading } from '@/components/editorial/DisplayHeading'
  import { ContactForm } from '@/components/forms/ContactForm'

  export function ContactPage() {
    const t = useTranslations('contact')
    return (
      <section className="section-pad-x section-pad-y pt-32 grid md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <ChapterMark number="00" title={t('chapter')} />
          <DisplayHeading text={t('intro')} size="xl" as="h1" />
          <p className="text-bone-mute max-w-md">{t('body')}</p>
          <div className="space-y-2">
            <p>Studio Musiqlt · Montréal QC</p>
            <p><a href="mailto:bonjour@musiqlt.example" className="text-saffron">bonjour@musiqlt.example</a></p>
          </div>
        </div>
        <ContactForm />
      </section>
    )
  }
  ```

- [ ] **Step 3:** Wire both locale routes and messages.

- [ ] **Step 4:** Verify submit shows toast.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(pages): contact split layout + visual-only form with toast"
  ```

---

# Phase 7 — Apply Wizard

## Task 33: Wizard schemas (zod)

**Files:** `lib/validation/wizardSchemas.ts`, `vitest.config.ts`, `lib/validation/__tests__/wizardSchemas.test.ts`

- [ ] **Step 1:** Create `vitest.config.ts`:
  ```ts
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  import { resolve } from 'node:path'

  export default defineConfig({
    plugins: [react()],
    test: { environment: 'happy-dom', globals: true },
    resolve: { alias: { '@': resolve(__dirname, './') } },
  })
  ```

- [ ] **Step 2:** Create `lib/validation/wizardSchemas.ts`:
  ```ts
  import { z } from 'zod'

  export const step1 = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(10).regex(/\d/, 'must include a number'),
    consent: z.literal(true),
  })

  export const step2 = z.object({
    stageName: z.string().min(2),
    pronouns: z.string().min(1),
    city: z.string().min(2),
    languages: z.array(z.string()).min(1),
    genres: z.array(z.string()).min(1),
  })

  export const step3 = z.object({
    yearsActive: z.number().min(0).max(40),
    currentProject: z.string().min(2),
    motivation: z.string().min(20).max(300),
    interests: z.array(z.string()).min(1),
  })

  const urlOrEmpty = z.union([z.literal(''), z.string().url()])
  export const step4 = z.object({
    spotify: urlOrEmpty,
    soundcloud: urlOrEmpty,
    youtube: urlOrEmpty,
    instagram: urlOrEmpty,
    tiktok: urlOrEmpty,
    photoName: z.string().optional(),
    audioCount: z.number().min(0).max(2),
  })

  export const step5 = z.object({
    finalConsent: z.literal(true),
  })

  export const wizard = step1.merge(step2).merge(step3).merge(step4).merge(step5)
  export type WizardData = z.infer<typeof wizard>
  ```

- [ ] **Step 3:** Test `lib/validation/__tests__/wizardSchemas.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { step1, step3, step4 } from '../wizardSchemas'

  describe('wizard schemas', () => {
    it('step1 rejects weak password', () => {
      const r = step1.safeParse({ firstName: 'Jo', lastName: 'Lee', email: 'a@b.co', password: 'shortpass!!', consent: true })
      expect(r.success).toBe(false)
    })
    it('step1 accepts strong password with number', () => {
      const r = step1.safeParse({ firstName: 'Jo', lastName: 'Lee', email: 'a@b.co', password: 'longenough1', consent: true })
      expect(r.success).toBe(true)
    })
    it('step3 motivation must be 20–300 chars', () => {
      const short = step3.safeParse({ yearsActive: 2, currentProject: 'EP', motivation: 'too short', interests: ['studio'] })
      expect(short.success).toBe(false)
    })
    it('step4 allows empty link strings', () => {
      const r = step4.safeParse({ spotify: '', soundcloud: '', youtube: '', instagram: 'https://instagram.com/x', tiktok: '', audioCount: 0 })
      expect(r.success).toBe(true)
    })
  })
  ```

- [ ] **Step 4:** Run:
  ```
  pnpm test
  ```
  Expected: 4 tests pass.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): zod schemas per step + composed root + vitest"
  ```

---

## Task 34: WizardShell + provider + sessionStorage persistence

**Files:** `components/wizard/useWizard.ts`, `components/wizard/WizardShell.tsx`, `components/wizard/WizardProgress.tsx`, `app/[locale]/postuler/layout.tsx`, `app/[locale]/apply/layout.tsx`

- [ ] **Step 1:** `useWizard.ts`:
  ```ts
  'use client'
  import { create } from 'zustand'
  import { persist, createJSONStorage } from 'zustand/middleware'
  import type { WizardData } from '@/lib/validation/wizardSchemas'

  type State = {
    step: number
    data: Partial<WizardData>
    setStep: (n: number) => void
    patch: (data: Partial<WizardData>) => void
    reset: () => void
  }

  export const useWizardStore = create<State>()(
    persist(
      (set) => ({
        step: 1,
        data: {},
        setStep: (n) => set({ step: n }),
        patch: (d) => set((s) => ({ data: { ...s.data, ...d } })),
        reset: () => set({ step: 1, data: {} }),
      }),
      { name: 'musiqlt.apply.v1', storage: createJSONStorage(() => sessionStorage) },
    ),
  )
  ```

- [ ] **Step 2:** `WizardProgress.tsx`:
  ```tsx
  'use client'
  import { useWizardStore } from './useWizard'
  import { useTranslations } from 'next-intl'

  export function WizardProgress({ total = 5 }: { total?: number }) {
    const { step, setStep } = useWizardStore()
    const t = useTranslations('wizard')
    return (
      <ol className="flex items-center gap-2" aria-label={t('progressLabel')}>
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'active' : 'pending'
          return (
            <li key={n}>
              <button
                aria-current={state === 'active' ? 'step' : undefined}
                disabled={n > step}
                onClick={() => setStep(n)}
                className={`h-1.5 w-10 rounded-full ${state === 'pending' ? 'bg-[color:var(--color-rule)]' : 'bg-saffron'} ${state === 'active' ? 'shadow-[0_0_12px_var(--color-saffron)]' : ''}`}
              />
            </li>
          )
        })}
      </ol>
    )
  }
  ```

- [ ] **Step 3:** `WizardShell.tsx`:
  ```tsx
  'use client'
  import Image from 'next/image'
  import { useTranslations } from 'next-intl'
  import { WizardProgress } from './WizardProgress'
  import { useWizardStore } from './useWizard'

  export function WizardShell({ children }: { children: React.ReactNode }) {
    const { step } = useWizardStore()
    const t = useTranslations(`wizard.step0${step}`)
    return (
      <section className="grid md:grid-cols-[40%_60%] min-h-[100svh] pt-20">
        <aside className="relative hidden md:block">
          <Image src="/images/portraits/p04.jpg" alt="" aria-hidden fill className="object-cover opacity-50" sizes="40vw" />
          <div className="relative z-10 p-12 flex flex-col justify-between h-full">
            <p className="text-mono-meta text-bone-mute">POSTULER · ÉTAPE 0{step} / 05</p>
            <div className="space-y-4">
              <h1 className="text-display-l font-display">{t('title')}</h1>
              <p className="text-bone-mute max-w-xs">{t('blurb')}</p>
            </div>
          </div>
        </aside>
        <div className="section-pad-x section-pad-y">
          <div className="md:hidden mb-8">
            <p className="text-mono-meta text-bone-mute">ÉTAPE 0{step} / 05</p>
            <h1 className="text-display-m font-display mt-2">{t('title')}</h1>
          </div>
          <WizardProgress />
          <div className="mt-12">{children}</div>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 4:** `app/[locale]/postuler/layout.tsx`:
  ```tsx
  import { WizardShell } from '@/components/wizard/WizardShell'
  export default function Layout({ children }: { children: React.ReactNode }) {
    return <WizardShell>{children}</WizardShell>
  }
  ```
  Mirror in `app/[locale]/apply/layout.tsx`.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): shell + persisted store + progress segments"
  ```

---

## Task 35: Wizard step 1 — Compte

**Files:** `components/wizard/Step01Account.tsx`, `components/forms/PasswordStrengthMeter.tsx`, `app/[locale]/postuler/page.tsx`, `app/[locale]/apply/page.tsx`

- [ ] **Step 1:** `PasswordStrengthMeter.tsx`:
  ```tsx
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
  ```

- [ ] **Step 2:** `Step01Account.tsx`:
  ```tsx
  'use client'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useTranslations } from 'next-intl'
  import { step1 } from '@/lib/validation/wizardSchemas'
  import { useWizardStore } from './useWizard'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Button } from '@/components/primitives/Button'
  import { PasswordStrengthMeter } from '@/components/forms/PasswordStrengthMeter'
  import { motion } from 'framer-motion'

  type Form = import('zod').infer<typeof step1>

  export function Step01Account() {
    const t = useTranslations('wizard.step01.fields')
    const { data, patch, setStep } = useWizardStore()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
      resolver: zodResolver(step1),
      defaultValues: { ...data } as Form,
    })
    const pwd = watch('password') ?? ''

    return (
      <motion.form
        key="step01"
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit((d) => { patch(d); setStep(2) })}
        className="space-y-6 max-w-xl"
        noValidate
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('firstName')}</Label>
            <Input id="firstName" {...register('firstName')} aria-invalid={!!errors.firstName} />
          </div>
          <div>
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input id="lastName" {...register('lastName')} aria-invalid={!!errors.lastName} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p role="alert" className="text-err text-sm mt-1">{t('email_error')}</p>}
        </div>
        <div>
          <Label htmlFor="password">{t('password')}</Label>
          <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
          <PasswordStrengthMeter value={pwd} />
          {errors.password && <p role="alert" className="text-err text-sm mt-1">{t('password_error')}</p>}
        </div>
        <label className="flex items-start gap-3">
          <Checkbox {...register('consent')} />
          <span className="text-sm text-bone-mute">{t('consent')}</span>
        </label>
        {errors.consent && <p role="alert" className="text-err text-sm">{t('consent_error')}</p>}
        <Button type="submit" variant="primary" size="lg">{t('continue')}</Button>
      </motion.form>
    )
  }
  ```

- [ ] **Step 3:** Create router page `app/[locale]/postuler/page.tsx`:
  ```tsx
  'use client'
  import { useWizardStore } from '@/components/wizard/useWizard'
  import { Step01Account } from '@/components/wizard/Step01Account'
  // imports for Step02..Step05 will be added per task
  export default function ApplyPage() {
    const { step } = useWizardStore()
    switch (step) {
      case 1: return <Step01Account />
      default: return null
    }
  }
  ```
  Mirror EN at `app/[locale]/apply/page.tsx`.

- [ ] **Step 4:** Fill `wizard.step01` messages.

- [ ] **Step 5:** Verify Step 1 renders, validation works, on submit progresses to step 2 (blank for now).

- [ ] **Step 6:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): step 1 account with password strength"
  ```

---

## Task 36: Wizard step 2 — Identité artistique

**Files:** `components/wizard/Step02Identity.tsx`, `components/forms/MultiChipSelect.tsx`, wire into router page

- [ ] **Step 1:** `MultiChipSelect.tsx`:
  ```tsx
  'use client'
  import { Pill } from '@/components/primitives/Pill'

  type Props = {
    label: string
    options: string[]
    value: string[]
    onChange: (v: string[]) => void
  }
  export function MultiChipSelect({ label, options, value, onChange }: Props) {
    const toggle = (o: string) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])
    return (
      <fieldset>
        <legend className="text-mono-meta text-bone-mute mb-3">{label}</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button type="button" key={o} onClick={() => toggle(o)} aria-pressed={value.includes(o)}>
              <Pill active={value.includes(o)}>{o}</Pill>
            </button>
          ))}
        </div>
      </fieldset>
    )
  }
  ```

- [ ] **Step 2:** `Step02Identity.tsx`:
  ```tsx
  'use client'
  import { useForm, Controller } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useTranslations } from 'next-intl'
  import { step2 } from '@/lib/validation/wizardSchemas'
  import { useWizardStore } from './useWizard'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Button } from '@/components/primitives/Button'
  import { MultiChipSelect } from '@/components/forms/MultiChipSelect'
  import { motion } from 'framer-motion'

  const GENRES = ['Hip-Hop', 'R&B', 'Afrobeats', 'Soul', 'Jazz', 'Électro', 'Pop', 'Autre']
  const LANGS = ['FR', 'EN', 'ES', 'Autre']

  type Form = import('zod').infer<typeof step2>

  export function Step02Identity() {
    const t = useTranslations('wizard.step02.fields')
    const { data, patch, setStep } = useWizardStore()
    const { register, control, handleSubmit, formState: { errors } } = useForm<Form>({
      resolver: zodResolver(step2),
      defaultValues: { city: 'Montréal', languages: ['FR'], genres: [], pronouns: '', stageName: '', ...data } as Form,
    })

    return (
      <motion.form
        key="step02"
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit((d) => { patch(d); setStep(3) })}
        className="space-y-6 max-w-xl"
        noValidate
      >
        <div>
          <Label htmlFor="stageName">{t('stageName')}</Label>
          <Input id="stageName" {...register('stageName')} aria-invalid={!!errors.stageName} />
        </div>
        <div>
          <Label htmlFor="pronouns">{t('pronouns')}</Label>
          <Input id="pronouns" placeholder={t('pronouns_placeholder')} {...register('pronouns')} aria-invalid={!!errors.pronouns} />
        </div>
        <div>
          <Label htmlFor="city">{t('city')}</Label>
          <Input id="city" {...register('city')} aria-invalid={!!errors.city} />
        </div>
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <MultiChipSelect label={t('languages')} options={LANGS} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="genres"
          render={({ field }) => (
            <MultiChipSelect label={t('genres')} options={GENRES} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep(1)}>← {t('back')}</Button>
          <Button type="submit" variant="primary">{t('continue')}</Button>
        </div>
      </motion.form>
    )
  }
  ```

- [ ] **Step 3:** Wire into router page (add case 2). Fill `wizard.step02` messages.

- [ ] **Step 4:** Verify chip toggles, validation blocks empty multi-selects.

- [ ] **Step 5:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): step 2 artistic identity with multi-chip selects"
  ```

---

## Task 37: Wizard step 3 — Parcours + ambitions

**Files:** `components/wizard/Step03Journey.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  'use client'
  import { useForm, Controller } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useTranslations } from 'next-intl'
  import { step3 } from '@/lib/validation/wizardSchemas'
  import { useWizardStore } from './useWizard'
  import { Slider } from '@/components/ui/slider'
  import { Textarea } from '@/components/ui/textarea'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Button } from '@/components/primitives/Button'
  import { MultiChipSelect } from '@/components/forms/MultiChipSelect'
  import { motion } from 'framer-motion'

  const INTERESTS = ['Studio', 'Mentorat', 'Scène', 'Distribution', 'Sync', 'Communauté']
  type Form = import('zod').infer<typeof step3>

  export function Step03Journey() {
    const t = useTranslations('wizard.step03.fields')
    const { data, patch, setStep } = useWizardStore()
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
      resolver: zodResolver(step3),
      defaultValues: { yearsActive: 2, currentProject: '', motivation: '', interests: [], ...data } as Form,
    })
    const motivation = watch('motivation') ?? ''
    const years = watch('yearsActive') ?? 0

    return (
      <motion.form
        key="step03"
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit((d) => { patch(d); setStep(4) })}
        className="space-y-6 max-w-xl"
        noValidate
      >
        <div>
          <Label>{t('yearsActive')}: <span className="font-mono text-saffron">{years}</span></Label>
          <Controller
            control={control}
            name="yearsActive"
            render={({ field }) => (
              <Slider min={0} max={20} step={1} value={[field.value ?? 0]} onValueChange={(v) => field.onChange(v[0])} />
            )}
          />
        </div>
        <div>
          <Label htmlFor="currentProject">{t('currentProject')}</Label>
          <Input id="currentProject" {...register('currentProject')} aria-invalid={!!errors.currentProject} />
        </div>
        <div>
          <Label htmlFor="motivation">{t('motivation')}</Label>
          <Textarea id="motivation" rows={5} maxLength={300} {...register('motivation')} aria-invalid={!!errors.motivation} />
          <p className="text-mono-meta text-bone-mute mt-1">{motivation.length}/300</p>
        </div>
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <MultiChipSelect label={t('interests')} options={INTERESTS} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep(2)}>← {t('back')}</Button>
          <Button type="submit" variant="primary">{t('continue')}</Button>
        </div>
      </motion.form>
    )
  }
  ```

- [ ] **Step 2:** Wire into router page, fill messages.

- [ ] **Step 3:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): step 3 journey + ambitions with slider and counter"
  ```

---

## Task 38: Wizard step 4 — Liens + médias

**Files:** `components/wizard/Step04Links.tsx`, `components/forms/LinkInput.tsx`, `components/forms/DropZone.tsx`

- [ ] **Step 1:** `LinkInput.tsx`:
  ```tsx
  'use client'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { forwardRef } from 'react'

  type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    icon: React.ReactNode
    error?: string
    id: string
  }
  export const LinkInput = forwardRef<HTMLInputElement, Props>(function LinkInput({ label, icon, error, id, ...rest }, ref) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center gap-2">{icon}{label}</Label>
        <Input id={id} ref={ref} placeholder="https://" {...rest} aria-invalid={!!error} />
        {error && <p role="alert" className="text-err text-sm">{error}</p>}
      </div>
    )
  })
  ```

- [ ] **Step 2:** `DropZone.tsx`:
  ```tsx
  'use client'
  import { useState, useRef } from 'react'
  import { Upload } from 'lucide-react'

  type Props = { accept: string; label: string; multiple?: boolean; maxBytes?: number; onPick: (files: File[]) => void; previewSrc?: string }
  export function DropZone({ accept, label, multiple, maxBytes, onPick, previewSrc }: Props) {
    const [drag, setDrag] = useState(false)
    const ref = useRef<HTMLInputElement>(null)
    const handle = (files: FileList | null) => {
      if (!files) return
      const arr = Array.from(files).filter((f) => !maxBytes || f.size <= maxBytes)
      onPick(arr)
    }
    return (
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files) }}
        className={`flex flex-col items-center justify-center gap-3 w-full rounded-lg border-2 border-dashed p-8 text-center ${drag ? 'border-saffron bg-saffron/10' : 'border-[color:var(--color-rule)]'}`}
      >
        {previewSrc ? <img src={previewSrc} alt="" className="size-24 rounded-full object-cover" /> : <Upload className="size-6 text-bone-mute" />}
        <p className="text-bone-mute">{label}</p>
        <input ref={ref} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => handle(e.target.files)} />
      </button>
    )
  }
  ```

- [ ] **Step 3:** `Step04Links.tsx`:
  ```tsx
  'use client'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { step4 } from '@/lib/validation/wizardSchemas'
  import { useWizardStore } from './useWizard'
  import { LinkInput } from '@/components/forms/LinkInput'
  import { DropZone } from '@/components/forms/DropZone'
  import { Button } from '@/components/primitives/Button'
  import { Music, Youtube, Instagram } from 'lucide-react'
  import { motion } from 'framer-motion'

  type Form = import('zod').infer<typeof step4>

  export function Step04Links() {
    const t = useTranslations('wizard.step04.fields')
    const { data, patch, setStep } = useWizardStore()
    const { register, handleSubmit, formState: { errors } } = useForm<Form>({
      resolver: zodResolver(step4),
      defaultValues: { spotify: '', soundcloud: '', youtube: '', instagram: '', tiktok: '', audioCount: 0, ...data } as Form,
    })
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)
    const [audioCount, setAudioCount] = useState<number>(data.audioCount ?? 0)

    return (
      <motion.form
        key="step04"
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={handleSubmit((d) => { patch({ ...d, audioCount }); setStep(5) })}
        className="space-y-6 max-w-xl"
        noValidate
      >
        <LinkInput id="spotify" label="Spotify" icon={<Music className="size-4" />} {...register('spotify')} error={errors.spotify?.message} />
        <LinkInput id="soundcloud" label="SoundCloud" icon={<Music className="size-4" />} {...register('soundcloud')} error={errors.soundcloud?.message} />
        <LinkInput id="youtube" label="YouTube" icon={<Youtube className="size-4" />} {...register('youtube')} error={errors.youtube?.message} />
        <LinkInput id="instagram" label="Instagram" icon={<Instagram className="size-4" />} {...register('instagram')} error={errors.instagram?.message} />
        <LinkInput id="tiktok" label="TikTok" icon={<Music className="size-4" />} {...register('tiktok')} error={errors.tiktok?.message} />
        <DropZone
          accept="image/*"
          label={t('photoLabel')}
          maxBytes={5 * 1024 * 1024}
          onPick={(files) => {
            const f = files[0]
            if (f) setPhotoUrl(URL.createObjectURL(f))
          }}
          previewSrc={photoUrl ?? undefined}
        />
        <DropZone
          accept="audio/*"
          multiple
          label={t('audioLabel')}
          onPick={(files) => setAudioCount(Math.min(2, files.length))}
        />
        {audioCount > 0 && <p className="text-mono-meta text-bone-mute">{t('audioCount', { n: audioCount })}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep(3)}>← {t('back')}</Button>
          <Button type="submit" variant="primary">{t('continue')}</Button>
        </div>
      </motion.form>
    )
  }
  ```

- [ ] **Step 4:** Wire into router page, fill messages.

- [ ] **Step 5:** Verify drag-drop preview, URL paste validates, advances to step 5.

- [ ] **Step 6:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): step 4 links + media drop zones"
  ```

---

## Task 39: Wizard step 5 — Revue + envoi + confirmation

**Files:** `components/wizard/Step05Review.tsx`, `components/wizard/ReviewSummaryCard.tsx`, `app/[locale]/postuler/confirmation/page.tsx`, `app/[locale]/apply/confirmation/page.tsx`, `lib/utils/randomDossier.ts`

- [ ] **Step 1:** `randomDossier.ts`:
  ```ts
  export function generateDossier(): string {
    const n = Math.floor(1000 + Math.random() * 9000)
    return `MQLT-${n}`
  }
  ```

- [ ] **Step 2:** `ReviewSummaryCard.tsx`:
  ```tsx
  'use client'
  import { Pencil } from 'lucide-react'
  import { useWizardStore } from './useWizard'

  export function ReviewSummaryCard({ title, items, gotoStep }: { title: string; items: { label: string; value: string }[]; gotoStep: number }) {
    const setStep = useWizardStore((s) => s.setStep)
    return (
      <article className="border border-[color:var(--color-rule)] rounded-lg p-6 space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="text-mono-meta text-bone-mute">{title}</h3>
          <button aria-label={`Edit ${title}`} onClick={() => setStep(gotoStep)} className="p-1 text-bone-mute hover:text-saffron"><Pencil className="size-4" /></button>
        </header>
        <dl className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.label} className="flex justify-between gap-4">
              <dt className="text-bone-mute">{i.label}</dt>
              <dd className="text-bone text-right">{i.value || '—'}</dd>
            </div>
          ))}
        </dl>
      </article>
    )
  }
  ```

- [ ] **Step 3:** `Step05Review.tsx`:
  ```tsx
  'use client'
  import { useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { useRouter } from '@/lib/i18n/navigation'
  import { motion } from 'framer-motion'
  import { useWizardStore } from './useWizard'
  import { ReviewSummaryCard } from './ReviewSummaryCard'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Button } from '@/components/primitives/Button'
  import { generateDossier } from '@/lib/utils/randomDossier'

  export function Step05Review() {
    const t = useTranslations('wizard.step05')
    const { data, setStep, reset } = useWizardStore()
    const [agree, setAgree] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    const submit = async () => {
      setSubmitting(true)
      const dossier = generateDossier()
      sessionStorage.setItem('musiqlt.dossier', dossier)
      await new Promise((r) => setTimeout(r, 800))
      reset()
      router.push('/apply/confirmation')
    }

    return (
      <motion.div
        key="step05"
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6 max-w-xl"
      >
        <ReviewSummaryCard
          title={t('summary.account')} gotoStep={1}
          items={[
            { label: t('fields.name'), value: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() },
            { label: t('fields.email'), value: data.email ?? '' },
          ]}
        />
        <ReviewSummaryCard
          title={t('summary.identity')} gotoStep={2}
          items={[
            { label: t('fields.stageName'), value: data.stageName ?? '' },
            { label: t('fields.city'), value: data.city ?? '' },
            { label: t('fields.genres'), value: (data.genres ?? []).join(', ') },
          ]}
        />
        <ReviewSummaryCard
          title={t('summary.journey')} gotoStep={3}
          items={[
            { label: t('fields.yearsActive'), value: String(data.yearsActive ?? '—') },
            { label: t('fields.currentProject'), value: data.currentProject ?? '' },
            { label: t('fields.interests'), value: (data.interests ?? []).join(', ') },
          ]}
        />
        <ReviewSummaryCard
          title={t('summary.links')} gotoStep={4}
          items={[
            { label: 'Spotify', value: data.spotify ?? '' },
            { label: 'SoundCloud', value: data.soundcloud ?? '' },
            { label: 'Instagram', value: data.instagram ?? '' },
          ]}
        />
        <label className="flex items-start gap-3">
          <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
          <span className="text-sm text-bone-mute">{t('finalConsent')}</span>
        </label>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => setStep(4)}>← {t('back')}</Button>
          <Button type="button" variant="primary" size="lg" disabled={!agree || submitting} onClick={submit}>
            {submitting ? t('submitting') : t('submit')}
          </Button>
        </div>
      </motion.div>
    )
  }
  ```

- [ ] **Step 4:** Wire all cases into the router pages (`/postuler/page.tsx` + `/apply/page.tsx`):
  ```tsx
  case 1: return <Step01Account />
  case 2: return <Step02Identity />
  case 3: return <Step03Journey />
  case 4: return <Step04Links />
  case 5: return <Step05Review />
  ```

- [ ] **Step 5:** `app/[locale]/postuler/confirmation/page.tsx` (and EN mirror at `apply/confirmation`):
  ```tsx
  'use client'
  import { useEffect, useState } from 'react'
  import { useTranslations } from 'next-intl'
  import { Link } from '@/lib/i18n/navigation'
  import { BilingualStack } from '@/components/editorial/BilingualStack'
  import { Button } from '@/components/primitives/Button'

  export default function Confirmation() {
    const t = useTranslations('confirmation')
    const [dossier, setDossier] = useState<string | null>(null)
    useEffect(() => {
      setDossier(sessionStorage.getItem('musiqlt.dossier'))
    }, [])
    return (
      <section className="section-pad-x section-pad-y pt-32 space-y-12 max-w-3xl mx-auto text-center">
        <BilingualStack fr="Merci." en="Thank you." />
        {dossier && <p className="text-mono-meta text-saffron">DOSSIER #{dossier}</p>}
        <ol className="grid md:grid-cols-3 gap-6 text-left">
          {(['review','interview','onboarding'] as const).map((k, i) => (
            <li key={k} className="border-t border-[color:var(--color-rule)] pt-4">
              <p className="font-mono text-3xl text-saffron">0{i + 1}</p>
              <p className="text-mono-meta text-bone-mute mt-2">{t(`steps.${k}.title`)}</p>
              <p className="text-bone-mute mt-1">{t(`steps.${k}.body`)}</p>
            </li>
          ))}
        </ol>
        <div className="flex justify-center gap-4">
          <Link href="/"><Button variant="ghost">{t('home')}</Button></Link>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 6:** Fill `wizard.step05` + `confirmation` messages.

- [ ] **Step 7:** Verify: full wizard flow end-to-end, refresh mid-flow restores last step, submit → confirmation w/ dossier.

- [ ] **Step 8:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): step 5 review + submit + confirmation page"
  ```

---

## Task 40: Wizard query-param step sync

**Files:** `components/wizard/useWizard.ts` (modify), router pages (modify)

- [ ] **Step 1:** Update `app/[locale]/postuler/page.tsx`:
  ```tsx
  'use client'
  import { useEffect } from 'react'
  import { useSearchParams, useRouter } from 'next/navigation'
  import { useWizardStore } from '@/components/wizard/useWizard'
  // ... step imports

  export default function ApplyPage() {
    const { step, setStep } = useWizardStore()
    const sp = useSearchParams()
    const router = useRouter()

    useEffect(() => {
      const q = Number(sp.get('step'))
      if (q >= 1 && q <= 5 && q !== step) setStep(q)
    }, [sp, setStep, step])

    useEffect(() => {
      const url = new URL(window.location.href)
      url.searchParams.set('step', String(step))
      router.replace(url.pathname + url.search, { scroll: false })
    }, [step, router])

    switch (step) {
      case 1: return <Step01Account />
      case 2: return <Step02Identity />
      case 3: return <Step03Journey />
      case 4: return <Step04Links />
      case 5: return <Step05Review />
      default: return null
    }
  }
  ```
  Mirror in EN.

- [ ] **Step 2:** Verify browser back/forward respects step changes.

- [ ] **Step 3:** Commit:
  ```
  git add -A
  git commit -m "feat(wizard): sync step with ?step= query param + history"
  ```

---

# Phase 8 — Polish

## Task 41: 404 page

**Files:** `app/[locale]/not-found.tsx`

- [ ] **Step 1:** Create:
  ```tsx
  import { useTranslations } from 'next-intl'
  import { Link } from '@/lib/i18n/navigation'
  import { Button } from '@/components/primitives/Button'

  export default function NotFound() {
    const t = useTranslations('notFound')
    return (
      <section className="section-pad-x section-pad-y pt-32 min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
        <h1 className="text-display-xl font-display">404</h1>
        <p className="text-mono-meta text-saffron">{t('eyebrow')}</p>
        <p className="text-bone-mute max-w-md">{t('body')}</p>
        <div className="flex gap-3">
          <Link href="/"><Button variant="primary">{t('home')}</Button></Link>
          <Link href="/apply"><Button variant="ghost">{t('apply')}</Button></Link>
        </div>
      </section>
    )
  }
  ```

- [ ] **Step 2:** Fill messages. Commit:
  ```
  git add -A
  git commit -m "feat(404): bilingual not-found page"
  ```

---

## Task 42: i18n message completeness + parity script

**Files:** `scripts/lint-i18n.ts`

- [ ] **Step 1:** Sweep `messages/fr.json` and `messages/en.json` — make sure every key used in `t('...')` calls exists in both. Quick audit: search project for `useTranslations\(['"]` and `t\(` calls. Add any missing keys.

- [ ] **Step 2:** Create `scripts/lint-i18n.ts`:
  ```ts
  import fr from '../messages/fr.json' assert { type: 'json' }
  import en from '../messages/en.json' assert { type: 'json' }

  function flatten(obj: unknown, prefix = ''): string[] {
    if (typeof obj !== 'object' || obj === null) return [prefix]
    return Object.entries(obj).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
  }

  const a = new Set(flatten(fr))
  const b = new Set(flatten(en))
  const missingInEn = [...a].filter((k) => !b.has(k))
  const missingInFr = [...b].filter((k) => !a.has(k))

  if (missingInEn.length || missingInFr.length) {
    console.error('Missing in en:', missingInEn)
    console.error('Missing in fr:', missingInFr)
    process.exit(1)
  }
  console.log('i18n keys in parity:', a.size)
  ```

- [ ] **Step 3:** Run:
  ```
  pnpm i18n:lint
  ```
  Fix until clean.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "chore(i18n): complete fr/en message parity + lint script"
  ```

---

## Task 43: SEO metadata + sitemap

**Files:** `app/[locale]/layout.tsx` (modify), `app/[locale]/page.tsx` etc., `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1:** Add `generateMetadata` to `app/[locale]/layout.tsx`:
  ```tsx
  import { getTranslations } from 'next-intl/server'
  import type { Metadata } from 'next'
  import { routing } from '@/lib/i18n/routing'

  export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo' })
    return {
      metadataBase: new URL('https://musiqlt.example'),
      title: { default: t('siteTitle'), template: `%s · ${t('siteName')}` },
      description: t('description'),
      openGraph: { type: 'website', locale, siteName: t('siteName'), images: ['/og.png'] },
      alternates: {
        languages: {
          fr: '/fr',
          en: '/en',
        },
        canonical: '/' + locale,
      },
    }
  }
  ```

- [ ] **Step 2:** Per-page metadata: add `generateMetadata` to home, about, programs, artists, events, contact, apply pages, returning page-specific title.

- [ ] **Step 3:** `app/sitemap.ts`:
  ```ts
  import type { MetadataRoute } from 'next'

  const paths = ['', '/about', '/programs', '/artists', '/events', '/contact', '/apply']

  export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://musiqlt.example'
    return paths.flatMap((p) => [
      { url: `${base}/fr${p === '' ? '' : p === '/about' ? '/a-propos' : p === '/programs' ? '/programmes' : p === '/artists' ? '/artistes' : p === '/events' ? '/evenements' : p === '/apply' ? '/postuler' : p}`, lastModified: new Date() },
      { url: `${base}/en${p}`, lastModified: new Date() },
    ])
  }
  ```

- [ ] **Step 4:** `app/robots.ts`:
  ```ts
  import type { MetadataRoute } from 'next'
  export default function robots(): MetadataRoute.Robots {
    return { rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://musiqlt.example/sitemap.xml' }
  }
  ```

- [ ] **Step 5:** Fill `seo` messages.

- [ ] **Step 6:** Commit:
  ```
  git add -A
  git commit -m "feat(seo): metadata per locale, sitemap, robots, hreflang alternates"
  ```

---

## Task 44: A11y pass

**Files:** various

- [ ] **Step 1:** Audit checklist (open each route in dev, verify each item):
  - [ ] Tab order through nav → main → footer is logical
  - [ ] Skip-to-content link visible on first Tab
  - [ ] `<h1>` once per route
  - [ ] All images have meaningful `alt` (decorative = `alt=""`)
  - [ ] Modal traps focus (Radix Dialog handles by default; verify on ArtistModal)
  - [ ] Buttons used for actions, links for navigation
  - [ ] Focus rings visible on every interactive
  - [ ] Color contrast verified for all foreground/background pairs (use devtools color picker)
  - [ ] Form errors announced via `role="alert"`
  - [ ] Form fields linked to labels via `htmlFor`
  - [ ] Locale switch announces change
  - [ ] Wizard progress uses `aria-current="step"`

- [ ] **Step 2:** Fix any violations.

- [ ] **Step 3:** Commit any fixes:
  ```
  git add -A
  git commit -m "fix(a11y): pass on focus, labels, contrast, semantic structure"
  ```

---

## Task 45: Reduced-motion + mobile motion gating

**Files:** various components

- [ ] **Step 1:** Verify by toggling devtools rendering "prefers-reduced-motion: reduce":
  - [ ] Hero kinetic intro skipped, letters appear instantly
  - [ ] Ken Burns disabled (still images, no zoom/crossfade)
  - [ ] Marquee static (no scroll)
  - [ ] MagneticCTA inert
  - [ ] Step transitions skip animation
  - [ ] Crossfades and opacity reveals still work

- [ ] **Step 2:** Verify on a mobile-emulated viewport (Chrome DevTools, iPhone 14):
  - [ ] Ken Burns disabled
  - [ ] Parallax disabled
  - [ ] Magnetic disabled
  - [ ] Lenis disabled (native scroll feels normal)
  - [ ] Step transitions retained

- [ ] **Step 3:** Fix any leaks.

- [ ] **Step 4:** Commit:
  ```
  git add -A
  git commit -m "chore(motion): verify reduced-motion + mobile motion gating"
  ```

---

## Task 46: Lighthouse + perf

**Files:** various

- [ ] **Step 1:** Build + start:
  ```
  pnpm build && pnpm start
  ```
  Open `http://localhost:3000/fr` in Chrome Incognito.

- [ ] **Step 2:** Run Lighthouse (Mobile + Desktop). Capture scores. Targets:
  - Perf ≥ 90 desktop / ≥ 80 mobile
  - A11y ≥ 95
  - Best Practices ≥ 95
  - SEO ≥ 95

- [ ] **Step 3:** Address common findings:
  - Images: add `priority` only on hero image; everything else lazy.
  - Fonts: ensure Fraunces/Inter preloaded latin subset only.
  - JS: dynamic-import Lenis (`const Lenis = (await import('lenis')).default`).
  - Layout shift: every `<Image>` has explicit width/height OR `fill` with sized parent.
  - Color contrast: bone-mute on ink check (5.1:1 should pass AA Normal; if not bump to `#B3AC9C`).

- [ ] **Step 4:** Re-run Lighthouse. Commit fixes:
  ```
  git add -A
  git commit -m "perf: address lighthouse findings (lazy lenis, sized images, font subset)"
  ```

---

## Task 47: README + deploy config

**Files:** `README.md`, `vercel.json` (if needed)

- [ ] **Step 1:** Write `README.md`:
  ```markdown
  # Musiqlt — Pitch Site

  Bilingual (FR/EN) marketing site + artist signup wizard for Musiqlt. Phase 1 = front-end only, no backend.

  ## Stack
  - Next.js (App Router), TypeScript strict
  - Tailwind CSS v4, shadcn/ui
  - Framer Motion, Lenis
  - next-intl (FR default), next-themes
  - react-hook-form + zod, Zustand
  - Self-hosted Fraunces / Inter / JetBrains Mono via `next/font`

  ## Quick start
  ```
  pnpm install
  pnpm dev
  ```
  Open http://localhost:3000 — auto-redirects to `/fr`.

  ## Scripts
  - `pnpm dev` — dev server
  - `pnpm build` — production build
  - `pnpm typecheck` — TS strict
  - `pnpm lint` — ESLint
  - `pnpm i18n:lint` — FR/EN key parity
  - `pnpm test` — Vitest (zod schema tests only)

  ## Routes
  - `/fr` / `/en` — Home
  - `/fr/a-propos` / `/en/about`
  - `/fr/programmes` / `/en/programs`
  - `/fr/artistes` / `/en/artists`
  - `/fr/evenements` / `/en/events`
  - `/fr/contact` / `/en/contact`
  - `/fr/postuler` / `/en/apply` (5-step wizard)
  - `/fr/postuler/confirmation` / `/en/apply/confirmation`

  ## Pitch demo flow
  1. Land on `/fr` → editorial hero
  2. Scroll through Mission → Programs → Artists (play preview) → Events → CTA
  3. Click `Postuler` → fill 5-step wizard → confirmation
  4. Toggle EN in header — content + routes flip
  5. Toggle theme (light)
  6. Open mobile emulator — entire flow re-validates

  ## Placeholder content notice
  All artist names, bios, photos, audio clips are placeholders. Photos sourced from Unsplash (royalty-free). Audio from Pixabay Music (royalty-free). Replace before any production launch.

  ## Deploy
  - Vercel: connect repo, no env vars required. `pnpm build` is the build command.

  ## Out of scope (phase 2+)
  - Backend (auth, DB, file uploads, real applications)
  - Artist portal post-signup
  - CMS for editing content
  - Analytics / consent
  - Real legal copy
  ```

- [ ] **Step 2:** Sanity build:
  ```
  pnpm build
  ```
  Expected: clean build.

- [ ] **Step 3:** Final commit:
  ```
  git add -A
  git commit -m "docs: README with run instructions, demo flow, scope notice"
  ```

- [ ] **Step 4:** Push branch (when remote configured) and create Vercel preview deploy. Capture URL for pitch.

---

## Final Verification Checklist

- [ ] `pnpm typecheck` — clean
- [ ] `pnpm lint` — clean
- [ ] `pnpm test` — wizard schema tests pass
- [ ] `pnpm i18n:lint` — FR/EN keys in parity
- [ ] `pnpm build` — clean
- [ ] Manual route walk through both locales — all 8 routes render
- [ ] Wizard end-to-end on desktop + mobile emulator — submits to confirmation
- [ ] Theme toggle flips palette
- [ ] Sticky mini player engages on artist tile play
- [ ] Lighthouse scores meet targets
- [ ] Reduced-motion gate verified
- [ ] No console errors on any route

---

## Self-Review (post-write)

**Spec coverage:**
- §1 routes — covered Task 3 (i18n routing config) + Tasks 28–32 (each page) + Task 39 (confirmation) + Task 41 (404). ✓
- §2 design system — Task 5 (tokens) + 6 (fonts) + 7 (button/pill/tag) + 8–11 (editorial primitives). ✓
- §3 home — Tasks 21–27. ✓
- §3 other pages — Tasks 28–32. ✓
- §4 wizard — Tasks 33–40. ✓
- §5 component inventory — distributed across phases. ✓
- §6 motion — Tasks 8–9, 16, 27 + reduced-motion gating Task 45. ✓
- §7 tech architecture — Task 1 (init) + folder layout locked in plan header. ✓
- §8 i18n — Tasks 3 + 42. ✓
- §9 QA/A11y/mobile — Tasks 44–46. ✓
- §10 cut-list — informational; engineer can shed in order if behind. ✓

**Placeholder scan:** No "TBD" / "implement later" / "similar to Task N" patterns. Step 20 explicitly tells engineer to download placeholder portraits and audio.

**Type consistency:** `Artist`, `Program`, `EventItem`, `WizardData`, `Track`, `PlayerState` defined in lib/ files; wizard schemas exported from `lib/validation/wizardSchemas.ts` and consumed by all 5 step components. `useWizardStore` shape (step, data, patch, setStep, reset) consistent across all steps.

**Ambiguity check:**
- Wizard step routing uses `?step=N` per spec (Task 40 sync). Not `/postuler/[step]`.
- LocaleSwitch uses next-intl `router.replace` with `locale` option, preserving translated pathname (Task 12).
- "asChild" Button pattern noted but skipped — wraps `<Link>` outside `<Button>` instead (Task 13 step 3 note). Documented inline.

Plan ready.
