import fr from '../messages/fr.json' with { type: 'json' }
import en from '../messages/en.json' with { type: 'json' }

function flatten(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k),
  )
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
