import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { ContactForm } from '@/components/forms/ContactForm'

export function ContactPage() {
  const t = useTranslations('contact')
  return (
    <section className="section-pad-x grid gap-16 pt-14 pb-[clamp(4.5rem,11vw,10rem)] md:grid-cols-[1fr_minmax(0,34rem)] md:gap-24 md:pt-24">
      <div className="space-y-10">
        <ChapterMark number="00" title={t('chapter')} as="div" />
        <DisplayHeading text={t('intro')} size="xl" as="h1" />
        <p className="text-lede max-w-md text-bone-mute">{t('body')}</p>
        <div className="space-y-2 border-t border-rule pt-6">
          <p className="text-mono-meta text-gold">Montréal, QC</p>
          {/* TODO: real contact email (placeholder below). */}
          <p>
            <a href="mailto:bonjour@musiqlt.example" className="font-display text-2xl transition-colors hover:text-gold-bright">
              bonjour@musiqlt.example
            </a>
          </p>
        </div>
      </div>
      <div className="frame-invitation p-6 sm:p-10">
        <ContactForm />
      </div>
    </section>
  )
}
