# Musiqlt — Pitch Site

Bilingual (FR/EN) marketing site + artist signup wizard for Musiqlt. Phase 1 = front-end only, no backend.

## Stack

- Next.js (App Router), TypeScript strict
- Tailwind CSS v4, shadcn/ui (base-ui under the hood in v4.x)
- Framer Motion, Lenis
- next-intl (FR default), next-themes (dark default + light toggle)
- react-hook-form + zod, Zustand
- Self-hosted Fraunces / Inter / JetBrains Mono via `next/font`

## Quick start

```
pnpm install
pnpm dev
```

Open http://localhost:3000 — auto-redirects to `/fr`.

## Scripts

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build
- `pnpm start` — production server
- `pnpm typecheck` — TypeScript strict
- `pnpm lint` — ESLint
- `pnpm i18n:lint` — FR/EN message key parity
- `pnpm test` — Vitest (wizard schema tests only)

## Routes

| FR | EN | Description |
|---|---|---|
| `/fr` | `/en` | Home |
| `/fr/a-propos` | `/en/about` | About / Mission / Team / Milestones |
| `/fr/programmes` | `/en/programs` | Programs (Dev / Studio / Mentorship / Community) |
| `/fr/artistes` | `/en/artists` | Artists roster + filter + modal |
| `/fr/evenements` | `/en/events` | Events list (upcoming/past tabs) |
| `/fr/contact` | `/en/contact` | Contact form |
| `/fr/postuler` | `/en/apply` | 5-step artist signup wizard |
| `/fr/postuler/confirmation` | `/en/apply/confirmation` | Submit success |

## Pitch demo flow

1. Land on `/fr` → editorial hero (kinetic headline, Ken Burns portraits, artist marquee)
2. Scroll through Mission → Programs → Artists (play preview audio) → Events → Pull quote → Apply CTA → Newsletter
3. Click `Postuler` → fill 5-step wizard → confirmation
4. Toggle EN in header — content + URL slugs flip
5. Toggle theme (Sun/Moon icon) — palette flips dark ↔ light
6. Open mobile emulator — entire flow re-validates

## Placeholder content notice

All artist names, bios, photos, and audio clips are placeholders. Photos sourced from Unsplash (royalty-free), audio files are empty placeholders (replace before any real demo where audio playback is needed). Replace before production launch.

## Deploy

Vercel-ready. Connect the repo:
- Framework preset: Next.js
- Build command: `pnpm build`
- Output directory: `.next`
- No env vars required.

## Architecture highlights

- **Locale routing**: `next-intl` `pathnames` config maps canonical routes (`/about`) to localized slugs (`/fr/a-propos` ↔ `/en/about`). All `<Link>` components use the typed canonical href and emit the correct slug per locale.
- **Theme**: `next-themes` with `attribute="class"`. `globals.css` defines tokens for default dark + `.light` overrides.
- **Audio player**: Zustand store at `lib/audio/store.ts`. Global sticky `<StickyMiniPlayer />` mounted in the locale layout subscribes; ArtistTile and ArtistModal dispatch `play()` actions.
- **Wizard state**: persisted in `sessionStorage` (`musiqlt.apply.v1`) so refresh resumes at last step. Step routing via `?step=N` query param with full browser back/forward support.
- **Motion gating**: every motion primitive (KenBurnsImage, Marquee, MagneticCTA, LenisProvider, DisplayHeading) honors `prefers-reduced-motion`, disables on touch where appropriate.

## Out of scope (phase 2+)

- Backend (auth, DB, file uploads, email)
- Artist portal post-signup
- CMS for editing artists / programs / events
- Newsletter provider integration
- Real legal copy / consent management
- Analytics + cookie banner
- E2E tests
