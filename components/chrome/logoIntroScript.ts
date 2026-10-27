// Plain module (not 'use client') so the server layout can inline the string.
import { routing } from '@/lib/i18n/routing'

export const INTRO_STORAGE_KEY = 'mq-intro-seen'

// Home is "/fr" or "/en" (localePrefix: 'always'); the logo opening only exists there.
const HOME = `^/(${routing.locales.join('|')})/?$`

/**
 * Runs in the layout's <head>, before first paint. It lives in the layout,
 * not the page: React never executes a <script> it renders on the client
 * (client navigation), and warns about it.
 * - html[data-motion]: motion allowed, so scroll scenes may paint their opening
 *   frame from CSS (e.g. the spotlight starts small) instead of flashing the
 *   final frame until hydration. MotionProvider keeps it in sync afterwards.
 * - html[data-intro="play"]: the logo opening, home page only, first visit this session.
 */
export const INTRO_SCRIPT = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement.dataset;d.motion='on';if(new RegExp('${HOME}').test(location.pathname)&&!sessionStorage.getItem('${INTRO_STORAGE_KEY}'))d.intro='play'}}catch(e){}`
