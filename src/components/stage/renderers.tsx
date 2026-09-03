import type { StageArtifact } from '../../runner/types'
import { SheetRenderer } from './SheetRenderer'

/**
 * How a changed file is shown. Everything except an image arrives already
 * decoded from Python, so these components render structure, not bytes.
 */

interface RendererProps {
  artifact: StageArtifact
  blobUrl?: string
}

const bytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`

export function ImageRenderer({ artifact, blobUrl }: RendererProps) {
  const { width, height, mode } = artifact.preview as unknown as { width: number; height: number; mode: string }

  if (!blobUrl) {
    return <p className="text-ink-300 text-xs">The image was too large to display.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center justify-center rounded-lg border border-ink-700 p-4"
        style={{
          // A checkerboard, so transparency reads as transparency.
          backgroundImage:
            'linear-gradient(45deg, #1a1f2a 25%, transparent 25%), linear-gradient(-45deg, #1a1f2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1f2a 75%), linear-gradient(-45deg, transparent 75%, #1a1f2a 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
        }}
      >
        <img
          src={blobUrl}
          alt={`Output image ${artifact.title}, ${width} by ${height} pixels`}
          className="max-h-72 max-w-full object-contain"
          style={{ imageRendering: width < 120 ? 'pixelated' : 'auto' }}
        />
      </div>
      <p className="font-mono text-[11px] text-ink-300">
        {width} × {height} · {mode} · {bytes(artifact.bytes)}
      </p>
    </div>
  )
}

export function TextRenderer({ artifact }: RendererProps) {
  const { head, lineCount, truncated } = artifact.preview as unknown as {
    head: string
    lineCount: number
    truncated: boolean
  }

  if (artifact.change === 'deleted') {
    return <p className="text-ink-300 text-xs italic">This file was deleted.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <pre className="max-h-64 overflow-auto rounded-lg border border-ink-700 bg-ink-950 p-3 font-mono text-[12px] leading-relaxed text-ink-100 whitespace-pre-wrap break-words">
        {head || <span className="text-ink-400 italic">(empty)</span>}
      </pre>
      <p className="font-mono text-[11px] text-ink-300">
        {lineCount} line{lineCount === 1 ? '' : 's'} · {bytes(artifact.bytes)}
        {truncated && ' · truncated'}
      </p>
    </div>
  )
}

export function TableRenderer({ artifact }: RendererProps) {
  const { columns, rows, totalRows } = artifact.preview as unknown as {
    columns: string[]
    rows: string[][]
    totalRows: number
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="max-h-64 overflow-auto rounded-lg border border-ink-700">
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 bg-ink-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border-b border-ink-600 px-3 py-2 text-left font-mono text-[10px] tracking-wider text-ink-300 uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-ink-850">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-ink-800 px-3 py-1.5 font-mono text-ink-100 tabular-nums"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-mono text-[11px] text-ink-300">
        {totalRows} row{totalRows === 1 ? '' : 's'}
        {rows.length < totalRows && ` · showing first ${rows.length}`}
      </p>
    </div>
  )
}

export function JsonRenderer({ artifact }: RendererProps) {
  const { value } = artifact.preview as unknown as { value: unknown }
  return (
    <pre className="max-h-64 overflow-auto rounded-lg border border-ink-700 bg-ink-950 p-3 font-mono text-[12px] leading-relaxed text-ink-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

export function BinaryRenderer({ artifact }: RendererProps) {
  const { hexHead, note } = artifact.preview as unknown as { hexHead: string; note?: string }
  return (
    <div className="flex flex-col gap-2">
      {note && <p className="text-rust text-xs">{note}</p>}
      <pre className="overflow-x-auto rounded-lg border border-ink-700 bg-ink-950 p-3 font-mono text-[11px] text-ink-300">
        {(hexHead.match(/.{1,2}/g) ?? []).join(' ')}
      </pre>
      <p className="font-mono text-[11px] text-ink-300">{bytes(artifact.bytes)}</p>
    </div>
  )
}

/** Kinds we have not built a view for yet still say something useful. */
export function PlaceholderRenderer({ artifact }: RendererProps) {
  return (
    <p className="text-ink-300 text-xs">
      A <span className="font-mono text-ink-100">{artifact.kind}</span> was produced (
      {bytes(artifact.bytes)}). Its viewer arrives with the module that needs it.
    </p>
  )
}

export const RENDERERS: Record<string, (props: RendererProps) => React.ReactElement> = {
  image: ImageRenderer,
  sheet: SheetRenderer,
  text: TextRenderer,
  table: TableRenderer,
  json: JsonRenderer,
  binary: BinaryRenderer,
}

export function rendererFor(kind: string) {
  return RENDERERS[kind] ?? PlaceholderRenderer
}
