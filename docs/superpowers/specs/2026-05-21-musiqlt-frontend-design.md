# Musiqlt — Frontend Design Spec (Phase 1, Sales Pitch)

**Date:** 2026-05-21
**Owner:** McKinsley Apollon
**Status:** Approved design, ready for implementation planning
**Scope:** Front-end visual design only. No backend integration. All flows complete and clickable end-to-end. Pitch-ready deploy preview.

---

## 0. Project Summary

Bilingual (FR default, EN) marketing site + artist signup wizard for **Musiqlt** (Musiquali-T, Montréal). Organisation provides artistic development through music, entertainment, and community for artists of colour, by artists of colour.

Design direction: **"The Masthead"** — editorial-magazine-meets-record-label. Dark default theme with light toggle. Modern, clean, simple, slightly corporate, deeply expressive of music + artistry. Awwwards-tier visual + interaction quality. Mobile-first.

Tech: latest Next.js (App Router, TS strict), Tailwind v4, shadcn/ui, Framer Motion, Lenis, next-intl, next-themes, react-hook-form + zod, Zustand.

---

## 1. Information Architecture & Routes

Locale-prefixed App Router, FR default. Slugs translated per locale.

```
/                          → redirect to /fr (locale negotiated via cookie + Accept-Language)
/fr                        → Home (Masthead)
/fr/a-propos               → About / Mission / Team
/fr/programmes             → Programs (artist dev, studio, mentorship, community)
/fr/artistes               → Artists roster
/fr/evenements             → Events
/fr/contact                → Contact
/fr/postuler               → Apply (5-step wizard)
/fr/postuler/confirmation  → Apply success state
/en/                       → mirror tree:
                              /en/about
                              /en/programs
                              /en/artists
                              /en/events
                              /en/contact
                              /en/apply
                              /en/apply/confirmation
/[locale]/not-found        → 404
```

### Global chrome

- **Sticky top nav.** Wordmark left. Primary links center: Programmes · Artistes · Événements · À propos · Contact. Right cluster: `FR/EN` toggle + `Postuler` CTA. Collapses to off-canvas drawer ≤ md.
- **Sticky mini-audio player.** Bottom of viewport when a track is playing. Dismissible. Swipe-down on mobile.
- **Footer.** 3-column — sitemap, contact + Montréal address placeholder, socials (IG/FB/YT/Spotify/SC), newsletter input (visual only), bilingual fine print, © year.

### Nav micro-states

- Scroll past hero → wordmark shrinks 1 → 0.85, padding tightens, 200ms.
- Active route gets accent underline that tracks position.
- Locale toggle is an inline pill, animated swap.
- Mobile nav: hamburger → full-screen overlay menu, vertical big type, locale + CTA pinned bottom.

---

## 2. Design System

### Palette — dark (default)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0B0C` | page bg |
| `--ink-2` | `#141416` | cards / elevated surfaces |
| `--bone` | `#F2EBDD` | primary text on dark |
| `--bone-mute` | `#A8A294` | secondary text |
| `--rule` | `#26252A` | hairlines, dividers |
| `--saffron` | `#E3A23A` | single accent — CTAs, active, underline cue |
| `--saffron-deep` | `#B57A1F` | hover/press accent |
| `--err` | `#E36A4A` | error |
| `--ok` | `#6FB48A` | success |

### Palette — light (toggle)

| Token | Value |
|---|---|
| bg | `#F4EFE3` |
| ink | `#101012` |
| mute | `#5B574F` |
| rule | `#D8D2C2` |
| accent | reuses `--saffron` |

### Typography

- **Display:** Fraunces (variable, opsz axis). Large editorial headlines, chapter markers, pull-quotes. Confident serif with soft warmth.
- **Body:** Inter (variable). UI and paragraphs.
- **Mono accent:** JetBrains Mono. Numerals, chapter numbers (`CH. 01`), timestamps, console-y meta.

Scale (rem, `clamp` fluid):

| Token | Size |
|---|---|
| display-xl | clamp(4.5, 6vw+1, 8) |
| display-l | clamp(3, 4vw+1, 5.5) |
| display-m | clamp(2, 2.5vw+1, 3.25) |
| h1 | 2.25 |
| h2 | 1.625 |
| h3 | 1.25 |
| body | 1 |
| small | 0.875 |
| micro | 0.75 |

Tracking: display tight `-0.02em`; mono uppercase `+0.08em`.

### Spacing

4px base. Section padding `clamp(4rem, 10vw, 9rem)` block, `clamp(1.25rem, 4vw, 2.5rem)` inline. Grid 12-col, gutter `clamp(16, 24, 32)`, max-width 1440.

### Radii

2 / 8 / 24 (pill on CTAs). Most surfaces sharp (editorial); CTAs and media tiles slightly rounded.

### Elevation

No shadows. `--ink-2` panels + 1px `--rule` hairlines.

### Motion tokens

- Ease: `cubic-bezier(0.22, 1, 0.36, 1)` (out-quint)
- Durations: 200 / 400 / 700 / 1100ms
- Lenis smooth scroll, `lerp 0.1`
- Honor `prefers-reduced-motion` → strip parallax + kinetic intro, keep crossfades

### Iconography

Lucide, 1.5px stroke. Custom `Waveform` component for audio.

### Tailwind v4

All tokens declared in `@theme` block in `globals.css`. shadcn primitives themed via CSS vars.

---

## 3. Pages

### 3.1 Home (`/fr`)

1. **Hero / Masthead** (100vh)
   - Top-left mono micro tag: `MTL · EST. 2017 · ARTIST DEVELOPMENT`
   - Top-right: locale toggle + Postuler CTA (already in nav, repeated as floating hero cluster on first paint)
   - Center: huge Fraunces display-xl bilingual stack — primary locale at full weight, alt locale ghosted at 30% opacity underneath, smaller. Letters reveal staggered on load (50ms each, out-quint, blur-4→0 + y-12→0).
   - Behind headline: full-bleed muted portrait, blend-mode `screen` over `--ink`, slow Ken Burns zoom. Cycles 3 portraits, 6s each, crossfade.
   - Bottom strip: marquee of artist names + roles, looping, pauses on hover.
   - Scroll cue: thin vertical saffron line + mono `SCROLL ↓`.

2. **Mission band** (≈80vh)
   - Mono chapter marker `CH. 01 — MISSION`
   - Fraunces display-l manifesto sentence, 2–3 lines max. Word-by-word fade-in on scroll.
   - Below: 3 stat cells (mono numerals — `120+ ARTISTES`, `8 ANS`, `MTL → MONDE`). Hairline dividers.

3. **Programs preview** — horizontal-scroll editorial cards
   - `CH. 02 — PROGRAMMES`
   - 4 oversized cards (Développement artistique · Studio · Mentorat · Communauté). Each = portrait image, big serif title, short FR/EN blurb, mono `→ EN SAVOIR PLUS`.
   - Snap-scroll horizontally on desktop, vertical stack on mobile.

4. **Featured artists** — image grid with audio
   - `CH. 03 — LA RELÈVE`
   - 8-tile irregular grid (varied aspect ratios). Hover: name + genre slide up, b-roll loop swaps still. Click play icon → sticky mini-player engages with animated waveform. Tap on mobile = expand sheet.

5. **Events teaser** — vertical timeline
   - `CH. 04 — ÉVÉNEMENTS`
   - 3 upcoming items. Massive mono day numeral `04 · 07`, serif title, venue, ticket link. Hover row → thin saffron underline fills.

6. **Manifesto pull-quote.** Full-bleed Fraunces italic, attributed to founder placeholder. Bone on ink.

7. **Apply CTA band.** Saffron field. Black serif headline ("Tu fais de la musique. On bâtit ta carrière."). Two CTAs: `Postuler` (primary, dark pill) + `Découvrir nos programmes` (ghost).

8. **Newsletter strip + footer.**

### 3.2 About (`/fr/a-propos`)

Chapter-marked long-form. Founder portrait split layout. Team grid (mono name + role; hover reveals bio panel). Timeline of org milestones (year — beat).

### 3.3 Programs (`/fr/programmes`)

One long page, 4 anchored sub-sections (cheaper than 4 routes). Each sub-section: hero portrait + 2-col layout `qu'est-ce que c'est / qui c'est pour`, bullet outcomes, apply CTA.

### 3.4 Artists (`/fr/artistes`)

Full roster grid + filter chips (genre, langue, ville). Sort: récents / a-z. Card click → modal overlay (Radix Dialog, no route change) with bio, links, audio. Modal honors browser back via History API push.

### 3.5 Events (`/fr/evenements`)

List view + calendar view tabbed. Past-events tab fades opacity. Items styled like Home timeline rows.

### 3.6 Contact (`/fr/contact`)

Split — left long-form intro + Montréal address + email + socials; right contact form (`nom`, `courriel`, `sujet` select, `message`). Visual-only submit shows Sonner toast: `Message envoyé. (démo)`.

### 3.7 Apply — see §4.

### 3.8 404 (`/[locale]/not-found`)

Big serif `404`, mono `PERDU·E ? / LOST?`, two CTAs: Accueil / Postuler.

---

## 4. Apply Wizard (5 steps)

### Layout

Full-bleed split. Left 40% sticky editorial panel: chapter marker `POSTULER`, big serif step title, mono progress `ÉTAPE 02 / 05`, micro-copy reassurance, looping b-roll portrait under tint. Right 60% form pane on `--ink-2` card, generous padding. Mobile: panel collapses to top banner, form full-width below.

### Progress UI

5 saffron segments top of form pane. Filled = done, glow = active. Click filled segment → jump back. Forward locked until current step valid.

### Steps

1. **Compte**
   - `prénom`, `nom`, `email`, `mot de passe` (strength meter, mono); checkbox `j'accepte les CGU + politique de confidentialité`.
   - zod: email valid; pwd ≥ 10 chars + 1 num; consent required.

2. **Identité artistique**
   - `nom de scène` (with availability shimmer fake-check — always succeeds after 600ms)
   - `pronoms` select (il / elle / iel / autre + custom)
   - `ville` autocomplete combobox (Montréal default; local data list)
   - `langue principale` multi (FR / EN / Autre)
   - `genre(s)` multi-chip select: Hip-Hop, R&B, Afrobeats, Soul, Jazz, Électro, Pop, Autre

3. **Parcours + ambitions**
   - `années d'activité` slider 0–20+
   - `projet actuel` short text
   - textarea `qu'est-ce que tu cherches chez Musiqlt?` (300-char counter, mono)
   - checkboxes `intérêts`: studio, mentorat, scène, distribution, sync, communauté

4. **Liens + médias**
   - URL inputs: Spotify, SoundCloud, YouTube, Instagram, TikTok (each w/ favicon icon + paste-detection to validate URL shape)
   - Drag-drop zone for photo (max 5MB, preview circle crop). No upload network call.
   - Drag-drop audio (max 2 clips, animated waveform shown after "upload"). No real upload — `URL.createObjectURL` for preview only, discarded on submit.

5. **Revue + envoi**
   - Read-only summary cards per prior step. Edit pen icon jumps back to that step.
   - Final consent + submit. Submit triggers 800ms saffron radial ripple from button center → route to `/fr/postuler/confirmation`.

### Confirmation page

- Giant Fraunces bilingual stack: "Merci. / Thank you."
- Mono `DOSSIER #MQLT-XXXX` (4-digit random, generated client-side, deterministic per-session)
- 3-step "what happens next" timeline (review · entrevue · onboarding)
- Social share row (IG / FB / link copy)
- Return-home CTA

### Validation behavior

- Field-level on blur, step-level on Continue
- Error styling: border swaps to `--err`, mono error line below
- Wizard state persists in `sessionStorage` keyed `musiqlt.apply.v1`. Hard refresh resumes at last valid step.
- Reduced-motion: kill ripple + shake; keep transitions

### Tech

react-hook-form + zod. Each step owns its own schema, composed into root schema. Headless shadcn primitives (Input, Combobox, Slider, Checkbox, Dialog). Step routing via `?step=N` query param so browser back/forward works.

---

## 5. Component Inventory

[s] = shadcn primitive · [c] = custom

### Layout / chrome
- `SiteHeader` [c] — sticky, scroll-shrink, locale toggle, mobile drawer
- `MobileNavOverlay` [c]
- `SiteFooter` [c]
- `LocaleSwitch` [c] — pill, route-aware swap
- `LenisProvider` [c]
- `ThemeProvider` [c] — next-themes, dark default

### Typography / editorial
- `ChapterMark` [c] — `CH. 0X — TITLE` mono row + hairline rule
- `DisplayHeading` [c] — kinetic letter reveal (Framer + `useInView`)
- `BilingualStack` [c] — primary + ghosted alt locale stacked headline
- `Marquee` [c] — infinite scroll row, pause-on-hover, accessible label
- `PullQuote` [c]

### Media
- `KenBurnsImage` [c] — slow zoom + crossfade cycler
- `BRollHover` [c] — still ↔ short loop on hover
- `Waveform` [c] — animated bars, syncs to audio playback state
- `AudioPlayerStore` [c] — global Zustand store
- `StickyMiniPlayer` [c] — fixed bottom, play/pause/skip/close + current artist meta

### Cards / surfaces
- `ProgramCard`, `ArtistTile`, `ArtistModal` (Dialog [s]), `EventRow`, `StatCell`, `TeamMember` [c]

### Forms
- `WizardShell`, `WizardProgress`, `Step01..Step05`, `ReviewSummaryCard` [c]
- `Field`, `Label`, `HelpText`, `ErrorLine` [c]
- `Input`, `Textarea`, `Combobox`, `Slider`, `Checkbox`, `RadioGroup` [s]
- `MultiChipSelect`, `PasswordStrengthMeter`, `DropZone`, `LinkInput` [c]
- `ContactForm` [c]
- `Toast` [s: Sonner]

### Misc UI
- `Button` [c] — `primary | ghost | quiet`, sizes `sm md lg`
- `Pill`, `Tag/Chip`, `FilterBar`, `Skeleton` [c]
- `Tabs`, `Tooltip` [s]

### Animation helpers
- `RevealOnScroll`, `ParallaxLayer`, `MagneticCTA` [c]

---

## 6. Motion & Interaction Spec

### Page-load (Home only, first paint per session)

- 0ms: bg solid ink, wordmark fades in.
- 200ms: hero portrait crossfades from black to 40% opacity.
- 400ms: headline staggered char reveal (50ms/letter, out-quint, blur-4→0 + y-12→0).
- 1100ms: marquee + scroll cue fade in.
- Subsequent route changes: no reveal, instant. Hero kinetic intro gated by `sessionStorage` flag.

### Scroll behavior

- Lenis smooth scroll, `lerp 0.1`, `wheelMultiplier 1`. Disabled on touch (iOS momentum conflicts).
- Header shrinks at scroll > 80px: wordmark scales 1 → 0.85, padding tightens (200ms).
- Section reveal: opacity 0→1, y 24→0, 700ms, threshold 0.2.
- Chapter markers: hairline rule draws left→right on enter (400ms).
- Parallax: portrait layers translate at 0.7× scroll speed. Disabled < md.

### Hover micro-interactions

- Primary button: saffron fill + label slides up while secondary label slides in from below (200ms).
- ArtistTile: meta slides up + still→b-roll swap (200ms).
- Magnetic CTA on hero Apply + footer Apply only — radius 80px, dampen 0.2.
- Underline links: thin saffron line expands left→right (200ms).
- Marquee: pause on hover, hovered item gets saffron underline.

### Click feedback

- All buttons: 60ms scale 0.97 spring-back.
- Wizard submit: saffron radial ripple from button center (800ms) → route.

### Cursor

Native only. No custom cursor.

### Audio interactions

- Play btn on ArtistTile: tile shrinks 2%, waveform bars animate full amplitude, sticky mini-player slides up from bottom (400ms).
- Pause: bars dampen to ~20% amplitude idle wave.
- Skip on mini-player: crossfade tracks (200ms).

### Wizard transitions

- Step → step: form pane slides x -16→0 + fade (400ms). Reverse on Back.
- Field error: shake 4px ±, 200ms, once.

### Reduced-motion overrides

Kill: kinetic intro, parallax, Ken Burns, marquee animation (becomes static row), magnetic, ripple, shake. Keep crossfades and opacity reveals.

### Mobile motion

Kill: Ken Burns, parallax, magnetic. Keep: reveals, shrink-header, wizard transitions, audio amplitude. ~80% of effect retained.

---

## 7. Tech Architecture & Folder Layout

### Stack (latest at install)

- Next.js (App Router, RSC) + TypeScript strict
- Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.ts`)
- shadcn/ui (Tailwind v4 compatible) + Radix primitives
- Framer Motion (motion.dev)
- Lenis
- next-intl (FR/EN routing + messages)
- next-themes
- react-hook-form + zod
- Zustand (audio player global store)
- Sonner (toasts)
- Lucide
- `next/font` self-hosted variable fonts: Fraunces, Inter, JetBrains Mono
- ESLint + Prettier + sort-imports

**No backend.** All "submits" client-side only. Wizard state in `sessionStorage`. Mock data in `lib/mock/*.ts`.

### Folder layout

```
app/
  [locale]/
    layout.tsx
    page.tsx
    (marketing)/
      a-propos/page.tsx
      programmes/page.tsx
      artistes/page.tsx
      evenements/page.tsx
      contact/page.tsx
    postuler/
      layout.tsx
      page.tsx
      confirmation/page.tsx
    not-found.tsx
  globals.css
  favicon.ico
components/
  chrome/
  editorial/
  media/
  cards/
  forms/
  wizard/
  ui/         # shadcn primitives
  motion/
lib/
  audio/
  i18n/
  validation/
  mock/
  utils/
messages/
  fr.json
  en.json
public/
  images/portraits/
  audio/
  brand/wordmark.svg
hooks/
  useReducedMotion.ts
  usePrefersAudio.ts
  useScrollPos.ts
content/
  artists.ts
  events.ts
middleware.ts
next.config.ts
postcss.config.mjs
tsconfig.json
package.json
README.md
```

### Routing detail

`middleware.ts` (next-intl) handles `/` → `/fr` redirect, browser-lang detect, locale persist cookie. Wizard step uses `?step=N` query param so back/forward works without route bloat. SessionStorage persists data and falls back to step 1 on empty.

### Build target

Vercel deploy-ready. No env vars required for pitch.

### Perf budget

- LCP ≤ 2.5s on 4G mobile. Hero portrait `next/image` priority, AVIF, blur placeholder.
- JS budget ≤ 220KB gz initial. Framer Motion via `LazyMotion` w/ domAnimation. Lenis dynamic-imported.
- Images: WebP/AVIF, responsive `sizes`, lazy below fold.
- Fonts: `display: swap`, preload Fraunces + Inter latin subsets only.

---

## 8. i18n Strategy

### Library

`next-intl` with App Router. Server-side message loading, RSC-friendly.

### Locales

`fr` default, `en`. Locale segment required in URL. Middleware redirects bare `/` based on cookie or `Accept-Language`.

### Localized routes

Slugs translated per locale via `next-intl` `pathnames` config:
- `/fr/a-propos` ↔ `/en/about`
- `/fr/programmes` ↔ `/en/programs`
- `/fr/artistes` ↔ `/en/artists`
- `/fr/evenements` ↔ `/en/events`
- `/fr/contact` ↔ `/en/contact`
- `/fr/postuler` ↔ `/en/apply`
- `/fr/postuler/confirmation` ↔ `/en/apply/confirmation`

### Locale switch behavior

`LocaleSwitch` reads current pathname, maps to alt locale via `pathnames` table, preserves query (`?step=`) + hash. Persists choice in `NEXT_LOCALE` cookie.

### Messages

Namespaced per page/component:

```
nav.programs, nav.apply
hero.tag, hero.headline.line1, hero.headline.line2
mission.manifesto, mission.stats.artists, ...
programs.items.devArtistique.title, ...
wizard.step01.title, wizard.step01.fields.email.label, wizard.step01.fields.email.error.invalid
common.cta.apply, common.cta.discover
```

### ICU + dates

ICU `{count, plural, ...}` for plurals. Dates via `useFormatter({ dateStyle: 'long' })` — `4 juillet 2026` (FR) vs `July 4, 2026` (EN).

### Bilingual hero stack

Both locales rendered simultaneously (content, not switch). Active locale full weight; alt locale at 30% opacity. Emphasis swaps when locale toggled.

### Typography per locale

- FR: ligatures on, French quotes `« »`, narrow no-break space before `: ; ? !`, `hyphens: auto` via `lang="fr"`
- EN: curly quotes, standard hyphenation

### Fallback policy

Missing key → dev console warn, render the key in prod. `lint:i18n` script compares key trees between `fr.json` and `en.json`.

### SEO

- `<html lang="...">` per route
- `hreflang` alternates injected in `generateMetadata`
- Per-locale OG meta + title/description in messages
- Localized sitemap per locale

### Form copy

All wizard labels, helpers, validation errors keyed. Zod messages localized via `setErrorMap` reading from current locale messages.

---

## 9. Visual QA, Accessibility, Mobile

### Visual QA approach (no real test suite — pitch scope)

- Manual checklist across breakpoints: 360, 414, 768, 1024, 1280, 1440, 1920.
- Optional Playwright screenshot script writing to `qa/screens/`.
- Storybook skipped. Component review via `/dev/components` route gated by `NODE_ENV !== 'production'`.
- TypeScript strict + ESLint are the safety net. No unit tests for pitch.
- Lighthouse targets: Perf ≥ 90 desktop / ≥ 80 mobile; A11y ≥ 95; Best Practices ≥ 95.

### Accessibility musts

- Contrast: bone-on-ink = 12.4:1, mute = 5.1:1, saffron-on-ink = 8.2:1. All pass AA Large + AA Normal where used.
- Focus rings: 2px saffron outline + 2px ink offset on every interactive. Never removed.
- Skip-to-content link, ink bg, visible on focus.
- Marquee, Ken Burns, parallax, kinetic intro all gated on `prefers-reduced-motion`.
- All audio: visible play/pause label, mute respected, never autoplay.
- Semantic landmarks: `<header> <nav> <main> <footer>`. Single `<h1>` per route.
- Form fields: `<label>` linked, `aria-describedby` for help + errors, `aria-invalid` on error, error text `role="alert"`.
- Wizard progress: `aria-current="step"` on active segment.
- Dialog (ArtistModal): focus trap, restore focus on close, ESC dismiss, `aria-labelledby`.
- Locale switch: announces locale change to screen readers.
- Keyboard: full nav, modal ESC, marquee pause via Space when focused.

### Mobile spec (≤ md, 768)

- Off-canvas full-screen nav drawer
- Hero headline scale floor 2.5rem; portrait still cycles, no Ken Burns
- Programs cards stack vertically (snap-scroll-y, not x)
- Artist grid 2-col masonry → tap shows expanded bottom sheet, play btn pinned in sheet
- Sticky mini-player sits above mobile nav trigger; swipe-down to dismiss
- Wizard: single-column, sticky progress bar top, sticky `Continuer` CTA bottom (safe-area inset)
- Magnetic + parallax + custom hover-states disabled

### Browser support

Last 2 versions of Chrome, Safari, Firefox, Edge. iOS Safari 16+. No IE.

### Risks called out

- Lenis + iOS Safari momentum scroll conflicts → disable Lenis on touch devices, fall back to native.
- Variable font weight on iOS Safari < 16: graceful fallback to nearest static cut.
- Audio autoplay blocked: never autoplay, always click-to-play.

---

## 10. Open Questions, Assumptions, Scope Cuts

### Open questions (defaults in place)

1. Wordmark form — default: typographic `MUSIQLT` set in Fraunces, dot-accent in saffron between `Q` and `L`. No custom mark.
2. Founding year — placeholder `EST. 2017`.
3. Address — placeholder `Studio Musiqlt · Montréal QC`. No real street.
4. Real artist names — invented placeholders, plainly displayed on site.
5. Email / phone — placeholders `bonjour@musiqlt.example` / no phone.
6. Tone of FR copy — Quebec French, **tu-form (informal)**. Switch to vous-form on request.
7. Legal / CGU links in footer — placeholder `#` anchors.
8. Social handles — IG real (`@musiqlt`), others `#`.

### Assumptions

- Client demos the live signup flow during pitch — wizard must persist across refresh (sessionStorage), not just demo-mode.
- Awwwards-tier polish > feature breadth. If time tight, follow cut-order below before sacrificing the Home / Artists / Apply polish.
- Single Vercel deploy preview = pitch artifact. No staging tier.

### Explicit scope cuts (NOT in phase 1)

- Login / dashboard / artist portal post-signup
- Real backend, persistence, email
- Blog / journal
- Single-artist deep page
- Single-event deep page
- Search
- Newsletter real subscribe
- Contact form real submit
- CMS integration (Sanity etc.)
- Analytics + cookie banner
- E2E or unit tests

### Cut-order if behind schedule

1. Drop light-mode toggle (revert to dark only)
2. Drop Ken Burns hero (use single still)
3. Drop magnetic CTA + custom mini-player (use native `<audio>`)
4. Drop horizontal-scroll programs (use 2x2 grid)
5. Last resort: drop About + Events, keep Home / Programs / Artists / Apply / Contact

### Deliverable for pitch

- Vercel preview URL
- README with run instructions
- `qa/screens/` screenshot grid (optional)
- 60-sec Loom (manual, not generated)

---

## 11. Out of scope for this spec (next phase)

- Backend (auth, DB, email, file uploads, real applications)
- CMS for editing artists / programs / events
- Artist portal post-signup (dashboard, messaging, file submissions, scheduling)
- Booking / event ticketing integration
- Newsletter provider integration
- Analytics + consent
- Real legal copy review
