import { describe, it, expect } from 'vitest'
import { CHAPTERS, SCALE, type CameraPose } from '../worldBible'

const poses = CHAPTERS.flatMap((c) => [
  { id: c.id, view: 'desktop', pose: c.camera as CameraPose },
  { id: c.id, view: 'mobile', pose: c.camera.mobile },
])

describe('venue chapter ledger', () => {
  it('walks door → house → stage in order', () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual(['threshold', 'house', 'stage'])
  })

  it.each(poses)('$id ($view) camera stands at eye height inside the building', ({ pose }) => {
    const [x, y, z] = pose.p
    const R = SCALE.room
    expect(Math.abs(x)).toBeLessThan(R.width / 2 - 0.5)
    expect(y).toBeGreaterThan(1)
    expect(y).toBeLessThan(2)
    // the threshold camera is outside the door, in the vestibule (8 m deep)
    expect(z).toBeLessThan(R.frontZ + 8)
    // never inside the stage riser
    expect(z).toBeGreaterThan(SCALE.stage.centerZ + SCALE.stage.depth / 2)
  })

  it.each(poses)('$id ($view) looks toward the stage', ({ pose }) => {
    expect(pose.t[2]).toBeLessThan(pose.p[2])
    expect(pose.fov).toBeGreaterThanOrEqual(30)
    expect(pose.fov).toBeLessThanOrEqual(60)
  })

  it('wakes the stage as you arrive: key light rises chapter by chapter', () => {
    const keys = CHAPTERS.map((c) => c.world.key)
    expect([...keys].sort((a, b) => a - b)).toEqual(keys)
    expect(keys.at(-1)).toBe(1)
  })
})
