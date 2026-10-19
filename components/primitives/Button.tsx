'use client'
import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'ghost' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

type Props = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-gold text-ink hover:bg-gold-bright',
  ghost: 'bg-transparent text-bone border border-rule-strong hover:border-gold hover:text-gold-bright',
  quiet: 'bg-transparent text-bone-mute hover:text-bone underline-offset-[6px] decoration-gold hover:underline',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.6875rem]',
  md: 'h-12 px-7 text-xs',
  lg: 'h-14 px-9 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', size = 'md', children, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'inline-flex items-center justify-center gap-3 rounded-none font-sans font-medium uppercase tracking-[0.18em] transition-colors duration-500',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...(rest as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  )
})
