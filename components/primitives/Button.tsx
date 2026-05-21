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
  primary: 'bg-saffron text-ink hover:bg-saffron-deep',
  ghost: 'bg-transparent text-bone border border-[color:var(--color-rule)] hover:border-saffron hover:text-saffron',
  quiet: 'bg-transparent text-bone-mute hover:text-bone',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
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
        'inline-flex items-center justify-center rounded-[var(--radius-pill)] font-sans font-medium transition-colors',
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
