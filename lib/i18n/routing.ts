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
