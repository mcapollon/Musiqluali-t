import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn', () => {
  it('keeps type-scale utilities alongside text colours', () => {
    expect(cn('text-display-xl', 'text-white')).toBe('text-display-xl text-white')
    expect(cn('text-mono-meta', 'text-gold')).toBe('text-mono-meta text-gold')
  })
  it('still lets a later type-scale utility win', () => {
    expect(cn('text-display-xl', 'text-display-m')).toBe('text-display-m')
  })
})
