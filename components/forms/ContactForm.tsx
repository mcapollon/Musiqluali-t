'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/primitives/Button'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(['general', 'apply', 'press', 'partner']),
  message: z.string().min(10),
})
type FormShape = z.infer<typeof schema>

export function ContactForm() {
  const t = useTranslations('contact.form')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormShape>({
    resolver: zodResolver(schema),
    defaultValues: { subject: 'general' },
  })
  return (
    <form
      onSubmit={handleSubmit(async () => {
        await new Promise((r) => setTimeout(r, 500))
        toast.success(t('successToast'))
        reset()
      })}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && (
          <p role="alert" className="text-err text-sm">
            {t('errors.name')}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && (
          <p role="alert" className="text-err text-sm">
            {t('errors.email')}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">{t('subject')}</Label>
        <select
          id="subject"
          {...register('subject')}
          className="bg-[color:var(--color-ink-2)] border border-[color:var(--color-rule)] rounded px-3 h-11"
        >
          <option value="general">{t('subjects.general')}</option>
          <option value="apply">{t('subjects.apply')}</option>
          <option value="press">{t('subjects.press')}</option>
          <option value="partner">{t('subjects.partner')}</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t('message')}</Label>
        <Textarea id="message" rows={6} {...register('message')} aria-invalid={!!errors.message} />
        {errors.message && (
          <p role="alert" className="text-err text-sm">
            {t('errors.message')}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
        {t('submit')}
      </Button>
    </form>
  )
}
