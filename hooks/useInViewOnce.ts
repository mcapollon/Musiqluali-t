'use client'
import { useEffect, useRef, useState } from 'react'

/** True once the element has scrolled into view (then stops observing). */
export function useInViewOnce<T extends Element>(amount = 0.3) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: amount },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount, inView])

  return [ref, inView] as const
}
