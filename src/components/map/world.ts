import type { Point } from './layout'

/**
 * Three worlds for three acts.
 *
 * The map is not decoration with a palette swap: each act is a different kind
 * of place, because the course is telling a different kind of story in each.
 * Act I is a forest at dusk — wild, unmapped, the apprentice's first steps.
 * Act II is a forge among ruins — tools, heat, things that were built and
 * things that broke. Act III is the crystalline archive — an unreal, luminous
 * matrix where the metaphor finally gives way to the machine itself.
 *
 * Everything drawn is procedural and seeded, so a module is the same place
 * every time it is opened and a new module needs no hand-placed scenery.
 */

export type WorldName = 'forest' | 'forge' | 'matrix'

export interface World {
  name: WorldName
  /** Sky gradient, top to horizon. */
  sky: [string, string]
  /** Ground gradient, horizon to the near edge. */
  ground: [string, string]
  /** Atmospheric perspective: far things fade toward this. */
  fog: string
  /** The glow colour of magic in this world — paths, particles, auras. */
  accent: string
  /** A secondary light, for contrast: firelight, moonlight, data. */
  accent2: string
  /** Where the horizon sits, as a fraction of the region height. */
  horizon: number
  particles: 'firefly' | 'ember' | 'glyph'
  /** How many ambient particles per 100k square pixels. */
  density: number
  /** Act III draws a perspective grid on the floor; nobody else does. */
  grid: boolean
  /** Scenery kinds this world scatters, and how many of each. */
  scenery: Array<{ kind: SceneryKind; count: number; scale: [number, number] }>
  /** A signature structure pinned to the far side of the region. */
  landmark: SceneryKind
}

export type SceneryKind =
  // forest
  | 'pine'
  | 'broadleaf'
  | 'mushrooms'
  | 'boulder'
  | 'shrine'
  | 'mist'
  // forge
  | 'anvil'
  | 'column'
  | 'arch'
  | 'furnace'
  | 'gear'
  | 'ashheap'
  | 'chimney'
  // matrix
  | 'crystal'
  | 'monolith'
  | 'datapillar'
  | 'shelf'
  | 'runering'
  | 'shard'

export const WORLDS: Record<WorldName, World> = {
  forest: {
    name: 'forest',
    sky: ['#0b1a17', '#1a3a2e'],
    ground: ['#16302a', '#0a1613'],
    fog: '#1d4238',
    accent: '#a7e08a',
    accent2: '#f5c451',
    horizon: 0.3,
    particles: 'firefly',
    density: 3.2,
    grid: false,
    scenery: [
      { kind: 'pine', count: 14, scale: [0.7, 1.35] },
      { kind: 'broadleaf', count: 6, scale: [0.75, 1.2] },
      { kind: 'mushrooms', count: 4, scale: [0.8, 1.1] },
      { kind: 'boulder', count: 3, scale: [0.7, 1.2] },
      { kind: 'mist', count: 3, scale: [0.9, 1.4] },
    ],
    landmark: 'shrine',
  },
  forge: {
    name: 'forge',
    sky: ['#120e10', '#3a1f14'],
    ground: ['#2a1c17', '#0e0a0a'],
    fog: '#3d2519',
    accent: '#ff9a3c',
    accent2: '#ffd27a',
    horizon: 0.32,
    particles: 'ember',
    density: 2.6,
    grid: false,
    scenery: [
      { kind: 'column', count: 6, scale: [0.7, 1.3] },
      { kind: 'arch', count: 2, scale: [0.9, 1.2] },
      { kind: 'anvil', count: 3, scale: [0.8, 1.1] },
      { kind: 'gear', count: 4, scale: [0.6, 1.3] },
      { kind: 'ashheap', count: 4, scale: [0.8, 1.3] },
      { kind: 'chimney', count: 2, scale: [0.9, 1.2] },
    ],
    landmark: 'furnace',
  },
  matrix: {
    name: 'matrix',
    sky: ['#06061a', '#161a4a'],
    ground: ['#0f1240', '#05061a'],
    fog: '#1b1f5c',
    accent: '#7dd3fc',
    accent2: '#a78bfa',
    horizon: 0.36,
    particles: 'glyph',
    density: 3.6,
    grid: true,
    scenery: [
      { kind: 'crystal', count: 7, scale: [0.7, 1.4] },
      { kind: 'shard', count: 8, scale: [0.5, 1.1] },
      { kind: 'datapillar', count: 4, scale: [0.8, 1.3] },
      { kind: 'shelf', count: 3, scale: [0.9, 1.2] },
      { kind: 'runering', count: 2, scale: [0.9, 1.3] },
    ],
    landmark: 'monolith',
  },
}

export function worldFor(act: string): World {
  return act === 'act3' ? WORLDS.matrix : act === 'act2' ? WORLDS.forge : WORLDS.forest
}

/** A world that is the same world every time you open it. */
export function seedFrom(text: string): number {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Placement {
  kind: SceneryKind
  x: number
  y: number
  scale: number
  /** 0 at the horizon, 1 at the near edge — drives size, fog and parallax. */
  depth: number
  /** Per-instance variation the painter may use: a tilt, a hue nudge, etc. */
  seed: number
}

/**
 * Scatter scenery across the region, keeping clear of the nodes and of the
 * label strip beneath each one, and never above the horizon.
 */
export function populate(
  moduleId: string,
  world: World,
  width: number,
  height: number,
  nodes: Point[],
): Placement[] {
  const random = mulberry32(seedFrom(moduleId))
  const placed: Placement[] = []
  const skyline = height * world.horizon

  const clearOf = (x: number, y: number, radius: number) =>
    nodes.every((node) => {
      const dx = node.x - x
      // Nodes carry a label below them; treat the pair as one tall obstacle.
      const dy = node.y + 20 - y
      return Math.hypot(dx, dy * 0.8) > radius
    })

  for (const { kind, count, scale: range } of world.scenery) {
    for (let i = 0; i < count; i += 1) {
      for (let attempt = 0; attempt < 48; attempt += 1) {
        const x = 20 + random() * Math.max(1, width - 40)
        // Mist and ash sit low; everything else can stand anywhere on the ground.
        const low = kind === 'mist' || kind === 'ashheap'
        const y = low
          ? skyline + (0.35 + random() * 0.6) * (height - skyline)
          : skyline - 6 + random() * Math.max(1, height - skyline)
        const wide = kind === 'mist' || kind === 'arch' || kind === 'shelf' || kind === 'runering'
        if (!clearOf(x, y, wide ? 96 : 66)) continue

        const [lo, hi] = range
        const depth = Math.min(1, Math.max(0, (y - skyline) / (height - skyline)))
        placed.push({ kind, x, y, scale: lo + random() * (hi - lo), depth, seed: random() })
        break
      }
    }
  }

  // The landmark anchors the region on the far side, out of the path's way.
  placed.push({
    kind: world.landmark,
    x: width - 74,
    y: skyline + 14,
    scale: 1.15,
    depth: 0.08,
    seed: random(),
  })

  // Painter's order: far first, so near things overlap them.
  return placed.sort((a, b) => a.depth - b.depth)
}
