'use client'
import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass'

type Props = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
  variant?: ButtonVariant
  size?: ButtonSize
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
      className={buttonClass({ variant, size, className })}
      {...(rest as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  )
})
