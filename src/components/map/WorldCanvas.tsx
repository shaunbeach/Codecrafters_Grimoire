import { useEffect, useRef } from 'react'
import type { ProjectStatus } from '../../course'
import type { Layout } from './layout'
import { ParticleField, paintAuras, paintBackdrop, paintPath, paintScenery } from './paint'
import { populate, seedFrom, type World } from './world'

interface Props {
  moduleId: string
  world: World
  layout: Layout
  statuses: ProjectStatus[]
  /** Index of the node the learner is standing on, or -1. */
  current: number
}

/**
 * The living picture beneath a region's nodes.
 *
 * Static layers — sky, ground, scenery in three bands of depth — are painted
 * once into offscreen canvases. Each frame composites them with a parallax
 * offset that follows the pointer, then draws the things that actually move:
 * the light travelling the path, the pulse under each open node, and the
 * particles. The static work is the expensive part, and it is never redone.
 *
 * Nothing here is interactive. The nodes are real buttons layered on top, so
 * a screen reader or keyboard never has to know this canvas exists.
 */
export function WorldCanvas({ moduleId, world, layout, statuses, current }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  // Live values the animation loop reads without restarting.
  const live = useRef({ statuses, current })
  useEffect(() => {
    live.current = { statuses, current }
  }, [statuses, current])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const host = canvas.parentElement
    const ctx = canvas.getContext('2d')
    if (!ctx || !host) return

    const { width: w, height: h, points } = layout
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const seed = seedFrom(moduleId)
    const scenery = populate(moduleId, world, w, h, points)

    // Bands of depth, each its own layer so it can slide independently.
    const layer = (filter: (depth: number) => boolean, backdrop = false) => {
      const off = document.createElement('canvas')
      off.width = w * dpr
      off.height = h * dpr
      const c = off.getContext('2d')!
      c.scale(dpr, dpr)
      if (backdrop) paintBackdrop(c, world, w, h, seed)
      paintScenery(c, scenery.filter((p) => filter(p.depth)), world)
      return off
    }
    const far = layer((d) => d < 0.34, true)
    const mid = layer((d) => d >= 0.34 && d < 0.68)
    const near = layer((d) => d >= 0.68)

    const path = new Path2D(layout.path)
    const particles = new ParticleField(world, w, h, seed)

    // Parallax: the pointer's position over the card, eased.
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    const onMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()
      target.x = (event.clientX - box.left) / box.width - 0.5
      target.y = (event.clientY - box.top) / box.height - 0.5
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
    }

    let last = performance.now()
    let start = last
    let frame = 0
    let visible = true

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = (now - start) / 1000
      const { statuses: st, current: cur } = live.current

      eased.x += (target.x - eased.x) * 0.08
      eased.y += (target.y - eased.y) * 0.08

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      // Far things barely move; near things slide the most. Slightly overdrawn
      // (the layers are painted 1:1) so an edge never shows — the vignette in
      // the backdrop hides the small overscan.
      const slide = (depth: number) => ({
        x: -eased.x * depth * 22,
        y: -eased.y * depth * 12,
      })
      const f = slide(0.25)
      ctx.drawImage(far, f.x, f.y, w, h)
      const m = slide(0.6)
      ctx.drawImage(mid, m.x, m.y, w, h)

      paintPath(ctx, path, world, still ? 0 : t)
      paintAuras(ctx, points, st, cur, world, still ? 0 : t)

      const n = slide(1)
      ctx.drawImage(near, n.x, n.y, w, h)

      particles.syncAuras(points, st)
      if (!still) particles.step(dt, points)
      particles.paint(ctx, still ? 0 : t)
    }

    if (still) {
      // One frame, then stillness — the picture, without the motion.
      particles.step(2, points)
      draw(performance.now())
      return
    }

    const loop = (now: number) => {
      if (visible && !document.hidden) draw(now)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    // A region scrolled off screen costs nothing.
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) last = start = performance.now() - (last - start)
    })
    watcher.observe(host)

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      watcher.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [moduleId, world, layout])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0"
      style={{ width: layout.width, height: layout.height }}
    />
  )
}
