import { useTranslations } from 'next-intl'
import { ChapterMark } from '@/components/editorial/ChapterMark'
import { DisplayHeading } from '@/components/editorial/DisplayHeading'
import { ContactForm } from '@/components/forms/ContactForm'

export function ContactPage() {
  const t = useTranslations('contact')
  return (
    <section className="section-pad-x section-pad-y pt-32 grid md:grid-cols-2 gap-16">
      <div className="space-y-8">
        <ChapterMark number="00" title={t('chapter')} />
        <DisplayHeading text={t('intro')} size="xl" as="h1" />
        <p className="text-bone-mute max-w-md">{t('body')}</p>
        <div className="space-y-2">
          <p>Studio Musiqlt · Montréal QC</p>
          <p>
            <a href="mailto:bonjour@musiqlt.example" className="text-saffron">
              bonjour@musiqlt.example
            </a>
          </p>
        </div>
      </div>
      <ContactForm />
    </section>
  )
}
