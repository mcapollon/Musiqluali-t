/**
 * Lifts its content into place once, when scrolled into view. Markup only:
 * the motion system (components/motion/motionSystem.ts) animates
 * [data-reveal]; without JS or with reduced motion it simply renders.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  preset = 'fade-up',
  className,
}: {
  children: React.ReactNode
  delay?: number
  preset?: 'fade-up' | 'blur-in' | 'scale'
  className?: string
}) {
  return (
    <div data-reveal={preset} data-reveal-delay={delay || undefined} className={className}>
      {children}
    </div>
  )
}
