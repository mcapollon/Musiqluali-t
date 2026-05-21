import type { MetadataRoute } from 'next'

const ROUTES = [
  { fr: '', en: '' },
  { fr: '/a-propos', en: '/about' },
  { fr: '/programmes', en: '/programs' },
  { fr: '/artistes', en: '/artists' },
  { fr: '/evenements', en: '/events' },
  { fr: '/contact', en: '/contact' },
  { fr: '/postuler', en: '/apply' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://musiqlt.example'
  return ROUTES.flatMap((r) => [
    { url: `${base}/fr${r.fr}`, lastModified: new Date() },
    { url: `${base}/en${r.en}`, lastModified: new Date() },
  ])
}
