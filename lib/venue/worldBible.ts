/**
 * World bible + ledgers for the home-page opening: the Night n Key room.
 *
 * World sentence: walk in from the street door, down the aisle between the
 * candlelit tables, and arrive at the stage where the band's instruments wait
 * under warm light, while the same room wakes up (house dims, stage lights rise).
 *
 * Interaction contract: native scroll drives the camera and the room's light;
 * the pointer adds a slight look-around; the NOW PLAYING track makes the stage
 * light breathe with the music. Nothing interactive lives only in 3D.
 *
 * Everything here is data so pacing, framing and light can be tuned without
 * touching the renderer (components/venue/world.ts).
 */

export type Vec3 = [number, number, number]

/** Scale: 1 unit = 1 metre. Human eye height ≈ 1.6. Doors 2.6 m, stage riser 0.6 m. */
export const SCALE = {
  eye: 1.6,
  room: { width: 14, depth: 26, height: 6.2, frontZ: 2.5, backZ: -20 },
  door: { width: 2.0, height: 2.6 },
  stage: { width: 9, depth: 4.4, height: 0.6, centerZ: -17.6 },
} as const

/** Palette roles (the site's black/white/gold, translated to light and surfaces). */
export const PALETTE = {
  void: '#050505', // fog and darkness beyond the light
  floor: '#14100d', // dark stained oak
  wall: '#0d0b0a',
  velvet: '#120d0c', // stage curtain, sheen picks up gold
  lacquer: '#0b0b0b', // drum shells
  bronze: '#b8913f', // cymbals: the gold that catches light
  chrome: '#bdb8ae', // stands and hardware
  practical: '#ffb766', // candles, warm house light
  stageKey: '#ffd9a6', // stage spots, warm white
  gold: '#e2c27a', // sign, stage edge (brand gold)
} as const

/** Motion grammar (see world-bible: keep amplitudes quiet; the room should breathe, not dance). */
export const MOTION = {
  damping: 4.2, // camera/world follow; Lenis already smooths scroll, so keep this calm
  pointerYawDeg: 0.7,
  pointerPitchDeg: 0.45,
  pointerDamping: 3.0,
  dustSpeed: 0.05, // m/s
  candleFlickerHz: 7,
  audioGain: 0.45, // how much the track lifts the stage light
} as const

export type WorldState = {
  key: number // stage spot intensity factor 0..1
  house: number // candles + house light 0..1
  cones: number // visible light shafts 0..1
  edge: number // gold stage-edge strip emissive 0..1
  sign: number // "Night n Key" sign emissive 0..1
  fog: number // FogExp2 density
  exposure: number
}

export type CameraPose = { p: Vec3; t: Vec3; fov: number }

export type Chapter = {
  id: 'threshold' | 'house' | 'stage'
  beat: string
  landmark: string
  change: string
  camera: CameraPose & { mobile: CameraPose }
  world: WorldState
}

/**
 * Chapter ledger. Each chapter is one viewport of scroll over the sticky canvas.
 * Copy lives in messages/*.json (home.hero.*); the DOM blocks are in VenueHero.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: 'threshold',
    beat: 'You arrive at the door; the room is dim, the stage glows at the far end.',
    landmark: 'the doorway framing a distant warm stage and the gold "Night n Key" sign',
    change: 'start: outside, looking in',
    camera: {
      p: [0.35, 1.68, 7.4],
      t: [0, 1.85, -15],
      fov: 40,
      mobile: { p: [0.15, 1.7, 9.4], t: [0, 1.9, -15], fov: 56 },
    },
    world: { key: 0.35, house: 0.8, cones: 0.3, edge: 0.5, sign: 0.6, fog: 0.032, exposure: 1 },
  },
  {
    id: 'house',
    beat: 'Inside: candlelit tables, the room is intimate and close.',
    landmark: 'the aisle between the tables, candles in the foreground, stage ahead',
    change: 'through the door; camera drifts left among the tables, house light peaks',
    camera: {
      p: [-1.7, 1.45, -2.6],
      t: [0.7, 1.5, -16],
      fov: 42,
      mobile: { p: [-0.9, 1.5, -1.2], t: [0.3, 1.5, -16], fov: 54 },
    },
    world: { key: 0.6, house: 1, cones: 0.55, edge: 0.7, sign: 0.85, fog: 0.028, exposure: 1.05 },
  },
  {
    id: 'stage',
    beat: 'The stage: the band is set up, the lights are on. This is where artists are made.',
    landmark: 'drum kit, keys, bass amp and centre mic under the spots',
    change: 'low three-quarter angle at the band; house dims, stage at full',
    camera: {
      p: [1.3, 1.5, -10.8],
      t: [-0.5, 1.15, -17.6],
      fov: 36,
      mobile: { p: [0.6, 1.55, -10.2], t: [-0.2, 1.2, -17.6], fov: 54 },
    },
    world: { key: 1, house: 0.45, cones: 0.95, edge: 0.35, sign: 1, fog: 0.024, exposure: 1.05 },
  },
]

/** Quality tiers (realtime-architecture §12). Downgrade only on sustained misses. */
export const QUALITY = {
  high: { dpr: 1.75, shadows: 1024, dust: 520, antialias: true },
  medium: { dpr: 1.35, shadows: 0, dust: 260, antialias: true },
  low: { dpr: 1.0, shadows: 0, dust: 120, antialias: false },
} as const
export type QualityTier = keyof typeof QUALITY

/** Performance budget for this opening (measured, not assumed; see the PR notes). */
export const BUDGET = {
  drawCallsDesktop: 135,
  drawCallsMobile: 75,
  trianglesDesktop: 850_000,
  trianglesMobile: 240_000,
  downgradeFrameMs: 22,
  downgradeAfterFrames: 120,
} as const
