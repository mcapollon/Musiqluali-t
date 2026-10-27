/**
 * The Night n Key room: one persistent Three.js world for the home-page opening.
 * Architecture and the band's instruments are modelled in code (props.ts);
 * furniture, chandeliers and surface textures are CC0 assets from Poly Haven
 * (public/venue/assets, see CREDITS.md). If an asset fails to load, the room
 * falls back to simple forms rather than failing.
 *
 * Scene graph (realtime-architecture §2):
 *   world
 *     environment   floor, walls, ceiling, entrance, slats
 *     landmarks     stage, proscenium + sign, curtain, truss
 *     chapterSets   house (tables, chairs, candles) · band (instruments)
 *     atmosphere    light shafts, dust, candle glows
 *   cameraRig > pathRig (authored) > inputRig (pointer) > camera
 *
 * Update order per frame (§7): exact/smooth progress (conductor) → camera +
 * world state → ambient (time) → render → performance sample.
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { comboAmp, drumKit, grandPiano, uprightBass, vocalMic, type PropMaterials } from './props'
import { BUDGET, CHAPTERS, MOTION, PALETTE, QUALITY, SCALE, type QualityTier, type Vec3, type WorldState } from '@/lib/venue/worldBible'

export type VenueWorld = {
  frame(smooth: number, dt: number, ambient: boolean): void
  setPointer(nx: number, ny: number): void
  setAudioLevel(level: number): void
  resize(width: number, height: number): void
  needsFrame(): boolean
  info(): { calls: number; triangles: number; tier: QualityTier; dpr: number }
  /** QA only (?venue-debug): pin the camera to an arbitrary pose; null returns to the path. */
  debugView(pose: { p: Vec3; t: Vec3; fov: number } | null): void
  dispose(): void
}

const v3 = (a: Vec3) => new THREE.Vector3(a[0], a[1], a[2])
const smoothstep = (x: number) => x * x * (3 - 2 * x)

/** Seeded RNG so the room (planks, dust) is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Give the main thread back between build phases so no single task blocks input for long. */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

// ---------------------------------------------------------------- textures

// Canvas textures are drawn at a size per tier (k = 1 or 0.5): uploads are a
// visible share of the boot cost on phones.

function plankTexture(k: number): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  const size = 1024 * k
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.scale(k, k) // draw in 1024-space
  const r = rng(7)
  const plankW = 1024 / 8
  for (let i = 0; i < 8; i++) {
    let y = -r() * 400
    while (y < 1024) {
      const len = 300 + r() * 500
      const l = 12 + r() * 6 // dark stained oak, small tonal variation
      g.fillStyle = `hsl(24 30% ${l}%)`
      g.fillRect(i * plankW, y, plankW, len)
      g.strokeStyle = 'rgba(0,0,0,0.55)'
      g.lineWidth = 3
      g.strokeRect(i * plankW + 1.5, y, plankW - 3, len)
      for (let k = 0; k < 9; k++) {
        g.strokeStyle = `rgba(255,220,180,${0.015 + r() * 0.03})`
        g.lineWidth = 1
        const x = i * plankW + 8 + r() * (plankW - 16)
        g.beginPath()
        g.moveTo(x, y)
        g.bezierCurveTo(x + r() * 6 - 3, y + len * 0.3, x + r() * 6 - 3, y + len * 0.7, x, y + len)
        g.stroke()
      }
      y += len
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(3.5, 7)
  t.anisotropy = 4 // the floor is seen at a grazing angle
  return t
}

function signTexture(k: number): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 2048 * k
  c.height = 320 * k
  const g = c.getContext('2d')!
  g.scale(k, k) // draw in 2048-space
  g.fillStyle = '#ffffff'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = '500 210px Satoshi, "Satoshi Fallback", Arial, sans-serif'
  // a soft wide halo under crisp letters: the glow of gilt under light, without a bloom pass
  g.shadowColor = 'rgba(255, 236, 200, 0.85)'
  g.shadowBlur = 46
  g.globalAlpha = 0.55
  g.fillText('Night n Key', 1024, 168)
  g.shadowBlur = 0
  g.globalAlpha = 1
  g.fillText('Night n Key', 1024, 168)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ---------------------------------------------------------------- shaders

const coneMaterial = (color: THREE.Color, len: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color }, uOpacity: { value: 0.5 }, uTime: { value: 0 }, uLen: { value: len } },
    vertexShader: /* glsl */ `
      uniform float uLen;
      varying float vAlong;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vAlong = clamp(-position.y / uLen, 0.0, 1.0); // 0 at the lamp, 1 at the base
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying float vAlong;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float facing = abs(dot(vN, vV));
        float core = pow(facing, 2.2);              // soft edges, denser centre
        float fall = 1.0 - smoothstep(0.0, 1.0, vAlong) * 0.82; // brighter at the lamp
        float breathe = 0.96 + 0.04 * sin(uTime * 0.7 + vAlong * 3.0);
        float a = uOpacity * core * fall * breathe * 0.32;
        gl_FragColor = vec4(uColor * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })

const glowMaterial = (color: THREE.Color, size: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color }, uTime: { value: 0 }, uSize: { value: size }, uIntensity: { value: 1 }, uPx: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uSize;
      uniform float uPx;
      varying float vFlicker;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vFlicker = 0.82 + 0.18 * sin(uTime * ${MOTION.candleFlickerHz.toFixed(1)} + aSeed * 31.0) * sin(uTime * 2.3 + aSeed * 7.0);
        gl_PointSize = uSize * uPx * (300.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying float vFlicker;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = pow(max(0.0, 1.0 - d), 2.4) * uIntensity * vFlicker;
        gl_FragColor = vec4(uColor * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

const dustMaterial = (color: THREE.Color) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color }, uTime: { value: 0 }, uIntensity: { value: 1 }, uPx: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uPx;
      varying float vA;
      void main() {
        vec3 p = position;
        p.y = 0.6 + mod(p.y - 0.6 + uTime * ${MOTION.dustSpeed.toFixed(3)} * (0.5 + aSeed), 4.6);
        p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.15;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vA = 0.35 + 0.65 * sin(uTime * 0.6 + aSeed * 90.0) * 0.5 + 0.5;
        gl_PointSize = (1.2 + aSeed * 1.6) * uPx * (12.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - smoothstep(0.2, 1.0, d)) * vA * uIntensity * 0.5;
        gl_FragColor = vec4(uColor * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

// ---------------------------------------------------------------- assets

const ASSETS = '/venue/assets/'

type Assets = {
  table: THREE.Mesh | null
  chair: THREE.Mesh | null
  chandelier: THREE.Mesh[]
  parquet: { map: THREE.Texture; normal: THREE.Texture; rough: THREE.Texture } | null
  velvet: { normal: THREE.Texture; rough: THREE.Texture } | null
  plaster: { normal: THREE.Texture; rough: THREE.Texture } | null
}

/** Meshes of a glTF scene, with their node transforms up to date. */
function meshesOf(scene: THREE.Object3D) {
  scene.updateMatrixWorld(true)
  const out: THREE.Mesh[] = []
  scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) out.push(o as THREE.Mesh)
  })
  return out
}

async function loadAssets(anisotropy: number, small: boolean): Promise<Assets> {
  const gltf = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const model = (name: string) => gltf.loadAsync(ASSETS + name).then((g) => meshesOf(g.scene)).catch(() => [] as THREE.Mesh[])
  // Decode off the main thread (ImageBitmap) where supported: decoding <img>
  // textures at upload time was the single biggest boot cost on phones.
  const bitmaps = typeof createImageBitmap === 'function'
  const bitmapLoader = new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'flipY' })
  const imageLoader = new THREE.TextureLoader()
  const map = async (name: string, srgb = false) => {
    let t: THREE.Texture
    if (bitmaps) {
      t = new THREE.Texture(await bitmapLoader.loadAsync(ASSETS + name))
      t.flipY = false // already flipped during decode
      t.needsUpdate = true
    } else {
      t = await imageLoader.loadAsync(ASSETS + name)
    }
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = anisotropy
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  const pq = small ? '_512' : ''
  const [table, chair, chandelier, parquet, velvet, plaster] = await Promise.all([
    model('round_wooden_table_01.glb'),
    model('dining_chair_02.glb'),
    model('Chandelier_01.glb'),
    Promise.all([map(`parquet_diff${pq}.webp`, true), map(`parquet_nor${pq}.webp`), map(`parquet_rough${pq}.webp`)])
      .then(([m, n, r]) => ({ map: m, normal: n, rough: r }))
      .catch(() => null),
    Promise.all([map('velvet_nor.webp'), map('velvet_rough.webp')])
      .then(([n, r]) => ({ normal: n, rough: r }))
      .catch(() => null),
    Promise.all([map('plaster_nor.webp'), map('plaster_rough.webp')])
      .then(([n, r]) => ({ normal: n, rough: r }))
      .catch(() => null),
  ])
  return { table: table[0] ?? null, chair: chair[0] ?? null, chandelier, parquet, velvet, plaster }
}

/**
 * A tiny painted cube of the room as gloss sees it: dark, with the warm lamp rig
 * overhead, the gold curtain toward the stage and candle points toward the house.
 * Phong materials use it directly, so lacquer and metal reflect the room without
 * a PMREM prefilter (which cost ~0.8 s of main thread).
 */
function roomReflections(): THREE.CubeTexture {
  const face = (paint: (g: CanvasRenderingContext2D) => void) => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')!
    g.fillStyle = '#070605'
    g.fillRect(0, 0, 64, 64)
    paint(g)
    return c
  }
  const dot = (g: CanvasRenderingContext2D, x: number, y: number, r: number, a: number) => {
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, `rgba(255, 214, 160, ${a})`)
    grd.addColorStop(1, 'rgba(255, 214, 160, 0)')
    g.fillStyle = grd
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }
  const band = (g: CanvasRenderingContext2D, y0: number, y1: number, a: number) => {
    const grd = g.createLinearGradient(0, y0, 0, y1)
    grd.addColorStop(0, 'rgba(226, 178, 102, 0)')
    grd.addColorStop(0.5, `rgba(226, 178, 102, ${a})`)
    grd.addColorStop(1, 'rgba(226, 178, 102, 0)')
    g.fillStyle = grd
    g.fillRect(0, y0, 64, y1 - y0)
  }
  const side = face((g) => [14, 32, 50].forEach((x) => dot(g, x, 30, 6, 0.5)))
  const cube = new THREE.CubeTexture([
    side, // +x
    side, // -x
    face((g) => [16, 32, 48].forEach((x) => dot(g, x, 40, 9, 0.95))), // +y: the lamp rig
    face((g) => band(g, 0, 64, 0.4)), // -y: the lit stage floor (what a raised piano lid reflects)
    face((g) => [8, 20, 32, 44, 56].forEach((x) => dot(g, x, 40, 4, 0.6))), // +z: candles in the house
    face((g) => band(g, 18, 58, 0.55)), // -z: the gold curtain
  ])
  cube.colorSpace = THREE.SRGBColorSpace
  cube.needsUpdate = true
  return cube
}

/** Soft radial falloff for the light pools sconces throw on the walls. */
function poolTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(64, 52, 2, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/** InstancedMesh of a glTF mesh: each instance = placement × the node's own transform. */
function instanceOf(src: THREE.Mesh, placements: THREE.Matrix4[], mat?: THREE.Material) {
  const im = new THREE.InstancedMesh(src.geometry, mat ?? (src.material as THREE.Material), placements.length)
  const m = new THREE.Matrix4()
  placements.forEach((p, i) => im.setMatrixAt(i, m.multiplyMatrices(p, src.matrixWorld)))
  im.computeBoundingSphere()
  return im
}

// ---------------------------------------------------------------- world

export async function createVenueWorld(
  canvas: HTMLCanvasElement,
  opts: { mobile: boolean; tier: QualityTier },
): Promise<VenueWorld> {
  let tier: QualityTier = opts.tier
  let quality = QUALITY[tier]

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: quality.antialias, alpha: false, powerPreference: 'high-performance' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr))
  renderer.shadowMap.enabled = quality.shadows > 0
  renderer.shadowMap.type = THREE.PCFShadowMap

  const assetsReady = loadAssets(tier === 'high' ? 8 : 4, tier !== 'high') // in flight while the room is built

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(PALETTE.void)
  scene.fog = new THREE.FogExp2(PALETTE.void, CHAPTERS[0]!.world.fog)

  // No environment map: prefiltering one (PMREM) cost ~0.8 s of main thread on
  // desktop. Metals read from the real spots' highlights instead, and keep a
  // touch of diffuse (metalness < 1) so stands never go black.
  await yieldToMain()

  const world = new THREE.Group()
  world.name = 'world'
  const environment = new THREE.Group()
  environment.name = 'environment'
  const landmarks = new THREE.Group()
  landmarks.name = 'landmarks'
  const house = new THREE.Group()
  house.name = 'chapter-house'
  const band = new THREE.Group()
  band.name = 'chapter-band'
  const atmosphere = new THREE.Group()
  atmosphere.name = 'atmosphere'
  world.add(environment, landmarks, house, band, atmosphere)
  scene.add(world)

  // ---- materials (one instance per family; disposed once at teardown)
  const gold = new THREE.Color(PALETTE.gold)
  const tex = tier === 'high' ? 1 : 0.5
  const env = roomReflections()
  const gloss = (color: string, specular: string, shininess: number, reflectivity: number) =>
    new THREE.MeshPhongMaterial({ color, specular, shininess, envMap: env, combine: THREE.MixOperation, reflectivity })
  const M = {
    floor: new THREE.MeshStandardMaterial({ color: '#2a1d14', roughness: 0.6, metalness: 0 }),
    wall: new THREE.MeshStandardMaterial({ color: PALETTE.wall, roughness: 0.95 }),
    slat: new THREE.MeshStandardMaterial({ color: '#1c1511', roughness: 0.62 }),
    velvet: new THREE.MeshPhysicalMaterial({ color: PALETTE.velvet, roughness: 0.88, sheen: 1, sheenRoughness: 0.42, sheenColor: gold }),
    riser: new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.55 }),
    edge: new THREE.MeshBasicMaterial({ color: gold.clone(), toneMapped: false }),
    lacquer: gloss(PALETTE.lacquer, '#d8ccb8', 90, 0.3),
    bronze: gloss('#5e4318', '#ffd58a', 55, 0.4),
    chrome: gloss('#2b2926', '#f2ece2', 110, 0.5),
    tolex: new THREE.MeshStandardMaterial({ color: '#141313', roughness: 0.95 }),
    grille: new THREE.MeshStandardMaterial({ color: '#211f1c', roughness: 1 }),
    ebony: new THREE.MeshStandardMaterial({ color: '#0d0c0b', roughness: 0.55 }),
    ivory: new THREE.MeshStandardMaterial({ color: '#ece6d8', roughness: 0.45 }),
    goldLeaf: gloss('#7d5e25', '#ffe0a0', 70, 0.42),
    wood: gloss('#1c0c05', '#5a4030', 30, 0.1),
    spruce: new THREE.MeshStandardMaterial({ color: '#6e4e2e', roughness: 0.7 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9 }),
    votive: new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.practical).multiplyScalar(0.9), toneMapped: false, transparent: true, opacity: 0.85 }),
    shade: new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.practical), toneMapped: false }),
    pool: new THREE.MeshBasicMaterial({ map: poolTexture(), color: new THREE.Color(PALETTE.practical), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    table: new THREE.MeshStandardMaterial({ color: '#17120e', roughness: 0.4 }),
    lens: new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.stageKey), toneMapped: false }),
    sign: new THREE.MeshBasicMaterial({ map: signTexture(tex), color: gold.clone(), transparent: true, toneMapped: false, depthWrite: false }),
    rig: new THREE.MeshStandardMaterial({ color: '#141414', metalness: 0.7, roughness: 0.5 }),
  }

  const shadows = quality.shadows > 0
  function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, pos: Vec3, parent: THREE.Object3D, o: { rot?: Vec3; cast?: boolean; receive?: boolean } = {}) {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(...pos)
    if (o.rot) m.rotation.set(...o.rot)
    m.castShadow = Boolean(o.cast && shadows)
    m.receiveShadow = Boolean(o.receive && shadows)
    parent.add(m)
    return m
  }
  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)
  const cyl = (rt: number, rb: number, h: number, seg = 32) => new THREE.CylinderGeometry(rt, rb, h, seg)

  // ---- environment: room shell, entrance, vestibule, slats
  const R = SCALE.room
  const floorDepth = 32
  mesh(new THREE.PlaneGeometry(R.width, floorDepth), M.floor, [0, 0, -4.5], environment, { rot: [-Math.PI / 2, 0, 0], receive: true })
  mesh(new THREE.PlaneGeometry(R.width, floorDepth), M.wall, [0, R.height, -4.5], environment, { rot: [Math.PI / 2, 0, 0] })
  const sideDepth = R.frontZ - R.backZ
  for (const s of [-1, 1]) {
    mesh(new THREE.PlaneGeometry(sideDepth, R.height), M.wall, [s * R.width / 2, R.height / 2, (R.frontZ + R.backZ) / 2], environment, { rot: [0, -s * Math.PI / 2, 0] })
  }
  mesh(new THREE.PlaneGeometry(R.width, R.height), M.wall, [0, R.height / 2, R.backZ], environment)
  // Entrance wall with a doorway, then a short, low vestibule outside it.
  const D = SCALE.door
  const sideW = (R.width - D.width) / 2
  for (const s of [-1, 1]) mesh(box(sideW, R.height, 0.3), M.wall, [s * (D.width / 2 + sideW / 2), R.height / 2, R.frontZ], environment, { receive: true })
  mesh(box(D.width, R.height - D.height, 0.3), M.wall, [0, D.height + (R.height - D.height) / 2, R.frontZ], environment)
  for (const s of [-1, 1]) {
    // brass door casing catching the light from inside
    mesh(box(0.04, D.height, 0.34), M.bronze, [s * (D.width / 2 + 0.02), D.height / 2, R.frontZ], environment)
    // door leaves swung inward, lacquered, brass push plates
    const leaf = new THREE.Group()
    leaf.position.set(s * D.width / 2, 0, R.frontZ - 0.15)
    leaf.rotation.y = s * -1.2
    mesh(box(0.96, D.height - 0.04, 0.05), M.lacquer, [-s * 0.48, (D.height - 0.04) / 2, 0], leaf, { cast: true })
    mesh(box(0.06, 0.32, 0.02), M.bronze, [-s * 0.82, 1.1, -0.04], leaf)
    environment.add(leaf)
  }
  mesh(box(D.width, 0.04, 0.34), M.bronze, [0, D.height + 0.02, R.frontZ], environment)
  // the light line under the threshold: the room is lit, you are outside
  mesh(box(D.width - 0.1, 0.006, 0.05), M.edge, [0, 0.004, R.frontZ - 0.12], environment)
  for (const s of [-1, 1]) mesh(box(0.2, 3.2, 8), M.wall, [s * 2.4, 1.6, R.frontZ + 4.15], environment, { receive: true })
  mesh(box(5, 0.2, 8), M.wall, [0, 3.3, R.frontZ + 4.15], environment)

  // acoustic slats along both side walls (one instanced draw call)
  const slatZ: number[] = []
  for (let z = R.frontZ - 1.2; z > R.backZ + 1; z -= 0.34) slatZ.push(z)
  const slats = new THREE.InstancedMesh(box(0.05, 4.6, 0.09), M.slat, slatZ.length * 2)
  const dummy = new THREE.Object3D()
  slatZ.forEach((z, i) => {
    for (const [j, s] of [-1, 1].entries()) {
      dummy.position.set(s * (R.width / 2 - 0.06), 2.6, z)
      dummy.updateMatrix()
      slats.setMatrixAt(i * 2 + j, dummy.matrix)
    }
  })
  slats.receiveShadow = shadows
  environment.add(slats)

  await yieldToMain()
  // ---- landmarks: stage, proscenium + sign, curtain, truss
  const S = SCALE.stage
  const stageFront = S.centerZ + S.depth / 2
  mesh(box(S.width, S.height, S.depth), M.riser, [0, S.height / 2, S.centerZ], landmarks, { receive: true })
  mesh(box(S.width, 0.014, 0.022), M.edge, [0, S.height, stageFront + 0.005], landmarks) // gold stage edge
  for (const s of [-1, 1]) mesh(box(0.5, R.height, 0.5), M.riser, [s * (S.width / 2 + 0.3), R.height / 2, stageFront + 0.15], landmarks)
  mesh(box(S.width + 1.1, 1.1, 0.5), M.riser, [0, R.height - 0.55, stageFront + 0.15], landmarks)
  const sign = mesh(new THREE.PlaneGeometry(3.6, 0.56), M.sign, [0, R.height - 0.55, stageFront + 0.41], landmarks)
  sign.renderOrder = 2
  // velvet curtain with real folds
  const curtainGeo = new THREE.PlaneGeometry(S.width + 0.6, R.height - S.height - 0.4, 180, 1)
  const cp = curtainGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < cp.count; i++) {
    const x = cp.getX(i)
    cp.setZ(i, Math.sin(x * Math.PI * 1.7) * 0.11 + Math.sin(x * 6.3 + 1.2) * 0.035)
  }
  curtainGeo.computeVertexNormals()
  mesh(curtainGeo, M.velvet, [0, S.height + (R.height - S.height - 0.4) / 2, R.backZ + 0.35], landmarks, { receive: true })

  // truss + three cans aimed at the band
  // Truss sits high and close to the proscenium: above every sight line to the sign.
  const trussY = 5.95
  const trussZ = stageFront + 1.0
  mesh(box(S.width + 1, 0.22, 0.22), M.rig, [0, trussY, trussZ], landmarks)
  const spotTargets: Vec3[] = [
    [-2.1, S.height + 0.9, S.centerZ + 0.1], // piano
    [0.25, S.height + 1.1, stageFront - 1.0], // mic
    [1.9, S.height + 0.8, S.centerZ - 0.8], // kit
  ]
  // Side cans hang on the truss; the vocal key is a front-of-house can on the
  // ceiling, so nothing hangs between the audience and the sign.
  const canFrom: Vec3[] = [
    [-3.1, trussY - 0.25, trussZ],
    [0, R.height - 0.35, stageFront + 7.5],
    [3.1, trussY - 0.25, trussZ],
  ]
  const spots: THREE.SpotLight[] = []
  const cones: THREE.ShaderMaterial[] = []
  const keyColor = new THREE.Color(PALETTE.stageKey)
  canFrom.forEach((f, i) => {
    const from = v3(f)
    const to = v3(spotTargets[i]!)
    const dir = to.clone().sub(from).normalize()
    const can = new THREE.Group()
    can.position.copy(from)
    can.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir)
    mesh(cyl(0.15, 0.13, 0.36, 24), M.rig, [0, 0.12, 0], can)
    mesh(new THREE.CircleGeometry(0.12, 24), M.lens, [0, -0.061, 0], can, { rot: [Math.PI / 2, 0, 0] })
    landmarks.add(can)

    const spot = new THREE.SpotLight(keyColor, 0, 0, i === 1 ? 0.17 : 0.3, 0.65, 2)
    spot.position.copy(from)
    spot.target.position.copy(to)
    spot.castShadow = shadows && i === 1 // one shadowed light (budget)
    if (spot.castShadow) {
      spot.shadow.mapSize.set(quality.shadows, quality.shadows)
      spot.shadow.bias = -0.0004
      spot.shadow.camera.near = 1
      spot.shadow.camera.far = 16
    }
    scene.add(spot, spot.target)
    spots.push(spot)

    // visible shaft: apex at the lamp, base where the beam meets the stage
    const len = from.distanceTo(to) + 0.6
    const coneGeo = new THREE.ConeGeometry(Math.tan(spot.angle) * len, len, 48, 1, true)
    coneGeo.translate(0, -len / 2, 0)
    const mat = coneMaterial(keyColor.clone(), len)
    const cone = new THREE.Mesh(coneGeo, mat)
    cone.position.copy(from)
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir)
    cone.renderOrder = 3
    atmosphere.add(cone)
    cones.push(mat)
  })
  // cool rim light from behind the band, gives the instruments edges
  const rim = new THREE.SpotLight('#dfe2ff', 0, 0, 0.5, 0.9, 2)
  rim.position.set(0, 5.6, R.backZ + 0.6)
  rim.target.position.set(0, 0.6, S.centerZ + 0.6)
  scene.add(rim, rim.target)

  const hemi = new THREE.HemisphereLight('#3a2e24', '#000000', 0.2)
  scene.add(hemi)

  await yieldToMain()
  // ---- chapter set: the band (jazz trio + voice): piano audience-left with its
  // lid open to the house, bass between, kit upstage right, the mic down centre
  const P: PropMaterials = {
    lacquer: M.lacquer, ebony: M.ebony, ivory: M.ivory, gold: M.goldLeaf, bronze: M.bronze, chrome: M.chrome,
    wood: M.wood, spruce: M.spruce, tolex: M.tolex, grille: M.grille, rubber: M.rubber,
  }
  const piano = grandPiano(P).group
  piano.position.set(-2.55, S.height, S.centerZ + 0.35)
  piano.rotation.y = Math.PI / 2 + 0.35 // keyboard stage-left, tail upstage-centre, bentside to the audience
  const bass = uprightBass(P)
  bass.position.set(0.95, S.height, S.centerZ - 1.0)
  bass.rotation.y = -0.25
  const kit = drumKit(P)
  kit.position.set(2.15, S.height, S.centerZ - 0.75)
  kit.rotation.y = -0.32
  const amp = comboAmp(P)
  amp.position.set(3.55, S.height, S.centerZ - 1.3)
  amp.rotation.y = -0.4
  const mic = vocalMic(P)
  mic.position.set(0.25, S.height, stageFront - 0.85)
  band.add(piano, bass, kit, amp, mic)

  await yieldToMain()
  // ---- surfaces + chapter set: the house (CC0 furniture, votives, chandeliers, sconces)
  const assets = await assetsReady
  if (!assets.parquet) {
    M.floor.map = plankTexture(tex) // fallback: drawn oak planks
    M.floor.color.set('#ffffff')
  } else {
    for (const t of [assets.parquet.map, assets.parquet.normal, assets.parquet.rough]) t.repeat.set(R.width / 1.6, floorDepth / 1.6)
    M.floor.map = assets.parquet.map
    M.floor.normalMap = assets.parquet.normal
    M.floor.roughnessMap = assets.parquet.rough
    M.floor.color.set('#7a6656') // darken the oak to a smoked finish
    M.floor.roughness = 0.85
    M.floor.needsUpdate = true
  }
  if (assets.plaster) {
    for (const t of [assets.plaster.normal, assets.plaster.rough]) t.repeat.set(5, 2)
    M.wall.normalMap = assets.plaster.normal
    M.wall.normalScale.set(0.6, 0.6)
    M.wall.roughnessMap = assets.plaster.rough
    M.wall.needsUpdate = true
  }
  if (assets.velvet) {
    for (const t of [assets.velvet.normal, assets.velvet.rough]) t.repeat.set(7, 4)
    M.velvet.normalMap = assets.velvet.normal
    M.velvet.normalScale.set(0.8, 0.8)
    M.velvet.roughnessMap = assets.velvet.rough
    M.velvet.needsUpdate = true
  }

  const tableSpots: Vec3[] = []
  for (const z of [-1.6, -4.4, -7.2, -10.0]) for (const x of [-4.9, -2.4, 2.4, 4.9]) tableSpots.push([x, 0, z])
  const r = rng(11)
  const place4 = (x: number, y: number, z: number, yaw = 0, sx = 1, sy = 1, sz = sx) =>
    new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw), new THREE.Vector3(sx, sy, sz))
  const tableTop = 0.74
  const tablePlacements = tableSpots.map(([x, , z]) => place4(x, 0, z, r() * Math.PI, 0.44, tableTop / 1.004))
  // two chairs per table on the audience side, turned toward the stage
  const chairPlacements = tableSpots.flatMap(([x, , z]) => [-0.34, 0.34].map((dx) => place4(x + dx, 0, z + 0.55, Math.PI + dx * 0.5 + (r() - 0.5) * 0.25)))
  if (assets.table) {
    const tables = instanceOf(assets.table, tablePlacements)
    tables.receiveShadow = shadows
    house.add(tables)
  } else {
    const tops = new THREE.InstancedMesh(cyl(0.3, 0.3, 0.035, 40), M.table, tableSpots.length)
    tableSpots.forEach(([x, , z], i) => tops.setMatrixAt(i, place4(x, tableTop, z)))
    house.add(tops)
  }
  if (assets.chair) house.add(instanceOf(assets.chair, chairPlacements))
  // glass votives: a warm cylinder on each table, glow sprite above it
  const votives = new THREE.InstancedMesh(cyl(0.032, 0.03, 0.065, 16), M.votive, tableSpots.length)
  const glowPos: number[] = []
  const glowSeed: number[] = []
  tableSpots.forEach(([x, , z], i) => {
    votives.setMatrixAt(i, place4(x + 0.08, tableTop + 0.035, z - 0.05))
    glowPos.push(x + 0.08, tableTop + 0.09, z - 0.05)
    glowSeed.push(r())
  })
  house.add(votives)

  // chandeliers over the outer table rows, hung low enough to read in the house frame
  const chandelierAt: Vec3[] = [[-3.65, 4.75, -11.2], [3.65, 4.75, -11.2]]
  const chandelierScale = 1.35
  for (const part of assets.chandelier) {
    const mat = part.material as THREE.MeshStandardMaterial
    if (mat.name.startsWith('lamps')) {
      mat.emissive = new THREE.Color(PALETTE.practical)
      mat.emissiveIntensity = 1.2
    } else {
      mat.metalness = 0.45 // no env map: keep some diffuse so the brass reads
    }
    house.add(instanceOf(part, chandelierAt.map(([x, y, z]) => place4(x, y, z, 0.4, chandelierScale))))
  }
  if (assets.chandelier.length) {
    const chainTop = chandelierAt[0]![1]
    const chains = new THREE.InstancedMesh(cyl(0.008, 0.008, R.height - chainTop, 6), M.goldLeaf, chandelierAt.length)
    chandelierAt.forEach(([x, , z], i) => chains.setMatrixAt(i, place4(x, (R.height + chainTop) / 2, z)))
    house.add(chains)
  }

  // brass sconces down both side walls, each throwing a soft pool of light on the slats
  const sconceZ = [0.2, -3.6, -7.4, -11.2]
  const sconceAt: Vec3[] = sconceZ.flatMap((z) => [-1, 1].map((sx) => [sx * (R.width / 2 - 0.16), 2.45, z] as Vec3))
  const plates = new THREE.InstancedMesh(box(0.03, 0.26, 0.12), M.goldLeaf, sconceAt.length)
  const shades = new THREE.InstancedMesh(cyl(0.06, 0.085, 0.15, 20), M.shade, sconceAt.length)
  const pools = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.5, 2.4), M.pool, sconceAt.length)
  sconceAt.forEach(([x, y, z], i) => {
    const sx = Math.sign(x)
    plates.setMatrixAt(i, place4(x + sx * 0.05, y, z))
    shades.setMatrixAt(i, place4(x - sx * 0.05, y + 0.06, z))
    pools.setMatrixAt(i, place4(x + sx * 0.035, y + 0.15, z, -sx * Math.PI / 2))
    glowPos.push(x - sx * 0.05, y + 0.06, z)
    glowSeed.push(r())
  })
  pools.renderOrder = 2
  house.add(plates, shades, pools)

  const candleGlowGeo = new THREE.BufferGeometry()
  candleGlowGeo.setAttribute('position', new THREE.Float32BufferAttribute(glowPos, 3))
  candleGlowGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(glowSeed, 1))
  const candleGlow = glowMaterial(new THREE.Color(PALETTE.practical), 0.8)
  atmosphere.add(new THREE.Points(candleGlowGeo, candleGlow))

  const houseLights = [-0.6, -4.2, -9.2].map((z, i) => {
    const l = new THREE.PointLight(PALETTE.practical, 0, 12, 2)
    l.position.set(0, i === 0 ? 3.6 : 2.8, z)
    scene.add(l)
    return l
  })

  // dust in the beams
  const dustN = quality.dust
  const dustPos: number[] = []
  const dustSeed: number[] = []
  const dr = rng(23)
  for (let i = 0; i < dustN; i++) {
    dustPos.push((dr() - 0.5) * 8, 0.6 + dr() * 4.6, S.centerZ - 2 + dr() * 6)
    dustSeed.push(dr())
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(dustSeed, 1))
  const dust = dustMaterial(new THREE.Color(PALETTE.stageKey))
  atmosphere.add(new THREE.Points(dustGeo, dust))

  // ---- camera rig
  const camera = new THREE.PerspectiveCamera(CHAPTERS[0]!.camera.fov, 1, 0.08, 80)
  const pathRig = new THREE.Object3D()
  const inputRig = new THREE.Object3D()
  pathRig.add(inputRig)
  inputRig.add(camera)
  scene.add(pathRig)

  let posCurve: THREE.CatmullRomCurve3
  let tgtCurve: THREE.CatmullRomCurve3
  let poses = CHAPTERS.map((c) => c.camera as { p: Vec3; t: Vec3; fov: number })
  function buildCurves(portrait: boolean) {
    poses = CHAPTERS.map((c) => (portrait ? c.camera.mobile : c.camera))
    posCurve = new THREE.CatmullRomCurve3(poses.map((p) => v3(p.p)), false, 'centripetal', 0.5)
    tgtCurve = new THREE.CatmullRomCurve3(poses.map((p) => v3(p.t)), false, 'centripetal', 0.5)
  }
  buildCurves(opts.mobile)

  // ---- per-frame state
  const tmpP = new THREE.Vector3()
  const tmpT = new THREE.Vector3()
  const lookM = new THREE.Matrix4()
  const up = new THREE.Vector3(0, 1, 0)
  let pointerX = 0
  let pointerY = 0
  let audio = 0
  let time = 0
  let lastSmooth = -1
  let pointerDirty = false
  let pinned: { p: Vec3; t: Vec3; fov: number } | null = null
  const frameTimes: number[] = []
  const BASE = { spot: [900, 2600, 900], rim: 110, house: [14, 130, 100] }

  function worldAt(smooth: number): WorldState {
    const last = CHAPTERS.length - 1
    const i = Math.min(last, Math.max(0, Math.floor(smooth)))
    const j = Math.min(last, i + 1)
    const t = smoothstep(Math.min(1, Math.max(0, smooth - i)))
    const a = CHAPTERS[i]!.world
    const b = CHAPTERS[j]!.world
    const out = { ...a }
    for (const k of Object.keys(a) as (keyof WorldState)[]) out[k] = a[k] + (b[k] - a[k]) * t
    return out
  }

  function applyCamera(smooth: number) {
    if (pinned) {
      pathRig.position.set(...pinned.p)
      pathRig.quaternion.setFromRotationMatrix(lookM.lookAt(v3(pinned.p), v3(pinned.t), up))
      camera.fov = pinned.fov
      camera.updateProjectionMatrix()
      return
    }
    const last = CHAPTERS.length - 1
    const u = Math.min(1, Math.max(0, smooth / last))
    posCurve.getPoint(u, tmpP)
    tgtCurve.getPoint(u, tmpT)
    lookM.lookAt(tmpP, tmpT, up)
    pathRig.position.copy(tmpP)
    pathRig.quaternion.setFromRotationMatrix(lookM)
    const i = Math.min(last, Math.floor(smooth))
    const j = Math.min(last, i + 1)
    const t = smoothstep(Math.min(1, Math.max(0, smooth - i)))
    camera.fov = poses[i]!.fov + (poses[j]!.fov - poses[i]!.fov) * t
    camera.updateProjectionMatrix()
  }

  function applyWorld(w: WorldState) {
    const lift = 1 + audio * MOTION.audioGain
    spots.forEach((s, i) => (s.intensity = BASE.spot[i]! * (0.06 + 0.94 * w.key) * lift))
    rim.intensity = BASE.rim * w.key
    houseLights.forEach((l, i) => (l.intensity = BASE.house[i]! * w.house))
    hemi.intensity = 0.35 + 0.35 * w.house
    cones.forEach((m) => (m.uniforms.uOpacity!.value = w.cones * (1 + audio * 0.35)))
    M.edge.color.copy(gold).multiplyScalar(0.25 + 0.75 * w.edge)
    M.sign.color.copy(gold).multiplyScalar(0.25 + 1.6 * w.sign)
    M.lens.color.set(PALETTE.stageKey).multiplyScalar(0.08 + 0.42 * w.key * lift)
    candleGlow.uniforms.uIntensity!.value = 0.35 + 0.75 * w.house
    M.shade.color.set(PALETTE.practical).multiplyScalar(0.5 + 0.9 * w.house)
    M.pool.opacity = 0.05 + 0.14 * w.house
    dust.uniforms.uIntensity!.value = 0.15 + 0.35 * w.cones
    ;(scene.fog as THREE.FogExp2).density = w.fog
    renderer.toneMappingExposure = w.exposure
  }

  function governor(dt: number) {
    frameTimes.push(dt * 1000)
    if (frameTimes.length < BUDGET.downgradeAfterFrames) return
    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
    frameTimes.length = 0
    if (avg <= BUDGET.downgradeFrameMs || tier === 'low') return
    tier = tier === 'high' ? 'medium' : 'low'
    quality = QUALITY[tier]
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr))
    if (quality.shadows === 0 && renderer.shadowMap.enabled) {
      renderer.shadowMap.enabled = false
      spots.forEach((s) => (s.castShadow = false))
    }
  }

  const pxScale = () => renderer.getPixelRatio()
  for (const m of [candleGlow, dust]) m.uniforms.uPx!.value = pxScale()

  applyCamera(0)
  applyWorld(worldAt(0))
  // Upload textures one per task (instead of all inside the first render).
  const textures = new Set<THREE.Texture>()
  scene.traverse((o) => {
    const mats = (o as THREE.Mesh).material
    if (!mats) return
    for (const mat of ([] as THREE.Material[]).concat(mats)) for (const v of Object.values(mat)) if (v instanceof THREE.Texture) textures.add(v)
  })
  for (const t of textures) {
    renderer.initTexture(t)
    await yieldToMain()
  }
  await renderer.compileAsync(scene, camera)
  await yieldToMain()

  return {
    frame(smooth, dt, ambient) {
      if (ambient) time += dt
      const dirty = smooth !== lastSmooth || pointerDirty || ambient || audio > 0.001
      if (!dirty) return
      lastSmooth = smooth
      pointerDirty = false
      applyCamera(smooth)
      // pointer look-around, damped, on the input rig only (never the authored path)
      const k = 1 - Math.exp(-MOTION.pointerDamping * Math.min(dt, 1 / 30))
      inputRig.rotation.y += (-pointerX * THREE.MathUtils.degToRad(MOTION.pointerYawDeg) - inputRig.rotation.y) * k
      inputRig.rotation.x += (pointerY * THREE.MathUtils.degToRad(MOTION.pointerPitchDeg) - inputRig.rotation.x) * k
      if (Math.abs(inputRig.rotation.y + pointerX * THREE.MathUtils.degToRad(MOTION.pointerYawDeg)) > 1e-4) pointerDirty = true
      applyWorld(worldAt(smooth))
      for (const m of [...cones, candleGlow, dust]) m.uniforms.uTime!.value = time
      renderer.render(scene, camera)
      governor(dt)
    },
    setPointer(nx, ny) {
      pointerX = nx
      pointerY = ny
      pointerDirty = true
    },
    setAudioLevel(level) {
      audio = level
    },
    resize(width, height) {
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(1, height)
      buildCurves(width / Math.max(1, height) < 0.9)
      for (const m of [candleGlow, dust]) m.uniforms.uPx!.value = pxScale()
      lastSmooth = -1
    },
    debugView(pose) {
      pinned = pose
      lastSmooth = -1
    },
    needsFrame: () => pointerDirty || audio > 0.001,
    info: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, tier, dpr: renderer.getPixelRatio() }),
    dispose() {
      env.dispose()
      const mats = new Set<THREE.Material>(Object.values(M))
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        if (m.material) for (const mat of ([] as THREE.Material[]).concat(m.material)) mats.add(mat)
      })
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose()
        mat.dispose()
      }
      renderer.dispose()
    },
  }
}
