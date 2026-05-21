'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { step3 } from '@/lib/validation/wizardSchemas'
import { useWizardStore } from './useWizard'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/primitives/Button'
import { MultiChipSelect } from '@/components/forms/MultiChipSelect'
import { motion } from 'framer-motion'
import type { z } from 'zod'

const INTERESTS = ['Studio', 'Mentorat', 'Scène', 'Distribution', 'Sync', 'Communauté']
type Form = z.infer<typeof step3>

export function Step03Journey() {
  const t = useTranslations('wizard.step03.fields')
  const { data, patch, setStep } = useWizardStore()
  const defaults: Form = {
    yearsActive: data.yearsActive ?? 2,
    currentProject: data.currentProject ?? '',
    motivation: data.motivation ?? '',
    interests: data.interests ?? [],
  }
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(step3),
    defaultValues: defaults,
  })
  const motivation = watch('motivation') ?? ''
  const years = watch('yearsActive') ?? 0

  return (
    <motion.form
      key="step03"
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit((d) => {
        patch(d)
        setStep(4)
      })}
      className="space-y-6 max-w-xl"
      noValidate
    >
      <div>
        <Label>
          {t('yearsActive')}: <span className="font-mono text-saffron">{years}</span>
        </Label>
        <Controller
          control={control}
          name="yearsActive"
          render={({ field }) => (
            <Slider
              min={0}
              max={20}
              step={1}
              value={[field.value ?? 0]}
              onValueChange={(v) => field.onChange(Array.isArray(v) ? v[0] : v)}
            />
          )}
        />
      </div>
      <div>
        <Label htmlFor="currentProject">{t('currentProject')}</Label>
        <Input
          id="currentProject"
          {...register('currentProject')}
          aria-invalid={!!errors.currentProject}
        />
      </div>
      <div>
        <Label htmlFor="motivation">{t('motivation')}</Label>
        <Textarea
          id="motivation"
          rows={5}
          maxLength={300}
          {...register('motivation')}
          aria-invalid={!!errors.motivation}
        />
        <p className="text-mono-meta text-bone-mute mt-1">{motivation.length}/300</p>
      </div>
      <Controller
        control={control}
        name="interests"
        render={({ field }) => (
          <MultiChipSelect
            label={t('interests')}
            options={INTERESTS}
            value={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={() => setStep(2)}>
          ← {t('back')}
        </Button>
        <Button type="submit" variant="primary">
          {t('continue')}
        </Button>
      </div>
    </motion.form>
  )
}
