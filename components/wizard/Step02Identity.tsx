'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { step2 } from '@/lib/validation/wizardSchemas'
import { useWizardStore } from './useWizard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/primitives/Button'
import { MultiChipSelect } from '@/components/forms/MultiChipSelect'
import { motion } from 'framer-motion'
import type { z } from 'zod'

const GENRES = ['Hip-Hop', 'R&B', 'Afrobeats', 'Soul', 'Jazz', 'Électro', 'Pop', 'Autre']
const LANGS = ['FR', 'EN', 'ES', 'Autre']

type Form = z.infer<typeof step2>

export function Step02Identity() {
  const t = useTranslations('wizard.step02.fields')
  const { data, patch, setStep } = useWizardStore()
  const defaults: Form = {
    stageName: data.stageName ?? '',
    pronouns: data.pronouns ?? '',
    city: data.city ?? 'Montréal',
    languages: data.languages ?? ['FR'],
    genres: data.genres ?? [],
  }
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(step2),
    defaultValues: defaults,
  })

  return (
    <motion.form
      key="step02"
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit((d) => {
        patch(d)
        setStep(3)
      })}
      className="space-y-6 max-w-xl"
      noValidate
    >
      <div>
        <Label htmlFor="stageName">{t('stageName')}</Label>
        <Input id="stageName" {...register('stageName')} aria-invalid={!!errors.stageName} />
      </div>
      <div>
        <Label htmlFor="pronouns">{t('pronouns')}</Label>
        <Input
          id="pronouns"
          placeholder={t('pronouns_placeholder')}
          {...register('pronouns')}
          aria-invalid={!!errors.pronouns}
        />
      </div>
      <div>
        <Label htmlFor="city">{t('city')}</Label>
        <Input id="city" {...register('city')} aria-invalid={!!errors.city} />
      </div>
      <Controller
        control={control}
        name="languages"
        render={({ field }) => (
          <MultiChipSelect
            label={t('languages')}
            options={LANGS}
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="genres"
        render={({ field }) => (
          <MultiChipSelect
            label={t('genres')}
            options={GENRES}
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={() => setStep(1)}>
          ← {t('back')}
        </Button>
        <Button type="submit" variant="primary">
          {t('continue')}
        </Button>
      </div>
    </motion.form>
  )
}
