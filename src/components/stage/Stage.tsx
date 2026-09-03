import { useEffect, useMemo, useRef, useState } from 'react'
import type { RunReport, ScriptReport, StageBlobs, StageArtifact } from '../../runner/types'
import { useStageBlobs } from './useStageBlobs'
import { rendererFor } from './renderers'
import { onTabKeys, roving } from '../tabs'

export type StageTab = 'console' | 'files' | 'tests'
const STAGE_TABS: StageTab[] = ['console', 'files', 'tests']
export type RunState = 'idle' | 'booting' | 'running' | 'done'

interface Props {
  state: RunState
  status: string
  /** The last thing that ran, whichever button started it. */
  report: RunReport | ScriptReport | null
  blobs: StageBlobs | null
  error: string | null
  /** 'check' shows the Tests tab first; 'run' shows the project's own tab. */
  lastAction: 'run' | 'check' | null
  preferredTab: StageTab
  /** Output streamed so far this run — shown live, before the report lands. */
  liveOutput: string
  /** True while the program is parked waiting for a typed line. */
  awaitingInput: boolean
  onSubmitInput: (line: string) => void
  onEndInput: () => void
  onStop: () => void
  /** False when the page is not cross-origin isolated. */
  canBlockForInput: boolean
}

const CHANGE_STYLES: Record<string, string> = {
  created: 'text-jade border-jade/40 bg-jade/10',
  modified: 'text-amber-glow border-amber-glow/40 bg-amber-glow/10',
  deleted: 'text-rust border-rust/40 bg-rust/10',
  emitted: 'text-scry border-scry/40 bg-scry/10',
}

function isRunReport(report: RunReport | ScriptReport | null): report is RunReport {
  return Boolean(report && 'tests' in report)
}

function ArtifactCard({ artifact, blobUrl }: { artifact: StageArtifact; blobUrl?: string }) {
  const Renderer = rendererFor(artifact.kind)

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-850">
      <div className="flex items-center gap-3 border-b border-ink-700 px-4 py-2.5">
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${
            CHANGE_STYLES[artifact.change] ?? 'text-ink-300 border-ink-600'
          }`}
        >
          {artifact.change}
        </span>
        <span className="truncate font-mono text-[12.5px] text-ink-50">
          {artifact.path ?? artifact.title}
        </span>
        <span className="ml-auto font-mono text-[10px] text-ink-400">{artifact.kind}</span>
      </div>
      <div className="p-4">
        <Renderer artifact={artifact} blobUrl={blobUrl} />
      </div>
    </div>
  )
}

export function Stage({
  state,
  status,
  report,
  blobs,
  error,
  lastAction,
  preferredTab,
  liveOutput,
  awaitingInput,
  onSubmitInput,
  onEndInput,
  onStop,
  canBlockForInput,
}: Props) {
  const urls = useStageBlobs(blobs)
  const [tab, setTab] = useState<StageTab>('console')
  const [pinned, setPinned] = useState(false)

  const artifacts = report?.stage?.artifacts ?? []
  const skipped = report?.stage?.skipped ?? []
  const notes = report?.stage?.notes ?? []
  const tests = isRunReport(report) ? report.tests : []

  // After a run, open the tab that shows what actually happened.
  //
  // Check overrides a pinned tab: asking to be graded is an explicit request
  // for the verdict, so burying it behind whatever tab you last clicked would
  // be perverse. Run respects the pin, because that is the button you press
  // repeatedly while watching one particular thing.
  useEffect(() => {
    if (state !== 'done' || !report) return

    if (lastAction === 'check') {
      setTab(report.fatal ? 'console' : 'tests')
      setPinned(false)
      return
    }

    if (pinned) return
    setTab(artifacts.length ? preferredTab : 'console')
  }, [state, report, lastAction, preferredTab, pinned, artifacts.length])

  const counts = useMemo(
    () => ({
      files: artifacts.length,
      tests: tests.length,
      failing: tests.filter((test) => !test.passed).length,
    }),
    [artifacts.length, tests],
  )

  const busy = state === 'booting' || state === 'running'
  const [typed, setTyped] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const tailRef = useRef<HTMLDivElement>(null)

  // Being asked a question and having to go and find the box is a small
  // indignity; focus it the moment the program blocks.
  useEffect(() => {
    if (awaitingInput) {
      setTab('console')
      inputRef.current?.focus()
    }
  }, [awaitingInput])

  useEffect(() => {
    tailRef.current?.scrollIntoView({ block: 'end' })
  }, [liveOutput, awaitingInput])

  const submit = () => {
    onSubmitInput(typed)
    setTyped('')
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-950">
      <div role="tablist" aria-label="Output" aria-orientation="horizontal" className="flex shrink-0 border-b border-ink-700">
        {(
          [
            ['console', 'Console', null],
            ['files', 'Files', counts.files || null],
            ['tests', 'Tests', counts.tests || null],
          ] as Array<[StageTab, string, number | null]>
        ).map(([id, label, count]) => (
          <button
            key={id}
            {...roving(tab === id)}
            id={`stage-tab-${id}`}
            aria-selected={tab === id}
            // Only the open panel exists in the DOM, so only the selected tab
            // can honestly claim to control one.
            aria-controls={tab === id ? `stage-panel-${id}` : undefined}
            onClick={() => {
              setTab(id)
              setPinned(true)
            }}
            onKeyDown={onTabKeys(STAGE_TABS, tab, (next) => {
              setTab(next)
              setPinned(true)
            })}
            className={`flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-medium transition-colors ${
              tab === id
                ? 'border-b-2 border-amber-glow text-ink-50'
                : 'border-b-2 border-transparent text-ink-300 hover:text-ink-100'
            }`}
          >
            {label}
            {count !== null && (
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  id === 'tests' && counts.failing
                    ? 'bg-rust/15 text-rust'
                    : 'bg-ink-700 text-ink-200'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {busy && !liveOutput && !awaitingInput ? (
          <div className="flex items-center gap-3 text-[13px] text-ink-200">
            <span
              aria-hidden
              className="size-3.5 animate-spin rounded-full border-2 border-ink-600 border-t-amber-glow"
            />
            {status}
          </div>
        ) : error ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] font-semibold text-rust">Could not run your code</p>
            <pre className="rounded-lg border border-rust/25 bg-rust/5 p-3 font-mono text-[12px] whitespace-pre-wrap text-rust">
              {error}
            </pre>
          </div>
        ) : (
          <>
            {tab === 'console' && (
              <div
                role="tabpanel"
                id="stage-panel-console"
                aria-labelledby="stage-tab-console"
                tabIndex={0}
                className="flex flex-col gap-3"
              >
                {report?.fatal && (
                  <>
                    <p className="text-[13px] font-semibold text-rust">
                      {report.fatal.headline}
                    </p>
                    {report.fatal.traceback && (
                      <pre className="overflow-x-auto rounded-lg border border-rust/25 bg-rust/5 p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-rust">
                        {report.fatal.traceback}
                      </pre>
                    )}
                  </>
                )}

                {(() => {
                  // While a program is running, what it has printed so far is
                  // the only thing that can be shown. Once it finishes, the
                  // report is authoritative.
                  const text = busy || awaitingInput ? liveOutput : (report?.stdout ?? '')

                  if (!text.trim() && !awaitingInput) {
                    return (
                      !report?.fatal && (
                        <p className="text-[13px] text-ink-300">
                          {report
                            ? 'Your program printed nothing.'
                            : 'Press Run to execute your code, or Check to grade it.'}
                        </p>
                      )
                    )
                  }

                  return (
                    <div className="rounded-lg border border-ink-700 bg-ink-950 p-3">
                      <pre className="overflow-x-auto font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink-100">
                        {text.replace(/\n+$/, '')}
                      </pre>

                      {awaitingInput && (
                        <form
                          className="mt-2 flex items-center gap-2 border-t border-ink-800 pt-2"
                          onSubmit={(event) => {
                            event.preventDefault()
                            submit()
                          }}
                        >
                          <span aria-hidden className="font-mono text-[12.5px] text-jade">
                            &gt;
                          </span>
                          <input
                            ref={inputRef}
                            value={typed}
                            onChange={(event) => setTyped(event.target.value)}
                            aria-label="Your program is waiting for input"
                            autoComplete="off"
                            spellCheck={false}
                            className="flex-1 bg-transparent font-mono text-[12.5px] text-ink-50 outline-none"
                          />
                          <button
                            type="submit"
                            className="rounded border border-jade/40 px-2 py-0.5 font-mono text-[10.5px] text-jade hover:bg-jade/10"
                          >
                            Enter
                          </button>
                          <button
                            type="button"
                            onClick={onEndInput}
                            title="Send end-of-input, as Ctrl+D would"
                            className="rounded border border-ink-600 px-2 py-0.5 font-mono text-[10.5px] text-ink-300 hover:text-ink-100"
                          >
                            EOF
                          </button>
                          <button
                            type="button"
                            onClick={onStop}
                            className="rounded border border-rust/40 px-2 py-0.5 font-mono text-[10.5px] text-rust hover:bg-rust/10"
                          >
                            Stop
                          </button>
                        </form>
                      )}
                      <div ref={tailRef} />
                    </div>
                  )
                })()}

                {!canBlockForInput && (
                  <p className="rounded-lg border border-amber-glow/25 bg-amber-glow/5 p-2.5 text-[12px] text-amber-glow">
                    This browser cannot pause a program mid-run, so any input a
                    project needs has to be supplied before you press Run.
                  </p>
                )}

                {notes.map((note, index) => (
                  <p key={index} className="text-[12px] text-scry">
                    {note}
                  </p>
                ))}
              </div>
            )}

            {tab === 'files' && (
              <div
                role="tabpanel"
                id="stage-panel-files"
                aria-labelledby="stage-tab-files"
                tabIndex={0}
                className="flex flex-col gap-3"
              >
                {artifacts.length === 0 ? (
                  <p className="text-[13px] text-ink-300">
                    Your program did not create, change or delete any files.
                  </p>
                ) : (
                  artifacts.map((artifact) => (
                    <ArtifactCard
                      key={artifact.id}
                      artifact={artifact}
                      blobUrl={artifact.blob ? urls[artifact.blob.id] : undefined}
                    />
                  ))
                )}

                {skipped.length > 0 && (
                  <p className="font-mono text-[11px] text-ink-400">
                    {skipped.length} file{skipped.length === 1 ? '' : 's'} not shown (
                    {skipped[0].reason === 'too-big' ? 'too large to preview' : 'too many changes'})
                  </p>
                )}
              </div>
            )}

            {tab === 'tests' && (
              <div
                role="tabpanel"
                id="stage-panel-tests"
                aria-labelledby="stage-tab-tests"
                tabIndex={0}
                className="flex flex-col gap-2.5"
              >
                {tests.length === 0 ? (
                  <p className="text-[13px] text-ink-300">
                    Nothing has been graded yet. Press Check when you are ready.
                  </p>
                ) : (
                  tests.map((test, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-2.5">
                        <span
                          aria-hidden
                          className={`w-3 shrink-0 font-mono font-bold ${
                            test.passed ? 'text-jade' : 'text-rust'
                          }`}
                        >
                          {test.passed ? '✓' : '✗'}
                        </span>
                        <span
                          className={`text-[13px] leading-snug ${
                            test.passed ? 'text-ink-200' : 'text-ink-50'
                          }`}
                        >
                          <span className="sr-only">{test.passed ? 'Passed: ' : 'Failed: '}</span>
                          {test.name}
                        </span>
                      </div>
                      {!test.passed && test.message && (
                        <pre className="ml-[22px] rounded-lg border-l-2 border-rust/50 bg-rust/5 p-2.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-rust">
                          {test.message}
                        </pre>
                      )}
                      {!test.passed && test.traceback && (
                        <pre className="ml-[22px] overflow-x-auto rounded-lg border border-rust/20 bg-rust/5 p-2.5 font-mono text-[11.5px] whitespace-pre-wrap text-rust/90">
                          {test.traceback}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
