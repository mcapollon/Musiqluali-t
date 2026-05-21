'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { step4 } from '@/lib/validation/wizardSchemas'
import { useWizardStore } from './useWizard'
import { LinkInput } from '@/components/forms/LinkInput'
import { DropZone } from '@/components/forms/DropZone'
import { Button } from '@/components/primitives/Button'
import { Music, Link as LinkIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import type { z } from 'zod'

type Form = z.infer<typeof step4>

export function Step04Links() {
  const t = useTranslations('wizard.step04.fields')
  const { data, patch, setStep } = useWizardStore()
  const defaults: Form = {
    spotify: data.spotify ?? '',
    soundcloud: data.soundcloud ?? '',
    youtube: data.youtube ?? '',
    instagram: data.instagram ?? '',
    tiktok: data.tiktok ?? '',
    audioCount: data.audioCount ?? 0,
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(step4),
    defaultValues: defaults,
  })
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [audioCount, setAudioCount] = useState<number>(data.audioCount ?? 0)

  return (
    <motion.form
      key="step04"
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit((d) => {
        patch({ ...d, audioCount })
        setStep(5)
      })}
      className="space-y-6 max-w-xl"
      noValidate
    >
      <LinkInput
        id="spotify"
        label="Spotify"
        icon={<Music className="size-4" />}
        {...register('spotify')}
        error={errors.spotify?.message}
      />
      <LinkInput
        id="soundcloud"
        label="SoundCloud"
        icon={<Music className="size-4" />}
        {...register('soundcloud')}
        error={errors.soundcloud?.message}
      />
      <LinkInput
        id="youtube"
        label="YouTube"
        icon={<LinkIcon className="size-4" />}
        {...register('youtube')}
        error={errors.youtube?.message}
      />
      <LinkInput
        id="instagram"
        label="Instagram"
        icon={<LinkIcon className="size-4" />}
        {...register('instagram')}
        error={errors.instagram?.message}
      />
      <LinkInput
        id="tiktok"
        label="TikTok"
        icon={<LinkIcon className="size-4" />}
        {...register('tiktok')}
        error={errors.tiktok?.message}
      />
      <DropZone
        accept="image/*"
        label={t('photoLabel')}
        maxBytes={5 * 1024 * 1024}
        onPick={(files) => {
          const f = files[0]
          if (f) setPhotoUrl(URL.createObjectURL(f))
        }}
        previewSrc={photoUrl ?? undefined}
      />
      <DropZone
        accept="audio/*"
        multiple
        label={t('audioLabel')}
        onPick={(files) => setAudioCount(Math.min(2, files.length))}
      />
      {audioCount > 0 && (
        <p className="text-mono-meta text-bone-mute">{t('audioCount', { n: audioCount })}</p>
      )}
      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={() => setStep(3)}>
          ← {t('back')}
        </Button>
        <Button type="submit" variant="primary">
          {t('continue')}
        </Button>
      </div>
    </motion.form>
  )
}
