import { describe, it, expect } from 'vitest'
import { step1, step3, step4 } from '../wizardSchemas'

describe('wizard schemas', () => {
  it('step1 rejects weak password', () => {
    const r = step1.safeParse({ firstName: 'Jo', lastName: 'Lee', email: 'a@b.co', password: 'shortpass!!', consent: true })
    expect(r.success).toBe(false)
  })
  it('step1 accepts strong password with number', () => {
    const r = step1.safeParse({ firstName: 'Jo', lastName: 'Lee', email: 'a@b.co', password: 'longenough1', consent: true })
    expect(r.success).toBe(true)
  })
  it('step3 motivation must be 20–300 chars', () => {
    const short = step3.safeParse({ yearsActive: 2, currentProject: 'EP', motivation: 'too short', interests: ['studio'] })
    expect(short.success).toBe(false)
  })
  it('step4 allows empty link strings', () => {
    const r = step4.safeParse({ spotify: '', soundcloud: '', youtube: '', instagram: 'https://instagram.com/x', tiktok: '', audioCount: 0 })
    expect(r.success).toBe(true)
  })
})
