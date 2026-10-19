import { notFound } from 'next/navigation'

// Unknown paths under a locale (e.g. /fr/nope) render the localized, branded
// [locale]/not-found instead of Next's bare default. Real routes always win
// over this catch-all.
export default function CatchAll() {
  notFound()
}
