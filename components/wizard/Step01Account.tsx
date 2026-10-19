'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { step1 } from '@/lib/validation/wizardSchemas'
import { useWizardStore } from './useWizard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/primitives/Button'
import { PasswordStrengthMeter } from '@/components/forms/PasswordStrengthMeter'
import { motion } from 'framer-motion'
import type { z } from 'zod'

type Form = z.infer<typeof step1>

export function Step01Account() {
  const t = useTranslations('wizard.step01.fields')
  const { data, patch, setStep } = useWizardStore()
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(step1),
    defaultValues: (data as Partial<Form>) ?? {},
  })
  const pwd = watch('password') ?? ''

  return (
    <motion.form
      key="step01"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit((d) => {
        patch(d)
        setStep(2)
      })}
      className="max-w-xl space-y-8"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{t('firstName')}</Label>
          <Input id="firstName" {...register('firstName')} aria-invalid={!!errors.firstName} />
        </div>
        <div>
          <Label htmlFor="lastName">{t('lastName')}</Label>
          <Input id="lastName" {...register('lastName')} aria-invalid={!!errors.lastName} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p role="alert" className="text-err text-sm mt-1">{t('email_error')}</p>}
      </div>
      <div>
        <Label htmlFor="password">{t('password')}</Label>
        <Input id="password" type="password" {...register('password')} aria-invalid={!!errors.password} />
        <PasswordStrengthMeter value={pwd} />
        {errors.password && <p role="alert" className="text-err text-sm mt-1">{t('password_error')}</p>}
      </div>
      <label className="flex items-start gap-3">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(!!v)} />
          )}
        />
        <span className="text-sm text-bone-mute">{t('consent')}</span>
      </label>
      {errors.consent && <p role="alert" className="text-err text-sm">{t('consent_error')}</p>}
      <Button type="submit" variant="primary" size="lg">{t('continue')}</Button>
    </motion.form>
  )
}
