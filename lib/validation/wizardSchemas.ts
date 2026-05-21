import { z } from 'zod'

export const step1 = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10).regex(/\d/, 'must include a number'),
  consent: z.literal(true),
})

export const step2 = z.object({
  stageName: z.string().min(2),
  pronouns: z.string().min(1),
  city: z.string().min(2),
  languages: z.array(z.string()).min(1),
  genres: z.array(z.string()).min(1),
})

export const step3 = z.object({
  yearsActive: z.number().min(0).max(40),
  currentProject: z.string().min(2),
  motivation: z.string().min(20).max(300),
  interests: z.array(z.string()).min(1),
})

const urlOrEmpty = z.union([z.literal(''), z.string().url()])
export const step4 = z.object({
  spotify: urlOrEmpty,
  soundcloud: urlOrEmpty,
  youtube: urlOrEmpty,
  instagram: urlOrEmpty,
  tiktok: urlOrEmpty,
  photoName: z.string().optional(),
  audioCount: z.number().min(0).max(2),
})

export const step5 = z.object({
  finalConsent: z.literal(true),
})

export const wizard = step1.merge(step2).merge(step3).merge(step4).merge(step5)
export type WizardData = z.infer<typeof wizard>
