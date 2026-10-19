import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Our type-scale utilities (globals.css) are font-size classes. Without this,
// tailwind-merge reads `text-display-xl` as a colour and drops it when a real
// colour such as `text-white` follows.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-hero', 'display-xl', 'display-l', 'display-m',
            'poster-xl', 'poster-l', 'poster-m',
            'lede', 'mono-meta', 'mono-micro',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
