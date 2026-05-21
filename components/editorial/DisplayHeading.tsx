'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils/cn'

type Props = {
  text: string
  size?: 'xl' | 'l' | 'm'
  className?: string
  as?: 'h1' | 'h2' | 'p'
}

const sizeCls = { xl: 'text-display-xl', l: 'text-display-l', m: 'text-display-m' } as const

export function DisplayHeading({ text, size = 'l', className, as: As = 'h2' }: Props) {
  const reduced = useReducedMotion()
  if (reduced) {
    return <As className={cn(sizeCls[size], className)}>{text}</As>
  }
  const MotionTag = motion[As] as typeof motion.h2
  return (
    <MotionTag
      className={cn(sizeCls[size], className)}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </MotionTag>
  )
}
