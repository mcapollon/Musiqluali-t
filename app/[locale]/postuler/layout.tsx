import { WizardShell } from '@/components/wizard/WizardShell'
export default function Layout({ children }: { children: React.ReactNode }) {
  return <WizardShell>{children}</WizardShell>
}
