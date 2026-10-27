/**
 * The band's instruments, modelled in code at real scale (metres).
 * No CC0 instrument models exist at the quality bar we need, so each prop is
 * authored from primitives, lathes and extrusions, then baked: every mesh of a
 * prop is merged per material, so a whole drum kit costs a handful of draw calls.
 *
 * Local frames: the player faces +z. Their right hand is at -x.
 */
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Vec3 } from '@/lib/venue/worldBible'

export type PropMaterials = {
  lacquer: THREE.Material // gloss black: piano case, drum shells
  ebony: THREE.Material // matte black: black keys, fingerboard, bench top
  ivory: THREE.Material // white keys, coated drum heads
  gold: THREE.Material // piano plate, lyre, pedals, hinges
  bronze: THREE.Material // cymbals
  chrome: THREE.Material // stands, hoops, strings
  wood: THREE.Material // upright bass body
  spruce: THREE.Material // piano soundboard
  tolex: THREE.Material // amp, wedges
  grille: THREE.Material // amp cloth, mic grille
  rubber: THREE.Material // feet, cables
}

const Y = new THREE.Vector3(0, 1, 0)

// ---------------------------------------------------------------- authoring helpers

function place(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, pos: Vec3, rot?: Vec3) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(...pos)
  if (rot) m.rotation.set(...rot)
  parent.add(m)
  return m
}

/** A round bar between two points. */
function rod(parent: THREE.Object3D, mat: THREE.Material, a: Vec3, b: Vec3, r: number, seg = 10) {
  const A = new THREE.Vector3(...a)
  const B = new THREE.Vector3(...b)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, A.distanceTo(B), seg), mat)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(Y, B.clone().sub(A).normalize())
  parent.add(m)
  return m
}

/** Three splayed legs from a centre column down to the floor. */
function tripod(parent: THREE.Object3D, mat: THREE.Material, at: Vec3, top: number, spread = 0.24, yaw = 0) {
  for (let i = 0; i < 3; i++) {
    const a = yaw + (i * Math.PI * 2) / 3
    rod(parent, mat, [at[0], top, at[2]], [at[0] + Math.cos(a) * spread, 0.01, at[2] + Math.sin(a) * spread], 0.007, 6)
  }
}

/** Cymbal: lathe profile with a raised bell and a bow that thins to the edge. */
function cymbalGeo(radius: number) {
  const bell = radius * 0.24
  const pts = [
    [0.004, 0.03], [bell * 0.55, 0.029], [bell * 0.9, 0.02], [bell, 0.012],
    [radius * 0.55, 0.007], [radius * 0.85, 0.003], [radius, 0],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  return new THREE.LatheGeometry(pts, 48)
}

/** A drum: shell + two hoops + lugs; heads on top (coated) and bottom. */
function drum(parent: THREE.Object3D, M: PropMaterials, r: number, depth: number, pos: Vec3, rot: Vec3, lugs: number, topHead = M.ivory) {
  const g = new THREE.Group()
  g.position.set(...pos)
  g.rotation.set(...rot)
  place(new THREE.CylinderGeometry(r, r, depth, 40, 1, true), M.lacquer, g, [0, 0, 0])
  place(new THREE.CircleGeometry(r * 0.985, 40), topHead, g, [0, depth / 2 + 0.002, 0], [-Math.PI / 2, 0, 0])
  place(new THREE.CircleGeometry(r * 0.985, 40), M.ebony, g, [0, -depth / 2 - 0.002, 0], [Math.PI / 2, 0, 0])
  for (const s of [-1, 1]) place(new THREE.TorusGeometry(r + 0.004, 0.006, 6, 40), M.chrome, g, [0, s * (depth / 2 + 0.003), 0], [Math.PI / 2, 0, 0])
  for (let i = 0; i < lugs; i++) {
    const a = (i / lugs) * Math.PI * 2
    place(new THREE.BoxGeometry(0.01, Math.min(0.05, depth * 0.3), 0.012), M.chrome, g, [Math.cos(a) * (r + 0.006), 0, Math.sin(a) * (r + 0.006)], [0, -a, 0])
  }
  parent.add(g)
  return g
}

/** Merge every mesh under `root` into one mesh per material, keeping root's transform. */
export function bake(root: THREE.Object3D, castShadow: boolean): THREE.Group {
  root.updateMatrixWorld(true)
  const inv = root.matrixWorld.clone().invert()
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>()
  const keep = new Set(['position', 'normal', 'uv'])
  const local = new THREE.Matrix4()
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (!m.isMesh) return
    let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()
    for (const name of Object.keys(g.attributes)) if (!keep.has(name)) g.deleteAttribute(name)
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position!.count * 2), 2))
    g = g.applyMatrix4(local.multiplyMatrices(inv, m.matrixWorld))
    const mat = m.material as THREE.Material
    if (!buckets.has(mat)) buckets.set(mat, [])
    buckets.get(mat)!.push(g)
    m.geometry.dispose()
  })
  const out = new THREE.Group()
  out.name = root.name
  out.position.copy(root.position)
  out.quaternion.copy(root.quaternion)
  out.scale.copy(root.scale)
  for (const [mat, geos] of buckets) {
    const merged = mergeGeometries(geos)
    geos.forEach((g) => g.dispose())
    if (!merged) continue
    const mesh = new THREE.Mesh(merged, mat)
    mesh.castShadow = castShadow
    mesh.receiveShadow = castShadow
    out.add(mesh)
  }
  return out
}

// ---------------------------------------------------------------- grand piano

/** Top-view outline of a 1.9 m grand: straight bass side at +x, bentside curving in at -x. */
function pianoOutline() {
  const s = new THREE.Shape()
  s.moveTo(0.74, 0)
  s.lineTo(0.74, 1.6)
  s.bezierCurveTo(0.74, 1.86, 0.56, 1.92, 0.38, 1.88)
  s.bezierCurveTo(0.06, 1.8, -0.1, 1.26, -0.42, 0.98)
  s.bezierCurveTo(-0.66, 0.78, -0.74, 0.58, -0.74, 0.42)
  s.lineTo(-0.74, 0)
  s.closePath()
  return s
}

/** Inset a closed outline by `d` (simple per-vertex normal offset; fine for gentle curves). */
function inset(points: THREE.Vector2[], d: number) {
  const n = points.length
  return points.map((p, i) => {
    const a = points[(i - 1 + n) % n]!
    const b = points[(i + 1) % n]!
    const t = b.clone().sub(a).normalize()
    return new THREE.Vector2(p.x - t.y * d, p.y + t.x * d) // left normal = inward for a CCW outline
  })
}

/** Extrude a top-view shape upward: shape (x, y) → world (x, z), thickness along +y from y0. */
function slab(shape: THREE.Shape, thickness: number, y0: number, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 48,
  })
  g.rotateX(Math.PI / 2) // shape y → +z, extrusion → -y
  g.translate(0, y0 + thickness, 0)
  return g
}

export function grandPiano(M: PropMaterials): { group: THREE.Group; whiteKeys: THREE.InstancedMesh; blackKeys: THREE.InstancedMesh } {
  const root = new THREE.Group()
  root.name = 'grand-piano'
  const outline = pianoOutline()
  const pts = outline.getPoints(64)
  if (pts[0]!.equals(pts[pts.length - 1]!)) pts.pop()
  // CCW check so the inset goes inward
  if (THREE.ShapeUtils.isClockWise(pts)) pts.reverse()
  const inner = inset(pts, 0.045)
  const rimShape = new THREE.Shape(pts)
  rimShape.holes.push(new THREE.Path([...inner].reverse()))
  const innerShape = new THREE.Shape(inner)

  const caseBottom = 0.68
  const caseTop = 1.0
  place(slab(rimShape, caseTop - caseBottom, caseBottom, 0.008), M.lacquer, root, [0, 0, 0]) // case rim
  place(slab(new THREE.Shape(pts), 0.03, caseBottom - 0.03), M.lacquer, root, [0, 0, 0]) // bottom
  place(slab(innerShape, 0.012, caseTop - 0.2), M.spruce, root, [0, 0, 0]) // soundboard
  // the cast-iron plate: gold, stopping short of the keyboard
  const platePts = inset(inner, 0.05).filter((p) => p.y > 0.3)
  place(slab(new THREE.Shape(platePts), 0.014, caseTop - 0.12), M.gold, root, [0, 0, 0])
  for (const x of [-0.42, -0.12, 0.18, 0.48]) {
    const len = x > 0.3 ? 1.35 : x > 0 ? 1.3 : x > -0.3 ? 1.05 : 0.72 // plate struts follow the bentside
    place(new THREE.BoxGeometry(0.035, 0.03, len), M.gold, root, [x, caseTop - 0.1, 0.32 + len / 2])
  }

  // lid, hinged on the straight bass side and propped open toward the audience
  const lid = new THREE.Group()
  lid.position.set(0.74, caseTop + 0.004, 0)
  lid.rotation.z = -0.6
  const lidGeo = slab(new THREE.Shape(pts), 0.022, 0)
  lidGeo.translate(-0.74, 0, 0)
  place(lidGeo, M.lacquer, lid, [0, 0, 0])
  root.add(lid)
  // prop stick: rim → underside of the lid
  const reach = -1.12
  const tip: Vec3 = [0.74 + reach * Math.cos(0.6), caseTop + -reach * Math.sin(0.6), 0.95]
  rod(root, M.lacquer, [-0.28, caseTop, 0.95], tip, 0.012)
  for (const z of [0.35, 1.2]) place(new THREE.BoxGeometry(0.02, 0.012, 0.09), M.gold, root, [0.745, caseTop + 0.004, z]) // hinges

  // keyboard: keybed, cheeks, fallboard, music desk
  place(new THREE.BoxGeometry(1.4, 0.05, 0.22), M.lacquer, root, [0, 0.69, -0.06])
  for (const s of [-1, 1]) place(new THREE.BoxGeometry(0.06, 0.1, 0.22), M.lacquer, root, [s * 0.7, 0.75, -0.06])
  place(new THREE.BoxGeometry(1.34, 0.1, 0.03), M.lacquer, root, [0, 0.79, 0.04])
  place(new THREE.BoxGeometry(0.8, 0.26, 0.015), M.lacquer, root, [0, caseTop + 0.12, 0.2], [-0.32, 0, 0])
  place(new THREE.BoxGeometry(0.8, 0.02, 0.05), M.lacquer, root, [0, caseTop + 0.01, 0.16])

  // legs with gold casters, lyre with three pedals
  for (const [x, z] of [[0.62, 0.12], [-0.62, 0.12], [0.46, 1.58]] as const) {
    place(new THREE.CylinderGeometry(0.06, 0.045, caseBottom - 0.07, 20), M.lacquer, root, [x, (caseBottom - 0.07) / 2 + 0.06, z])
    place(new THREE.SphereGeometry(0.035, 14, 10), M.gold, root, [x, 0.035, z])
  }
  for (const s of [-1, 1]) rod(root, M.gold, [s * 0.09, caseBottom - 0.03, 0.32], [s * 0.06, 0.12, 0.3], 0.008)
  place(new THREE.BoxGeometry(0.24, 0.06, 0.1), M.lacquer, root, [0, 0.1, 0.28])
  for (const x of [-0.06, 0, 0.06]) place(new THREE.BoxGeometry(0.022, 0.012, 0.09), M.gold, root, [x, 0.075, 0.2])

  // bench
  place(new THREE.BoxGeometry(0.78, 0.07, 0.36), M.lacquer, root, [0, 0.47, -0.6])
  place(new THREE.BoxGeometry(0.74, 0.03, 0.32), M.ebony, root, [0, 0.52, -0.6])
  for (const [x, z] of [[0.34, -0.45], [-0.34, -0.45], [0.34, -0.75], [-0.34, -0.75]] as const) {
    place(new THREE.CylinderGeometry(0.022, 0.016, 0.44, 10), M.lacquer, root, [x, 0.22, z])
  }

  const group = bake(root, true)

  // 88 keys, two instanced draws; A0 at the bass end (+x)
  const whiteW = 1.22 / 52
  const white = new THREE.InstancedMesh(new THREE.BoxGeometry(whiteW * 0.94, 0.022, 0.15), M.ivory, 52)
  const black = new THREE.InstancedMesh(new THREE.BoxGeometry(whiteW * 0.55, 0.02, 0.095), M.ebony, 36)
  const d = new THREE.Object3D()
  const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  let bi = 0
  for (let i = 0; i < 52; i++) {
    const x = 0.61 - whiteW * (i + 0.5)
    d.position.set(x, 0.727, -0.09)
    d.updateMatrix()
    white.setMatrixAt(i, d.matrix)
    if (i < 51 && 'ACDFG'.includes(names[i % 7]!) && bi < 36) {
      d.position.set(x - whiteW / 2, 0.745, -0.05)
      d.updateMatrix()
      black.setMatrixAt(bi++, d.matrix)
    }
  }
  black.count = bi
  group.add(white, black)
  return { group, whiteKeys: white, blackKeys: black }
}

// ---------------------------------------------------------------- upright bass

function bassOutline() {
  // right half of the body, front view (x across, y up), then mirrored
  const half = [
    [0, 0], [0.22, 0.02], [0.32, 0.12], [0.35, 0.3], [0.31, 0.46], [0.22, 0.56],
    [0.21, 0.64], [0.26, 0.74], [0.27, 0.86], [0.2, 0.98], [0.07, 1.08],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  // up the right side, across the neck block, down the mirrored left side
  const pts = [...half, ...half.slice(1).reverse().map((p) => new THREE.Vector2(-p.x, p.y))]
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.splineThru([...pts.slice(1), new THREE.Vector2(0, 0)])
  return s
}

export function uprightBass(M: PropMaterials) {
  const root = new THREE.Group()
  root.name = 'upright-bass'
  const body = new THREE.ExtrudeGeometry(bassOutline(), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 40 })
  body.translate(0, 0.12, -0.08)
  place(body, M.wood, root, [0, 0, 0])
  // neck, fingerboard, scroll
  place(new THREE.BoxGeometry(0.055, 0.78, 0.05), M.wood, root, [0, 1.56, 0.0])
  place(new THREE.BoxGeometry(0.075, 1.12, 0.014), M.ebony, root, [0, 1.36, 0.12], [-0.03, 0, 0])
  place(new THREE.BoxGeometry(0.07, 0.16, 0.06), M.wood, root, [0, 1.98, -0.01])
  place(new THREE.TorusGeometry(0.04, 0.016, 8, 20), M.wood, root, [0, 2.08, 0.0], [0, Math.PI / 2, 0])
  // bridge, tailpiece, strings, endpin
  place(new THREE.BoxGeometry(0.16, 0.12, 0.014), M.spruce, root, [0, 0.62, 0.14])
  place(new THREE.BoxGeometry(0.09, 0.26, 0.016), M.ebony, root, [0, 0.36, 0.13])
  for (const x of [-0.024, -0.008, 0.008, 0.024]) rod(root, M.chrome, [x * 1.3, 0.48, 0.135], [x * 0.6, 1.9, 0.135], 0.0016, 5)
  rod(root, M.chrome, [0, 0.14, 0], [0, -0.04, 0.02], 0.007)
  root.position.y = 0.04
  root.rotation.z = 0.1 // resting on its stand, leaning a little
  const g = new THREE.Group()
  g.add(root)
  rod(g, M.chrome, [0.12, 0, -0.25], [0.02, 0.9, -0.08], 0.009) // stand
  return bake(g, true)
}

// ---------------------------------------------------------------- drums (bebop kit)

export function drumKit(M: PropMaterials) {
  const root = new THREE.Group()
  root.name = 'drum-kit'
  // 18" kick on its side, facing the audience; spurs at the front
  const kick = drum(root, M, 0.23, 0.36, [0, 0.245, 0], [Math.PI / 2, 0, 0], 10, M.ebony)
  place(new THREE.RingGeometry(0.06, 0.072, 32), M.chrome, kick, [0, 0.183, 0], [-Math.PI / 2, 0, 0]) // port ring on the front head
  for (const s of [-1, 1]) rod(root, M.chrome, [s * 0.2, 0.16, 0.12], [s * 0.34, 0.01, 0.2], 0.008)
  // 12" rack tom on the kick, 14" floor tom, 14" snare
  drum(root, M, 0.155, 0.2, [0.06, 0.66, -0.05], [-0.3, 0, -0.08], 6)
  rod(root, M.chrome, [0.04, 0.47, 0.0], [0.06, 0.58, -0.04], 0.01)
  drum(root, M, 0.18, 0.3, [-0.5, 0.45, -0.18], [0, 0, 0], 8)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4
    rod(root, M.chrome, [-0.5 + Math.cos(a) * 0.19, 0.45, -0.18 + Math.sin(a) * 0.19], [-0.5 + Math.cos(a) * 0.23, 0.0, -0.18 + Math.sin(a) * 0.23], 0.006)
  }
  drum(root, M, 0.178, 0.13, [0.12, 0.62, -0.36], [-0.1, 0, 0.06], 8)
  tripod(root, M.chrome, [0.12, 0, -0.36], 0.5, 0.2)
  rod(root, M.chrome, [0.12, 0.5, -0.36], [0.12, 0.55, -0.36], 0.009)

  // hi-hat (player's left, +x), ride (right, -x), crash (left, high)
  const hat = new THREE.Vector3(0.5, 0, -0.34)
  tripod(root, M.chrome, [hat.x, 0, hat.z], 0.42, 0.22)
  rod(root, M.chrome, [hat.x, 0.42, hat.z], [hat.x, 0.95, hat.z], 0.008)
  place(cymbalGeo(0.178), M.bronze, root, [hat.x, 0.9, hat.z], [Math.PI, 0, 0])
  place(cymbalGeo(0.178), M.bronze, root, [hat.x, 0.915, hat.z])
  place(new THREE.BoxGeometry(0.07, 0.01, 0.2), M.chrome, root, [hat.x, 0.02, hat.z - 0.12]) // pedal

  const ride: Vec3 = [-0.62, 1.08, 0.12]
  tripod(root, M.chrome, [-0.68, 0, 0.18], 0.55, 0.26, 0.3)
  rod(root, M.chrome, [-0.68, 0.55, 0.18], [-0.68, 0.95, 0.18], 0.009)
  rod(root, M.chrome, [-0.68, 0.95, 0.18], ride, 0.007)
  place(cymbalGeo(0.255), M.bronze, root, ride, [0.22, 0, -0.12])

  const crash: Vec3 = [0.38, 1.22, 0.2]
  tripod(root, M.chrome, [0.46, 0, 0.26], 0.6, 0.24, 1.1)
  rod(root, M.chrome, [0.46, 0.6, 0.26], [0.42, 1.08, 0.23], 0.008)
  rod(root, M.chrome, [0.42, 1.08, 0.23], crash, 0.006)
  place(cymbalGeo(0.22), M.bronze, root, crash, [0.3, 0, 0.18])

  // throne + kick pedal
  place(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 28), M.ebony, root, [0, 0.52, -0.72])
  rod(root, M.chrome, [0, 0.48, -0.72], [0, 0.25, -0.72], 0.02)
  tripod(root, M.chrome, [0, 0, -0.72], 0.25, 0.24)
  place(new THREE.BoxGeometry(0.08, 0.015, 0.24), M.chrome, root, [0, 0.03, -0.24])
  return bake(root, true)
}

// ---------------------------------------------------------------- mic, amp, wedges

export function vocalMic(M: PropMaterials) {
  const root = new THREE.Group()
  root.name = 'vocal-mic'
  place(new THREE.CylinderGeometry(0.13, 0.14, 0.022, 36), M.chrome, root, [0, 0.011, 0])
  rod(root, M.chrome, [0, 0.02, 0], [0, 1.42, 0], 0.009)
  // handheld dynamic mic in its clip, head toward the singer (-z) and up
  const mic = new THREE.Group()
  mic.position.set(0, 1.44, -0.01)
  mic.rotation.x = -1.05
  const body = [[0.0, 0], [0.012, 0], [0.0135, 0.05], [0.017, 0.14], [0.02, 0.17], [0.0, 0.17]].map(([x, y]) => new THREE.Vector2(x, y))
  place(new THREE.LatheGeometry(body, 20), M.ebony, mic, [0, 0, 0])
  place(new THREE.SphereGeometry(0.027, 18, 12), M.grille, mic, [0, 0.19, 0])
  place(new THREE.TorusGeometry(0.02, 0.003, 6, 20), M.chrome, mic, [0, 0.17, 0], [Math.PI / 2, 0, 0])
  root.add(mic)
  place(new THREE.BoxGeometry(0.03, 0.04, 0.03), M.ebony, root, [0, 1.43, 0]) // clip
  return bake(root, false)
}

export function comboAmp(M: PropMaterials) {
  const root = new THREE.Group()
  root.name = 'combo-amp'
  place(new THREE.BoxGeometry(0.62, 0.5, 0.28), M.tolex, root, [0, 0.29, 0])
  place(new THREE.PlaneGeometry(0.56, 0.36), M.grille, root, [0, 0.24, 0.141])
  place(new THREE.BoxGeometry(0.58, 0.08, 0.005), M.ebony, root, [0, 0.48, 0.141]) // control panel
  for (let i = 0; i < 6; i++) place(new THREE.CylinderGeometry(0.011, 0.011, 0.018, 12), M.chrome, root, [-0.2 + i * 0.07, 0.48, 0.15], [Math.PI / 2, 0, 0])
  place(new THREE.BoxGeometry(0.62, 0.006, 0.006), M.gold, root, [0, 0.43, 0.143]) // piping
  place(new THREE.BoxGeometry(0.18, 0.025, 0.04), M.ebony, root, [0, 0.555, 0]) // handle
  for (const x of [-0.26, 0.26]) for (const z of [-0.1, 0.1]) place(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 10), M.rubber, root, [x, 0.02, z])
  return bake(root, true)
}

export function wedge(M: PropMaterials) {
  const root = new THREE.Group()
  const shape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0.44, 0), new THREE.Vector2(0.44, 0.13), new THREE.Vector2(0.06, 0.34), new THREE.Vector2(0, 0.34)])
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.56, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1 })
  geo.rotateY(Math.PI / 2)
  geo.translate(-0.28, 0, 0.22)
  place(geo, M.tolex, root, [0, 0, 0])
  return bake(root, true)
}
