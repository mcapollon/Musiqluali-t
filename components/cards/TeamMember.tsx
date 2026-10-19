'use client'
import Image from 'next/image'
import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import type { TeamItem } from '@/lib/mock/team'

export function TeamMember({ member }: { member: TeamItem }) {
  const [open, setOpen] = useState(false)
  const locale = useLocale() as 'fr' | 'en'
  const bioId = useId()
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bioId}
        className="group block w-full text-left"
      >
        <div className="grade-portrait relative aspect-[3/4]">
          {/* PLACEHOLDER image (Unsplash). */}
          <Image src={member.photo} alt="" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
        </div>
        <p className="text-display-m mt-5 transition-colors duration-500 group-hover:text-gold-bright">{member.name}</p>
        <p className="text-mono-micro mt-2 text-gold">{locale === 'fr' ? member.roleFr : member.roleEn}</p>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            id={bioId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-bone-mute"
          >
            {locale === 'fr' ? member.bioFr : member.bioEn}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
