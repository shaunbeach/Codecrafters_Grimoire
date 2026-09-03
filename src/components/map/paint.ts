import type { Point } from './layout'
import type { Placement, World } from './world'
import { mulberry32 } from './world'
import type { ProjectStatus } from '../../course'

/**
 * Everything the map draws, in one place.
 *
 * The scene is painted in bands of depth. Far things are small, faded toward
 * the fog colour and barely move; near things are large, saturated and slide
 * further under the pointer. That single rule — scale, fog and parallax all
 * driven by one depth number — is what makes a flat canvas read as a place.
 */

type Ctx = CanvasRenderingContext2D

// ------------------------------------------------------------------ colour

/** Accepts '#rrggbb' or the 'rgb(r g b)' form that mix() itself returns, so
 *  a mixed colour can be mixed again — fogged crystal is mix(mix(...)). */
function hexToRgb(colour: string): [number, number, number] {
  if (colour.startsWith('rgb')) {
    const [r, g, b] = colour.match(/[\d.]+/g)!.map(Number)
    return [r, g, b]
  }
  const n = parseInt(colour.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `rgb(${r} ${g} ${bl})`
}

export function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgb(${r} ${g} ${b} / ${a})`
}

// ---------------------------------------------------------------- backdrop

/** Sky, horizon and ground. Painted once per region and cached. */
export function paintBackdrop(ctx: Ctx, world: World, w: number, h: number, seed: number) {
  const random = mulberry32(seed)
  const horizon = h * world.horizon

  const sky = ctx.createLinearGradient(0, 0, 0, horizon)
  sky.addColorStop(0, world.sky[0])
  sky.addColorStop(1, world.sky[1])
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, horizon + 1)

  const ground = ctx.createLinearGradient(0, horizon, 0, h)
  ground.addColorStop(0, world.ground[0])
  ground.addColorStop(1, world.ground[1])
  ctx.fillStyle = ground
  ctx.fillRect(0, horizon, w, h - horizon)

  // Stars, in every world: the archive has more and brighter ones.
  const starCount = world.name === 'matrix' ? 90 : 34
  for (let i = 0; i < starCount; i += 1) {
    const x = random() * w
    const y = random() * horizon * 0.9
    const r = 0.4 + random() * (world.name === 'matrix' ? 1.3 : 0.8)
    ctx.fillStyle = alpha(world.name === 'forge' ? world.accent2 : '#ffffff', 0.25 + random() * 0.5)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  if (world.name === 'forest') {
    // A moon, and a distant treeline against it.
    const mx = w * 0.82
    const my = horizon * 0.42
    const halo = ctx.createRadialGradient(mx, my, 4, mx, my, 70)
    halo.addColorStop(0, alpha('#e8f0d8', 0.35))
    halo.addColorStop(1, alpha('#e8f0d8', 0))
    ctx.fillStyle = halo
    ctx.fillRect(mx - 70, my - 70, 140, 140)
    ctx.fillStyle = '#e6ecd9'
    ctx.beginPath()
    ctx.arc(mx, my, 11, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = world.sky[1]
    ctx.beginPath()
    ctx.arc(mx + 5, my - 3, 9.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = mix(world.fog, world.sky[1], 0.35)
    ctx.beginPath()
    ctx.moveTo(0, horizon + 2)
    for (let x = 0; x <= w; x += 9) {
      const tall = 8 + random() * 22
      ctx.lineTo(x, horizon - tall)
      ctx.lineTo(x + 4.5, horizon - tall * 0.4)
    }
    ctx.lineTo(w, horizon + 2)
    ctx.closePath()
    ctx.fill()
  }

  if (world.name === 'forge') {
    // Heat on the horizon and a broken skyline in front of it.
    const glow = ctx.createLinearGradient(0, horizon - 60, 0, horizon + 10)
    glow.addColorStop(0, alpha(world.accent, 0))
    glow.addColorStop(1, alpha(world.accent, 0.28))
    ctx.fillStyle = glow
    ctx.fillRect(0, horizon - 60, w, 70)

    ctx.fillStyle = mix('#1a1210', world.fog, 0.3)
    let x = 0
    while (x < w) {
      const width = 18 + random() * 40
      const tall = 10 + random() * 34
      ctx.fillRect(x, horizon - tall, width, tall + 3)
      // A gap-toothed top: some of these were towers once.
      if (random() > 0.6) ctx.fillRect(x + width * 0.3, horizon - tall - 8, width * 0.25, 9)
      x += width + random() * 30
    }
  }

  if (world.name === 'matrix') {
    // A nebula, then the floor: a perspective grid converging above the region.
    const nx = w * 0.3
    const ny = horizon * 0.5
    const nebula = ctx.createRadialGradient(nx, ny, 0, nx, ny, w * 0.35)
    nebula.addColorStop(0, alpha(world.accent2, 0.18))
    nebula.addColorStop(0.6, alpha(world.accent, 0.06))
    nebula.addColorStop(1, alpha(world.accent, 0))
    ctx.fillStyle = nebula
    ctx.fillRect(0, 0, w, horizon)

    const vpX = w / 2
    const vpY = horizon - h * 0.55
    ctx.strokeStyle = alpha(world.accent, 0.14)
    ctx.lineWidth = 1
    for (let i = -14; i <= 14; i += 1) {
      const bottomX = vpX + i * (w / 9)
      ctx.beginPath()
      ctx.moveTo(vpX + (bottomX - vpX) * ((horizon - vpY) / (h - vpY)), horizon)
      ctx.lineTo(bottomX, h)
      ctx.stroke()
    }
    for (let k = 0; k < 12; k += 1) {
      const t = (k / 12) ** 2
      const y = horizon + t * (h - horizon)
      ctx.strokeStyle = alpha(world.accent, 0.05 + t * 0.16)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    // The horizon itself glows: this floor is lit from beneath.
    const rim = ctx.createLinearGradient(0, horizon - 14, 0, horizon + 26)
    rim.addColorStop(0, alpha(world.accent, 0))
    rim.addColorStop(0.5, alpha(world.accent, 0.35))
    rim.addColorStop(1, alpha(world.accent, 0))
    ctx.fillStyle = rim
    ctx.fillRect(0, horizon - 14, w, 40)
  }

  // A vignette so the card's edges fall away into darkness.
  const vignette = ctx.createRadialGradient(w / 2, h * 0.55, h * 0.3, w / 2, h * 0.55, w * 0.75)
  vignette.addColorStop(0, 'rgb(0 0 0 / 0)')
  vignette.addColorStop(1, 'rgb(0 0 0 / 0.45)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, w, h)
}

// ----------------------------------------------------------------- scenery

/** How much of the fog a thing at this depth has between it and the eye. */
const fogFor = (depth: number) => 0.55 * (1 - depth) ** 1.6

function poly(ctx: Ctx, points: number[][]) {
  ctx.beginPath()
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
}

function shadow(ctx: Ctx, rx: number, ry: number, a = 0.35) {
  ctx.fillStyle = `rgb(0 0 0 / ${a})`
  ctx.beginPath()
  ctx.ellipse(0, 2, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Paint one piece of scenery with its base at the origin. The caller has
 * already translated, scaled for depth and picked the fog amount.
 */
function paintPiece(ctx: Ctx, p: Placement, world: World, fog: number) {
  const f = (hex: string, extra = 0) => mix(hex, world.fog, Math.min(1, fog + extra))
  const a = world.accent
  const a2 = world.accent2
  const s = p.seed

  switch (p.kind) {
    // ------------------------------------------------------------ forest
    case 'pine': {
      const tiers = 3 + Math.round(s * 1.5)
      shadow(ctx, 16, 5)
      ctx.fillStyle = f('#3a2a1c')
      ctx.fillRect(-3, -6, 6, 10)
      for (let i = 0; i < tiers; i += 1) {
        const y = -6 - i * 16
        const half = 22 - i * 4
        ctx.fillStyle = f('#1f4a34')
        poly(ctx, [[-half, y], [0, y - 22], [0, y]])
        ctx.fill()
        ctx.fillStyle = f('#2f6b46')
        poly(ctx, [[half, y], [0, y - 22], [0, y]])
        ctx.fill()
        // A frosted rim on the lit side.
        ctx.strokeStyle = alpha('#9fd8b0', 0.18 * (1 - fog))
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(half, y)
        ctx.lineTo(0, y - 22)
        ctx.stroke()
      }
      break
    }
    case 'broadleaf': {
      shadow(ctx, 20, 6)
      ctx.fillStyle = f('#3a2a1c')
      ctx.beginPath()
      ctx.moveTo(-4, 0)
      ctx.quadraticCurveTo(-2, -18, -3, -30)
      ctx.lineTo(3, -30)
      ctx.quadraticCurveTo(2, -18, 4, 0)
      ctx.closePath()
      ctx.fill()
      const blobs = [
        [0, -42, 20],
        [-14, -32, 15],
        [15, -34, 14],
        [-4, -26, 12],
      ]
      for (const [x, y, r] of blobs) {
        ctx.fillStyle = f('#25553a')
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const [x, y, r] of blobs) {
        ctx.fillStyle = f('#3d7d52')
        ctx.beginPath()
        ctx.arc(x + r * 0.25, y - r * 0.28, r * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'mushrooms': {
      const stalks = [
        [-8, 0, 7],
        [4, 0, 10],
        [12, 0, 6],
      ]
      for (const [x, y, r] of stalks) {
        ctx.fillStyle = f('#d9d2c2')
        ctx.fillRect(x - 2, y - r, 4, r)
        // The caps glow: this forest is not entirely natural.
        const g = ctx.createRadialGradient(x, y - r, 0, x, y - r, r * 2.4)
        g.addColorStop(0, alpha(a, 0.45 * (1 - fog)))
        g.addColorStop(1, alpha(a, 0))
        ctx.fillStyle = g
        ctx.fillRect(x - r * 2.4, y - r * 3.4, r * 4.8, r * 4.8)
        ctx.fillStyle = f('#b04a3a')
        ctx.beginPath()
        ctx.ellipse(x, y - r, r, r * 0.65, 0, Math.PI, 0)
        ctx.fill()
        ctx.fillStyle = alpha('#ffffff', 0.7)
        ctx.beginPath()
        ctx.arc(x - r * 0.35, y - r - r * 0.25, 1.2, 0, Math.PI * 2)
        ctx.arc(x + r * 0.3, y - r - r * 0.1, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'boulder': {
      shadow(ctx, 18, 5)
      ctx.fillStyle = f('#3a4150')
      poly(ctx, [[-18, 0], [-14, -12], [-4, -18], [10, -16], [17, -6], [15, 0]])
      ctx.fill()
      ctx.fillStyle = f('#525b6d')
      poly(ctx, [[-14, -12], [-4, -18], [10, -16], [4, -10], [-6, -9]])
      ctx.fill()
      ctx.fillStyle = alpha(a, 0.35 * (1 - fog))
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath()
        ctx.arc(-10 + i * 6 + s * 3, -13 + (i % 2) * 3, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'shrine': {
      // Two stone pillars, a lintel, and a hanging lantern that is actually lit.
      shadow(ctx, 40, 8)
      ctx.fillStyle = f('#2b3140')
      ctx.fillRect(-30, -58, 9, 58)
      ctx.fillRect(21, -58, 9, 58)
      ctx.fillStyle = f('#3b4356')
      ctx.fillRect(-38, -66, 76, 7)
      ctx.fillRect(-34, -58, 68, 4)
      ctx.strokeStyle = f('#556078')
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-25, -50)
      ctx.lineTo(-25, -4)
      ctx.moveTo(25, -50)
      ctx.lineTo(25, -4)
      ctx.stroke()
      // Lantern.
      ctx.strokeStyle = f('#1d2130')
      ctx.beginPath()
      ctx.moveTo(0, -58)
      ctx.lineTo(0, -46)
      ctx.stroke()
      const g = ctx.createRadialGradient(0, -38, 2, 0, -38, 34)
      g.addColorStop(0, alpha(a2, 0.6))
      g.addColorStop(1, alpha(a2, 0))
      ctx.fillStyle = g
      ctx.fillRect(-34, -72, 68, 68)
      ctx.fillStyle = f('#f0c86a')
      ctx.fillRect(-5, -46, 10, 14)
      ctx.fillStyle = f('#2b3140')
      ctx.fillRect(-6, -47, 12, 2)
      ctx.fillRect(-6, -32, 12, 2)
      break
    }
    case 'mist': {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 90)
      g.addColorStop(0, alpha('#c9dccf', 0.13))
      g.addColorStop(1, alpha('#c9dccf', 0))
      ctx.fillStyle = g
      ctx.save()
      ctx.scale(1.8, 0.35)
      ctx.beginPath()
      ctx.arc(0, 0, 90, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      break
    }

    // ------------------------------------------------------------- forge
    case 'column': {
      const tall = 44 + s * 26
      shadow(ctx, 12, 4)
      ctx.fillStyle = f('#4a4544')
      ctx.fillRect(-8, -tall, 16, tall)
      ctx.fillStyle = f('#6a6260')
      ctx.fillRect(-8, -tall, 5, tall)
      // Flutes.
      ctx.strokeStyle = f('#3a3534')
      ctx.lineWidth = 1
      for (const x of [-4, 0, 4]) {
        ctx.beginPath()
        ctx.moveTo(x, -tall + 4)
        ctx.lineTo(x, -3)
        ctx.stroke()
      }
      // A broken top, and the base.
      ctx.fillStyle = f('#2e2a2a')
      poly(ctx, [[-9, -tall], [-3, -tall - 6], [2, -tall - 2], [6, -tall - 8], [9, -tall]])
      ctx.fill()
      ctx.fillStyle = f('#5a5452')
      ctx.fillRect(-11, -4, 22, 4)
      break
    }
    case 'arch': {
      shadow(ctx, 36, 7)
      ctx.fillStyle = f('#4a4544')
      ctx.fillRect(-32, -40, 10, 40)
      ctx.fillRect(22, -40, 10, 40)
      ctx.beginPath()
      ctx.arc(0, -40, 32, Math.PI, 0)
      ctx.arc(0, -40, 22, 0, Math.PI, true)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = f('#6a6260')
      ctx.fillRect(-32, -40, 4, 40)
      // Chipped keystone, missing.
      ctx.fillStyle = f(world.sky[1])
      poly(ctx, [[-4, -72], [4, -72], [3, -62], [-3, -62]])
      ctx.fill()
      break
    }
    case 'anvil': {
      shadow(ctx, 20, 5)
      ctx.fillStyle = f('#3d2a1a')
      ctx.fillRect(-10, -12, 20, 12)
      ctx.fillStyle = f('#2a2d33')
      poly(ctx, [[-22, -22], [16, -22], [24, -18], [16, -14], [-14, -14], [-14, -12], [10, -12], [10, -14]])
      ctx.fill()
      ctx.fillStyle = f('#3f434c')
      ctx.fillRect(-22, -25, 38, 4)
      // The face is still hot.
      ctx.strokeStyle = alpha(a, 0.7 * (1 - fog))
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(-20, -25)
      ctx.lineTo(14, -25)
      ctx.stroke()
      break
    }
    case 'gear': {
      const r = 14
      shadow(ctx, r + 2, 4, 0.25)
      ctx.save()
      ctx.translate(0, -r)
      ctx.rotate(s * Math.PI)
      ctx.fillStyle = f('#5b4030')
      ctx.beginPath()
      for (let i = 0; i < 10; i += 1) {
        const a0 = (i / 10) * Math.PI * 2
        const a1 = a0 + 0.3
        const a2r = a0 + 0.63
        ctx.lineTo(Math.cos(a0) * r, Math.sin(a0) * r)
        ctx.lineTo(Math.cos(a1) * (r + 4), Math.sin(a1) * (r + 4))
        ctx.lineTo(Math.cos(a2r) * (r + 4), Math.sin(a2r) * (r + 4))
      }
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = f('#7a5a42')
      ctx.beginPath()
      ctx.arc(0, 0, r - 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = f(world.ground[1])
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      break
    }
    case 'ashheap': {
      const g = ctx.createRadialGradient(0, -4, 2, 0, -4, 30)
      g.addColorStop(0, f('#3a3130'))
      g.addColorStop(1, alpha('#3a3130', 0))
      ctx.fillStyle = g
      ctx.save()
      ctx.scale(1.6, 0.5)
      ctx.beginPath()
      ctx.arc(0, 0, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      // Embers still in it.
      for (let i = 0; i < 6; i += 1) {
        const x = -18 + i * 7 + (s * 5 - 2)
        ctx.fillStyle = alpha(i % 2 ? a : a2, 0.55 * (1 - fog))
        ctx.beginPath()
        ctx.arc(x, -3 - (i % 3), 1.3, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'chimney': {
      const tall = 58 + s * 20
      shadow(ctx, 14, 4)
      ctx.fillStyle = f('#4a3a34')
      ctx.fillRect(-9, -tall, 18, tall)
      ctx.fillStyle = f('#5c4a42')
      ctx.fillRect(-9, -tall, 6, tall)
      ctx.strokeStyle = f('#2f2522')
      ctx.lineWidth = 1
      for (let y = -tall + 6; y < -4; y += 8) {
        ctx.beginPath()
        ctx.moveTo(-9, y)
        ctx.lineTo(9, y)
        ctx.stroke()
      }
      ctx.fillStyle = f('#3a2e2a')
      ctx.fillRect(-11, -tall - 4, 22, 5)
      // Smoke.
      for (let i = 0; i < 4; i += 1) {
        ctx.fillStyle = alpha('#8a7f7a', (0.16 - i * 0.03) * (1 - fog))
        ctx.beginPath()
        ctx.arc(2 + i * 6 * (s > 0.5 ? 1 : -1), -tall - 12 - i * 11, 6 + i * 3, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'furnace': {
      shadow(ctx, 48, 9)
      ctx.fillStyle = f('#3a3130')
      ctx.beginPath()
      ctx.moveTo(-46, 0)
      ctx.lineTo(-46, -30)
      ctx.arc(0, -30, 46, Math.PI, 0)
      ctx.lineTo(46, 0)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = f('#4d423f')
      ctx.beginPath()
      ctx.moveTo(-46, 0)
      ctx.lineTo(-46, -30)
      ctx.arc(0, -30, 46, Math.PI, Math.PI * 1.35)
      ctx.lineTo(-20, 0)
      ctx.closePath()
      ctx.fill()
      // Brick courses.
      ctx.strokeStyle = f('#2a2321')
      ctx.lineWidth = 1
      for (let y = -6; y > -60; y -= 9) {
        ctx.beginPath()
        ctx.moveTo(-44, y)
        ctx.lineTo(44, y)
        ctx.stroke()
      }
      // The mouth, which is the brightest thing in this world.
      const g = ctx.createRadialGradient(0, -14, 2, 0, -14, 60)
      g.addColorStop(0, alpha('#fff1c4', 0.95))
      g.addColorStop(0.18, alpha(a2, 0.9))
      g.addColorStop(0.45, alpha(a, 0.5))
      g.addColorStop(1, alpha(a, 0))
      ctx.fillStyle = g
      ctx.fillRect(-60, -74, 120, 80)
      ctx.fillStyle = '#1a0f0a'
      ctx.beginPath()
      ctx.moveTo(-16, 0)
      ctx.lineTo(-16, -16)
      ctx.arc(0, -16, 16, Math.PI, 0)
      ctx.lineTo(16, 0)
      ctx.closePath()
      ctx.fill()
      const inner = ctx.createRadialGradient(0, -8, 0, 0, -8, 18)
      inner.addColorStop(0, '#fff3cf')
      inner.addColorStop(0.5, a2)
      inner.addColorStop(1, alpha(a, 0.4))
      ctx.fillStyle = inner
      ctx.beginPath()
      ctx.moveTo(-13, 0)
      ctx.lineTo(-13, -16)
      ctx.arc(0, -16, 13, Math.PI, 0)
      ctx.lineTo(13, 0)
      ctx.closePath()
      ctx.fill()
      break
    }

    // ------------------------------------------------------------ matrix
    case 'crystal': {
      const spires = [
        [0, 0, 52, 11, 0],
        [-16, 0, 32, 8, -0.22],
        [15, 0, 38, 8, 0.18],
        [-6, 0, 22, 6, 0.4],
      ]
      const g = ctx.createRadialGradient(0, -20, 4, 0, -20, 62)
      g.addColorStop(0, alpha(a, 0.32 * (1 - fog)))
      g.addColorStop(1, alpha(a, 0))
      ctx.fillStyle = g
      ctx.fillRect(-62, -82, 124, 96)
      shadow(ctx, 22, 5, 0.4)
      for (const [x, y, tall, half, tilt] of spires) {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(tilt)
        ctx.fillStyle = f(mix(world.sky[1], a, 0.25))
        poly(ctx, [[-half, 0], [-half * 0.7, -tall * 0.75], [0, -tall], [0, 0]])
        ctx.fill()
        ctx.fillStyle = f(mix('#ffffff', a, 0.45))
        poly(ctx, [[half, 0], [half * 0.7, -tall * 0.75], [0, -tall], [0, 0]])
        ctx.fill()
        ctx.strokeStyle = alpha('#ffffff', 0.5 * (1 - fog))
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(0, -tall)
        ctx.lineTo(half * 0.7, -tall * 0.75)
        ctx.stroke()
        ctx.restore()
      }
      break
    }
    case 'shard': {
      // Floats: a shadow on the ground, and the thing itself hanging above it.
      const hover = 10 + s * 10
      ctx.fillStyle = `rgb(0 0 0 / ${0.3 * (1 - fog)})`
      ctx.beginPath()
      ctx.ellipse(0, 0, 7, 2.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(0, -hover)
      ctx.rotate((s - 0.5) * 0.9)
      const g = ctx.createRadialGradient(0, -8, 0, 0, -8, 20)
      g.addColorStop(0, alpha(a2, 0.4 * (1 - fog)))
      g.addColorStop(1, alpha(a2, 0))
      ctx.fillStyle = g
      ctx.fillRect(-20, -28, 40, 40)
      ctx.fillStyle = f(mix(world.sky[1], a2, 0.4))
      poly(ctx, [[-4, 0], [0, -18], [0, -2]])
      ctx.fill()
      ctx.fillStyle = f(mix('#ffffff', a2, 0.4))
      poly(ctx, [[4, 0], [0, -18], [0, -2]])
      ctx.fill()
      ctx.restore()
      break
    }
    case 'datapillar': {
      const tall = 60 + s * 30
      shadow(ctx, 10, 3.5, 0.4)
      ctx.fillStyle = f('#0d1030')
      ctx.fillRect(-6, -tall, 12, tall)
      ctx.fillStyle = f('#1b2050')
      ctx.fillRect(-6, -tall, 3, tall)
      // Lines of light running up it, not all lit.
      for (let y = -8; y > -tall + 4; y -= 6) {
        const lit = ((y * 7 + s * 100) | 0) % 5 !== 0
        ctx.fillStyle = lit ? alpha(a, 0.75 * (1 - fog)) : alpha(a, 0.15)
        ctx.fillRect(-4, y, 8, 1.5)
      }
      ctx.fillStyle = f(mix('#ffffff', a, 0.6))
      poly(ctx, [[-7, -tall], [0, -tall - 8], [7, -tall]])
      ctx.fill()
      break
    }
    case 'shelf': {
      // A slab of archive, floating — a bookshelf in a place with no walls.
      const hover = 8
      ctx.fillStyle = `rgb(0 0 0 / ${0.3 * (1 - fog)})`
      ctx.beginPath()
      ctx.ellipse(0, 0, 34, 4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(0, -hover)
      ctx.fillStyle = f('#0f1238')
      ctx.fillRect(-34, -46, 68, 46)
      ctx.strokeStyle = alpha(a, 0.5 * (1 - fog))
      ctx.lineWidth = 1
      ctx.strokeRect(-34, -46, 68, 46)
      for (const row of [-40, -26, -12]) {
        ctx.fillStyle = f('#1a1f5a')
        ctx.fillRect(-32, row, 64, 10)
        let x = -30
        while (x < 30) {
          const wdt = 2 + ((s * 97 + x) % 4)
          ctx.fillStyle = (x / 3) % 2 ? alpha(a, 0.7) : alpha(a2, 0.7)
          ctx.fillRect(x, row + 1, wdt, 8)
          x += wdt + 1.5
        }
      }
      ctx.restore()
      break
    }
    case 'runering': {
      ctx.save()
      ctx.scale(1, 0.38)
      const g = ctx.createRadialGradient(0, 0, 30, 0, 0, 60)
      g.addColorStop(0, alpha(a2, 0))
      g.addColorStop(0.7, alpha(a2, 0.22 * (1 - fog)))
      g.addColorStop(1, alpha(a2, 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(0, 0, 60, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = alpha(a2, 0.65 * (1 - fog))
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, 44, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, 36, 0, Math.PI * 2)
      ctx.stroke()
      for (let i = 0; i < 16; i += 1) {
        const ang = (i / 16) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(ang) * 37, Math.sin(ang) * 37)
        ctx.lineTo(Math.cos(ang) * (i % 2 ? 41 : 43), Math.sin(ang) * (i % 2 ? 41 : 43))
        ctx.stroke()
      }
      ctx.restore()
      break
    }
    case 'monolith': {
      shadow(ctx, 40, 8, 0.5)
      const g = ctx.createRadialGradient(0, -60, 6, 0, -60, 110)
      g.addColorStop(0, alpha(a, 0.4))
      g.addColorStop(1, alpha(a, 0))
      ctx.fillStyle = g
      ctx.fillRect(-110, -170, 220, 200)
      ctx.fillStyle = f('#07082a')
      ctx.fillRect(-26, -122, 52, 122)
      ctx.fillStyle = f('#121650')
      ctx.fillRect(-26, -122, 8, 122)
      ctx.strokeStyle = alpha(a, 0.5)
      ctx.lineWidth = 1
      ctx.strokeRect(-26, -122, 52, 122)
      // The rune column down the centre.
      const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ']
      ctx.fillStyle = alpha('#dff3ff', 0.9)
      ctx.font = '600 9px ui-monospace, monospace'
      ctx.textAlign = 'center'
      runes.forEach((r, i) => ctx.fillText(r, 0, -108 + i * 12))
      ctx.fillStyle = alpha(a, 0.12)
      ctx.fillRect(-9, -116, 18, 112)
      break
    }
  }
}

export function paintScenery(ctx: Ctx, placements: Placement[], world: World) {
  for (const p of placements) {
    const scale = p.scale * (0.5 + 0.62 * p.depth)
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.scale(scale, scale)
    paintPiece(ctx, p, world, fogFor(p.depth))
    ctx.restore()
  }
}

// -------------------------------------------------------------------- path

export function paintPath(ctx: Ctx, path: Path2D, world: World, t: number) {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // A soft channel of light beneath the road.
  ctx.strokeStyle = alpha(world.accent, 0.1)
  ctx.lineWidth = 22
  ctx.stroke(path)

  // The road itself: paler than the ground, so it reads as worn.
  ctx.strokeStyle = alpha(mix(world.ground[0], '#ffffff', 0.18), 0.85)
  ctx.lineWidth = 8
  ctx.stroke(path)
  ctx.strokeStyle = alpha(world.ground[1], 0.5)
  ctx.lineWidth = 1
  ctx.stroke(path)

  // Runic light travelling along it.
  ctx.strokeStyle = alpha(world.accent, 0.75)
  ctx.lineWidth = 2
  ctx.setLineDash([5, 13])
  ctx.lineDashOffset = -t * 18
  ctx.stroke(path)
  ctx.restore()
}

// ------------------------------------------------------------------ auras

const AURA: Record<ProjectStatus, string | null> = {
  passed: '#4ade80',
  open: null, // the world's own accent2
  locked: null,
}

export function paintAuras(
  ctx: Ctx,
  nodes: Point[],
  statuses: ProjectStatus[],
  current: number,
  world: World,
  t: number,
) {
  nodes.forEach((node, i) => {
    const status = statuses[i]
    if (status === 'locked') {
      // A dark pool: something is here, and it is not yet yours.
      const g = ctx.createRadialGradient(node.x, node.y + 6, 4, node.x, node.y + 6, 34)
      g.addColorStop(0, 'rgb(0 0 0 / 0.35)')
      g.addColorStop(1, 'rgb(0 0 0 / 0)')
      ctx.fillStyle = g
      ctx.fillRect(node.x - 34, node.y - 28, 68, 68)
      return
    }
    const colour = AURA[status] ?? world.accent2
    const pulse = status === 'open' ? 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.7) : 0.35
    const radius = (i === current ? 62 : 46) + pulse * 10
    const g = ctx.createRadialGradient(node.x, node.y + 8, 2, node.x, node.y + 8, radius)
    g.addColorStop(0, alpha(colour, 0.32 + pulse * 0.2))
    g.addColorStop(0.5, alpha(colour, 0.1))
    g.addColorStop(1, alpha(colour, 0))
    ctx.fillStyle = g
    ctx.fillRect(node.x - radius, node.y + 8 - radius, radius * 2, radius * 2)

    // A ring of light on the floor beneath the current node.
    if (i === current) {
      ctx.save()
      ctx.translate(node.x, node.y + 24)
      ctx.scale(1, 0.36)
      ctx.strokeStyle = alpha(colour, 0.55 + pulse * 0.3)
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, 40 + pulse * 6, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  })
}

// -------------------------------------------------------------- particles

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  phase: number
  /** Ambient particles drift; aura particles orbit a node. */
  orbit?: { node: number; radius: number; angle: number; speed: number }
}

export class ParticleField {
  private particles: Particle[] = []
  private random: () => number
  private world: World
  private w: number
  private h: number

  constructor(world: World, w: number, h: number, seed: number) {
    this.world = world
    this.w = w
    this.h = h
    this.random = mulberry32(seed ^ 0x9e3779b9)
    const count = Math.round((w * h) / 100000 * world.density * 10)
    for (let i = 0; i < count; i += 1) this.particles.push(this.spawn(true))
  }

  private spawn(anywhere = false): Particle {
    const r = this.random
    const horizon = this.h * this.world.horizon
    const base = {
      life: 0,
      max: 4 + r() * 6,
      size: 1 + r() * 1.8,
      phase: r() * Math.PI * 2,
    }
    switch (this.world.particles) {
      case 'ember':
        return {
          ...base,
          x: r() * this.w,
          y: anywhere ? horizon + r() * (this.h - horizon) : this.h + 4,
          vx: (r() - 0.5) * 10,
          vy: -14 - r() * 22,
        }
      case 'glyph':
        return {
          ...base,
          x: r() * this.w,
          y: horizon * 0.4 + r() * (this.h - horizon * 0.4),
          vx: (r() - 0.5) * 8,
          vy: -3 - r() * 6,
          size: 2 + r() * 2.5,
        }
      default:
        return {
          ...base,
          x: r() * this.w,
          y: horizon + r() * (this.h - horizon),
          vx: (r() - 0.5) * 12,
          vy: (r() - 0.5) * 8,
        }
    }
  }

  /** Keep a small orbit of motes around every unlocked node. */
  syncAuras(nodes: Point[], statuses: ProjectStatus[]) {
    const wanted = new Map<number, number>()
    statuses.forEach((status, i) => {
      if (status !== 'locked') wanted.set(i, status === 'open' ? 7 : 4)
    })
    const have = new Map<number, number>()
    this.particles = this.particles.filter((p) => {
      if (!p.orbit) return true
      const want = wanted.get(p.orbit.node) ?? 0
      const count = have.get(p.orbit.node) ?? 0
      if (count >= want) return false
      have.set(p.orbit.node, count + 1)
      return true
    })
    for (const [node, want] of wanted) {
      for (let i = have.get(node) ?? 0; i < want; i += 1) {
        const r = this.random
        this.particles.push({
          x: nodes[node].x,
          y: nodes[node].y,
          vx: 0,
          vy: 0,
          life: 0,
          max: Infinity,
          size: 1.2 + r() * 1.4,
          phase: r() * Math.PI * 2,
          orbit: {
            node,
            radius: 24 + r() * 16,
            angle: r() * Math.PI * 2,
            speed: (0.5 + r() * 0.7) * (r() > 0.5 ? 1 : -1),
          },
        })
      }
    }
  }

  step(dt: number, nodes: Point[]) {
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i]
      p.life += dt
      if (p.orbit) {
        p.orbit.angle += p.orbit.speed * dt
        const node = nodes[p.orbit.node]
        const wobble = Math.sin(p.life * 2 + p.phase) * 4
        p.x = node.x + Math.cos(p.orbit.angle) * (p.orbit.radius + wobble)
        p.y = node.y + Math.sin(p.orbit.angle) * (p.orbit.radius + wobble) * 0.55 - 6
        continue
      }
      if (this.world.particles === 'firefly') {
        // Fireflies wander rather than travel.
        p.vx += Math.sin(p.life * 1.3 + p.phase) * 6 * dt
        p.vy += Math.cos(p.life * 1.1 + p.phase) * 4 * dt
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.life > p.max || p.y < -6 || p.y > this.h + 6 || p.x < -6 || p.x > this.w + 6) {
        this.particles[i] = this.spawn()
      }
    }
  }

  paint(ctx: Ctx, t: number) {
    const world = this.world
    for (const p of this.particles) {
      if (p.orbit) {
        const blink = 0.55 + 0.45 * Math.sin(t * 3 + p.phase)
        ctx.fillStyle = alpha(world.accent2, blink * 0.9)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        continue
      }
      const fade = Math.min(1, p.life / 0.8, (p.max - p.life) / 1.2)
      switch (world.particles) {
        case 'firefly': {
          const blink = Math.max(0, Math.sin(t * 1.6 + p.phase)) ** 3
          const a = fade * blink
          if (a < 0.02) break
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          g.addColorStop(0, alpha(world.accent, a))
          g.addColorStop(1, alpha(world.accent, 0))
          ctx.fillStyle = g
          ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8)
          ctx.fillStyle = alpha('#f4ffd8', a)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2)
          ctx.fill()
          break
        }
        case 'ember': {
          const heat = 1 - p.life / p.max
          ctx.fillStyle = alpha(heat > 0.5 ? world.accent2 : world.accent, fade * (0.4 + heat * 0.6))
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (0.5 + heat * 0.6), 0, Math.PI * 2)
          ctx.fill()
          break
        }
        case 'glyph': {
          const a = fade * (0.35 + 0.35 * Math.sin(t * 2 + p.phase))
          ctx.strokeStyle = alpha(p.phase > Math.PI ? world.accent : world.accent2, a)
          ctx.lineWidth = 1
          const s = p.size
          ctx.beginPath()
          // Tiny glyphs: a cross, a bracket, a tick — the archive's alphabet.
          if (p.phase < 2) {
            ctx.moveTo(p.x - s, p.y)
            ctx.lineTo(p.x + s, p.y)
            ctx.moveTo(p.x, p.y - s)
            ctx.lineTo(p.x, p.y + s)
          } else if (p.phase < 4) {
            ctx.moveTo(p.x + s * 0.6, p.y - s)
            ctx.lineTo(p.x - s * 0.4, p.y - s)
            ctx.lineTo(p.x - s * 0.4, p.y + s)
            ctx.lineTo(p.x + s * 0.6, p.y + s)
          } else {
            ctx.moveTo(p.x - s, p.y)
            ctx.lineTo(p.x - s * 0.2, p.y + s * 0.8)
            ctx.lineTo(p.x + s, p.y - s)
          }
          ctx.stroke()
          break
        }
      }
    }
  }
}
