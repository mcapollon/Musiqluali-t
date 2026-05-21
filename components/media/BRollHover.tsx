'use client'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  still: string
  loop?: string
  alt: string
  className?: string
  sizes?: string
}

export function BRollHover({ still, loop, alt, className, sizes = '50vw' }: Props) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn('relative overflow-hidden', className)}
    >
      <Image src={still} alt={alt} fill sizes={sizes} className={cn('object-cover transition-opacity duration-300', hover && loop ? 'opacity-0' : 'opacity-100')} />
      {loop && (
        <video
          src={loop}
          muted
          loop
          playsInline
          autoPlay
          className={cn('absolute inset-0 size-full object-cover transition-opacity duration-300', hover ? 'opacity-100' : 'opacity-0')}
        />
      )}
    </div>
  )
}
