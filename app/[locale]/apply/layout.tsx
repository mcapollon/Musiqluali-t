'use client'
import { usePathname } from 'next/navigation'
import { WizardShell } from '@/components/wizard/WizardShell'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.endsWith('/confirmation')) return <>{children}</>
  return <WizardShell>{children}</WizardShell>
}
