import { useMemo, useState } from 'react'
import type { StageArtifact } from '../../runner/types'

interface SheetPreview {
  name: string
  columns: string[]
  rows: Array<Array<string | number>>
  totalRows: number
  totalCols: number
  changedCells: string[]
}

/**
 * A real spreadsheet grid, decoded by openpyxl in the worker and shipped as
 * JSON.
 *
 * The cell highlighting is the point. "sales.xlsx was modified" tells a learner
 * nothing; "you wrote D2, D3, D4 and E1" tells them whether their loop covered
 * the rows they meant it to.
 */
export function SheetRenderer({ artifact }: { artifact: StageArtifact; blobUrl?: string }) {
  const { sheets, isNew } = artifact.preview as unknown as {
    sheets: SheetPreview[]
    isNew: boolean
  }
  const [active, setActive] = useState(0)

  const sheet = sheets?.[active]
  const changed = useMemo(() => new Set(sheet?.changedCells ?? []), [sheet])

  if (!sheet) {
    return <p className="text-[13px] text-ink-300">This workbook has no sheets.</p>
  }

  const width = Math.max(sheet.columns.length, ...sheet.rows.map((row) => row.length), 1)
  const columns = Array.from(
    { length: width },
    (_, index) => sheet.columns[index] ?? columnLetter(index),
  )

  return (
    <div className="flex flex-col gap-3">
      {sheets.length > 1 && (
        <div role="tablist" aria-label="Sheets" className="flex flex-wrap gap-1">
          {sheets.map((entry, index) => (
            <button
              key={entry.name}
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11.5px] transition-colors ${
                index === active
                  ? 'border-amber-glow/50 bg-amber-glow/10 text-amber-glow'
                  : 'border-ink-600 text-ink-300 hover:text-ink-100'
              }`}
            >
              {entry.name}
              {entry.changedCells.length > 0 && (
                <span className="ml-1.5 text-[10px] text-jade">
                  {entry.changedCells.length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-80 overflow-auto rounded-lg border border-ink-700">
        <table className="border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-20 border-r border-b border-ink-600 bg-ink-800 px-2 py-1" />
              {columns.map((letter) => (
                <th
                  key={letter}
                  className="sticky top-0 z-10 min-w-[76px] border-r border-b border-ink-600 bg-ink-800 px-3 py-1 text-center font-mono text-[10px] font-medium text-ink-300"
                >
                  {letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-b border-ink-700 bg-ink-800 px-2 py-1 text-right font-mono text-[10px] font-medium text-ink-400 tabular-nums"
                >
                  {rowIndex + 1}
                </th>
                {columns.map((letter, columnIndex) => {
                  const value = row[columnIndex]
                  const reference = `${letter}${rowIndex + 1}`
                  const isChanged = changed.has(reference)
                  const numeric = typeof value === 'number'

                  return (
                    <td
                      key={reference}
                      title={isChanged ? `${reference} — written by your code` : reference}
                      className={`border-r border-b border-ink-800 px-3 py-1 font-mono whitespace-nowrap ${
                        numeric ? 'text-right tabular-nums' : 'text-left'
                      } ${
                        isChanged
                          ? 'bg-jade/15 text-jade ring-1 ring-jade/40 ring-inset'
                          : 'text-ink-100'
                      }`}
                    >
                      {value === undefined || value === '' ? (
                        <span className="text-ink-600">·</span>
                      ) : (
                        String(value)
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-300">
        <span>
          {sheet.totalRows} × {sheet.totalCols}
        </span>
        {sheet.rows.length < sheet.totalRows && (
          <span>showing first {sheet.rows.length} rows</span>
        )}
        {isNew ? (
          <span className="text-jade">new workbook</span>
        ) : changed.size > 0 ? (
          <span className="flex items-center gap-1.5 text-jade">
            <span aria-hidden className="inline-block size-2.5 rounded-sm bg-jade/40" />
            {changed.size} cell{changed.size === 1 ? '' : 's'} written by your code
          </span>
        ) : (
          <span>no cells changed</span>
        )}
      </p>
    </div>
  )
}

function columnLetter(index: number): string {
  let letters = ''
  let n = index
  do {
    letters = String.fromCharCode(65 + (n % 26)) + letters
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return letters
}
