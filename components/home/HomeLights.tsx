import { useTranslations } from 'next-intl'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'

/**
 * Act X: house lights up. After the credits the room goes white, opening
 * from a thin slit of light (data-lights, scrubbed clip),
 * where the vision is read in daylight, word by word.
 * Ivory lighting (.theme-ivory) remaps gold to a darker gold that holds contrast on white.
 */
export function HomeLights() {
  const t = useTranslations('home')
  return (
    <section id="house-lights" data-act data-lights className="theme-ivory relative">
      <div className="section-pad-x section-pad-y flex min-h-svh flex-col justify-between gap-16">
        <p className="text-mono-meta flex items-baseline gap-4 text-bone-mute">
          <span className="text-gold">X</span>
          <span>{t('acts.lights')}</span>
          <span aria-hidden>·</span>
          <span>{t('lights.eyebrow')}</span>
        </p>
        <div>
          <h2 className="text-mono-meta text-bone-mute">{t('lights.label')}</h2>
          <DisplayHeading
            text={t('lights.vision')}
            emphasis={t('lights.visionEm')}
            size="xl"
            as="p"
            reveal="read"
            className="mt-8 max-w-6xl"
          />
        </div>
        <p data-reveal className="text-lede max-w-2xl text-bone-mute md:ml-auto">
          {t('lights.support')}
        </p>
      </div>
    </section>
  )
}
