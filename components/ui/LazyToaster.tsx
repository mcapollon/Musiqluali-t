'use client'
import dynamic from 'next/dynamic'

// Toasts are rare (form confirmations), so the library loads after the page
// is interactive instead of in the critical bundle.
export const LazyToaster = dynamic(() => import('./sonner').then((m) => m.Toaster), { ssr: false })
