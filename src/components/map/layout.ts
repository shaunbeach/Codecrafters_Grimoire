export interface Point {
  x: number
  y: number
}

export interface Layout {
  points: Point[]
  path: string
  width: number
  height: number
}

/**
 * Lay nodes out on a serpentine and draw a smooth path through them.
 *
 * Computed rather than hand-placed on purpose: seventeen regions of tuned
 * coordinates would be a hundred-odd magic numbers that break the moment a
 * project is added or reordered.
 */
export function serpentine(
  count: number,
  {
    perRow = 5,
    stepX = 168,
    stepY = 152,
    padX = 84,
    padY = 78,
    /** Regions are cards of a common width; a two-node region should still
     *  fill one rather than huddling in the left-hand corner. */
    minWidth = 900,
    minHeight = 210,
  } = {},
): Layout {
  const columns = Math.min(count, perRow)
  const rows = Math.ceil(count / perRow)

  const naturalWidth = padX * 2 + Math.max(0, columns - 1) * stepX
  const width = Math.max(naturalWidth, minWidth)
  // Spread the nodes over whatever width we ended up with, so a short region is
  // a wide landscape with a few landmarks rather than a cramped strip.
  const spacing = columns > 1 ? (width - padX * 2) / (columns - 1) : 0
  const originX = columns > 1 ? padX : width / 2

  // The path should wander through the landscape rather than rule a line across
  // it. Amplitude scales with how far apart the nodes are, and is capped so the
  // labels never reach the row below.
  const wave = Math.min(26, spacing * 0.11)

  const points: Point[] = []
  for (let index = 0; index < count; index += 1) {
    const row = Math.floor(index / perRow)
    const column = index % perRow
    // Odd rows run right-to-left, so the path reads as one continuous line.
    // The reversal is over the full row width, not over however many nodes
    // happen to be left: a short final row belongs under the end of the row
    // above it, otherwise the path cuts a long diagonal back across the card.
    const position = row % 2 === 0 ? column : perRow - 1 - column
    points.push({
      x: originX + position * spacing,
      y: padY + row * stepY + Math.sin(index * 1.3 + row) * wave,
    })
  }

  return {
    points,
    path: smoothPath(points),
    width,
    height: Math.max(padY * 2 + Math.max(0, rows - 1) * stepY, minHeight),
  }
}

/** Catmull-Rom through the points, converted to cubic beziers. */
export function smoothPath(points: Point[]): string {
  if (points.length < 2) return ''

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const previous = points[i - 1] ?? points[i]
    const start = points[i]
    const end = points[i + 1]
    const next = points[i + 2] ?? end

    const c1 = { x: start.x + (end.x - previous.x) / 6, y: start.y + (end.y - previous.y) / 6 }
    const c2 = { x: end.x - (next.x - start.x) / 6, y: end.y - (next.y - start.y) / 6 }

    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${end.x} ${end.y}`
  }

  return d
}
