'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { WizardData } from '@/lib/validation/wizardSchemas'

type State = {
  step: number
  data: Partial<WizardData>
  setStep: (n: number) => void
  patch: (data: Partial<WizardData>) => void
  reset: () => void
}

export const useWizardStore = create<State>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      setStep: (n) => set({ step: n }),
      patch: (d) => set((s) => ({ data: { ...s.data, ...d } })),
      reset: () => set({ step: 1, data: {} }),
    }),
    { name: 'musiqlt.apply.v1', storage: createJSONStorage(() => sessionStorage) },
  ),
)
