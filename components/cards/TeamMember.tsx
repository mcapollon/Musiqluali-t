'use client'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import type { TeamItem } from '@/lib/mock/team'

export function TeamMember({ member }: { member: TeamItem }) {
  const [open, setOpen] = useState(false)
  const locale = useLocale() as 'fr' | 'en'
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="block w-full text-left"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-md">
          <Image src={member.photo} alt={member.name} fill sizes="33vw" className="object-cover" />
        </div>
        <p className="font-display text-xl mt-3">{member.name}</p>
        <p className="text-mono-meta text-bone-mute">{locale === 'fr' ? member.roleFr : member.roleEn}</p>
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-bone-mute overflow-hidden"
          >
            {locale === 'fr' ? member.bioFr : member.bioEn}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
