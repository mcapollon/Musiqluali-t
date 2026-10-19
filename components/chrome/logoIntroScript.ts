// Plain module (not 'use client') so the server page can inline the string.
export const INTRO_STORAGE_KEY = 'mq-intro-seen'

/** Runs before first paint: opt into the logo opening only on a first visit with motion allowed. */
export const INTRO_SCRIPT = `try{if(!sessionStorage.getItem('${INTRO_STORAGE_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='play'}}catch(e){}`
