'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/lib/i18n/navigation'
import { motion } from 'framer-motion'
import { useWizardStore } from './useWizard'
import { ReviewSummaryCard } from './ReviewSummaryCard'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/primitives/Button'
import { generateDossier } from '@/lib/utils/randomDossier'

export function Step05Review() {
  const t = useTranslations('wizard.step05')
  const { data, setStep, reset } = useWizardStore()
  const [agree, setAgree] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const submit = async () => {
    setSubmitting(true)
    const dossier = generateDossier()
    sessionStorage.setItem('musiqlt.dossier', dossier)
    await new Promise((r) => setTimeout(r, 800))
    reset()
    router.push('/apply/confirmation')
  }

  return (
    <motion.div
      key="step05"
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 max-w-xl"
    >
      <ReviewSummaryCard
        title={t('summary.account')}
        gotoStep={1}
        items={[
          {
            label: t('fields.name'),
            value: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
          },
          { label: t('fields.email'), value: data.email ?? '' },
        ]}
      />
      <ReviewSummaryCard
        title={t('summary.identity')}
        gotoStep={2}
        items={[
          { label: t('fields.stageName'), value: data.stageName ?? '' },
          { label: t('fields.city'), value: data.city ?? '' },
          { label: t('fields.genres'), value: (data.genres ?? []).join(', ') },
        ]}
      />
      <ReviewSummaryCard
        title={t('summary.journey')}
        gotoStep={3}
        items={[
          { label: t('fields.yearsActive'), value: String(data.yearsActive ?? '—') },
          { label: t('fields.currentProject'), value: data.currentProject ?? '' },
          { label: t('fields.interests'), value: (data.interests ?? []).join(', ') },
        ]}
      />
      <ReviewSummaryCard
        title={t('summary.links')}
        gotoStep={4}
        items={[
          { label: 'Spotify', value: data.spotify ?? '' },
          { label: 'SoundCloud', value: data.soundcloud ?? '' },
          { label: 'Instagram', value: data.instagram ?? '' },
        ]}
      />
      <label className="flex items-start gap-3">
        <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
        <span className="text-sm text-bone-mute">{t('finalConsent')}</span>
      </label>
      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={() => setStep(4)}>
          ← {t('back')}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!agree || submitting}
          onClick={submit}
        >
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </div>
    </motion.div>
  )
}
