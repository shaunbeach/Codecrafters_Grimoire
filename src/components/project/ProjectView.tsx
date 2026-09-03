import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import type { CourseProject, ProjectContent } from '../../course'
import { getAct, getModule } from '../../course'
import { pythonRunner } from '../../runner/pythonRunner'
import type { RunReport, ScriptReport, StageBlobs } from '../../runner/types'
import { Lecture } from '../Lecture'
import { SkipLink } from '../SkipLink'
import { NotesPane } from '../notes/NotesPane'
import { Stage, type RunState, type StageTab } from '../stage/Stage'
import { WizardPanel } from '../wizard/WizardPanel'
import { speak } from '../wizard/lines'
import type { WizardPose } from '../wizard/poses'
import { onTabKeys, roving } from '../tabs'

// CodeMirror and its Python grammar are the single largest dependency in the
// app. Splitting it means the workspace paints — brief, wizard, buttons — while
// the editor is still arriving, instead of after.
const Editor = lazy(() => import('../Editor').then((m) => ({ default: m.Editor })))

type LeftTab = 'brief' | 'lesson' | 'notes'
const LEFT_TABS: Array<[LeftTab, string]> = [
  ['brief', 'Brief'],
  ['lesson', 'Lesson'],
  ['notes', 'Notes'],
]

interface Props {
  project: CourseProject
  content: ProjectContent
  code: string
  attempts: number
  failures: number
  hintsRevealed: number
  alreadyPassed: boolean
  onCodeChange: (code: string) => void
  onAttempt: () => void
  onResult: (passed: boolean) => void
  onRevealHint: (tier: number) => void
  onClose: () => void
  onNext: (() => void) | null
}

export function ProjectView({
  project,
  content,
  code,
  attempts,
  failures,
  hintsRevealed,
  alreadyPassed,
  onCodeChange,
  onAttempt,
  onResult,
  onRevealHint,
  onClose,
  onNext,
}: Props) {
  const [state, setState] = useState<RunState>('idle')
  const [status, setStatus] = useState('Starting Python…')
  const [report, setReport] = useState<RunReport | ScriptReport | null>(null)
  const [blobs, setBlobs] = useState<StageBlobs | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<'run' | 'check' | null>(null)
  const [tab, setTab] = useState<LeftTab>('brief')
  const [pose, setPose] = useState<WizardPose>('idle')
  const [liveOutput, setLiveOutput] = useState('')
  const [awaitingInput, setAwaitingInput] = useState(false)
  const [saying, setSaying] = useState<string | null>(null)
  const [split, setSplit] = useState(46)

  const dragging = useRef(false)
  const shell = useRef<HTMLDivElement>(null)
  const act = getAct(project.act)!
  const module = getModule(project.moduleId)

  // A new project is a clean slate.
  useEffect(() => {
    setState('idle')
    setReport(null)
    setBlobs(null)
    setError(null)
    setLastAction(null)
    setTab('brief')
    setPose('idle')
    setLiveOutput('')
    setAwaitingInput(false)
    setSaying(alreadyPassed ? null : speak(project.act, 'greeting'))
  }, [project.id, project.act, alreadyPassed])

  useEffect(() => {
    const offStatus = pythonRunner.onStatus(setStatus)
    const offOutput = pythonRunner.onOutput((chunk) => setLiveOutput((text) => text + chunk))
    const offWait = pythonRunner.onAwaitingInput(() => setAwaitingInput(true))
    return () => {
      offStatus()
      offOutput()
      offWait()
    }
  }, [])

  useEffect(() => {
    pythonRunner.boot().catch(() => undefined)
  }, [])

  const execute = useCallback(
    async (action: 'run' | 'check') => {
      if (state === 'running' || state === 'booting') return

      setError(null)
      setReport(null)
      setBlobs(null)
      setLiveOutput('')
      setAwaitingInput(false)
      setLastAction(action)
      setState('booting')
      setPose('thinking')
      setSaying(action === 'check' ? speak(project.act, 'checking') : null)
      if (action === 'check') onAttempt()

      try {
        await pythonRunner.boot()
        setState('running')

        if (action === 'run') {
          const outcome = await pythonRunner.runScript(
            code,
            { setup: content.setup, interactive: true },
            project.packages,
          )
          setAwaitingInput(false)
          setReport(outcome.report)
          setBlobs(outcome.blobs)
          setState('done')
          setPose(outcome.report.fatal ? 'sympathetic' : 'idle')
          setSaying(
            outcome.report.fatal ? speak(project.act, 'fatalSyntax') : null,
          )
          return
        }

        const outcome = await pythonRunner.runTests(
          code,
          { tests: content.tests, setup: content.setup },
          project.packages,
        )
        setAwaitingInput(false)
        setReport(outcome.report)
        setBlobs(outcome.blobs)
        setState('done')

        const passed = outcome.report.ok
        onResult(passed)

        if (passed) {
          setPose('delighted')
          setSaying(speak(project.act, attempts === 0 ? 'passFirstTry' : 'pass'))
          return
        }

        // Silence for the first two failures — the test output is doing the
        // teaching, and a character who reacts every time becomes noise. On the
        // third he leans in and offers the first hint.
        const failedNow = failures + 1
        if (outcome.report.fatal) {
          setPose('sympathetic')
          setSaying(speak(project.act, 'fatalSyntax'))
        } else if (failedNow >= 3 && hintsRevealed === 0) {
          setPose('conspiratorial')
          setSaying(speak(project.act, 'failOffer'))
        } else {
          setPose('sympathetic')
          setSaying(null)
        }
      } catch (thrown) {
        setAwaitingInput(false)
        setError(thrown instanceof Error ? thrown.message : String(thrown))
        setState('done')
        setPose('sympathetic')
        setSaying(null)
      }
    },
    [state, code, project, content, attempts, failures, hintsRevealed, onAttempt, onResult],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        void execute(event.shiftKey ? 'check' : 'run')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, execute])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragging.current || !shell.current) return
      const box = shell.current.getBoundingClientRect()
      setSplit(Math.min(68, Math.max(26, ((event.clientX - box.left) / box.width) * 100)))
    }
    const stop = () => {
      dragging.current = false
      document.body.classList.remove('dragging')
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', stop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stop)
    }
  }, [])

  const busy = state === 'booting' || state === 'running'
  const passed = alreadyPassed || (report && 'ok' in report && report.ok)

  // Everything a run says visually — a verdict, a count, a traceback — is said
  // by colour and position. This is the same news, in words, for anyone who is
  // not looking at the Stage when it changes.
  const announcement = (() => {
    if (busy) return lastAction === 'check' ? 'Checking your code…' : 'Running your code…'
    if (error) return `Could not run your code. ${error}`
    if (!report) return ''
    if (report.fatal) return `Your code stopped with an error. ${report.fatal.headline}`
    if (lastAction === 'check' && 'tests' in report) {
      const failed = report.tests.filter((test) => !test.passed).length
      return report.ok
        ? `All ${report.tests.length} checks passed.`
        : `${failed} of ${report.tests.length} checks failed. The Tests tab has the detail.`
    }
    return 'Your program finished.'
  })()

  return (
    <div className="relative flex h-full flex-col bg-ink-900">
      <SkipLink to="#editor">Skip to the editor</SkipLink>

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>

      <header className="bar-glass flex shrink-0 flex-wrap items-center gap-3 border-b border-ink-700 px-5 py-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-ink-600 px-3 py-1.5 text-[12.5px] text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
        >
          ← Map
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0 font-mono text-[11px] text-ink-400">
          {act.name} <span aria-hidden>›</span> {module?.title}
        </nav>

        <h1 className="min-w-0 truncate text-[16px] font-semibold tracking-tight">
          {project.title}
        </h1>

        {project.chain && (
          <span
            className="rounded-full border border-scry/35 bg-scry/8 px-2.5 py-1 font-mono text-[10px] tracking-wider text-scry uppercase"
            title="Part of a multi-step build"
          >
            Step {project.chain.step} of {project.chain.of}
          </span>
        )}

        {passed && (
          <span className="rounded-full border border-jade/40 bg-jade/10 px-2.5 py-1 font-mono text-[10px] tracking-wider text-jade uppercase">
            Passed
          </span>
        )}

        <span className="ml-auto font-mono text-[11px] text-ink-400">
          {attempts} check{attempts === 1 ? '' : 's'}
        </span>
      </header>

      <main
        id="workspace"
        ref={shell}
        className="flex min-h-0 flex-1 flex-col lg:flex-row"
        style={{ '--split': `${split}%` } as React.CSSProperties}
      >
        <section
          data-pane="left"
          className="flex min-h-0 flex-col border-b border-ink-700 lg:w-[var(--split)] lg:border-b-0 lg:border-r"
        >
          <div
            role="tablist"
            aria-label="Reading"
            aria-orientation="horizontal"
            className="flex shrink-0 gap-1 border-b border-ink-700 px-4 pt-3"
          >
            {LEFT_TABS.map(([id, label]) => (
              <button
                key={id}
                {...roving(tab === id)}
                id={`read-tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`read-panel-${id}`}
                onClick={() => setTab(id)}
                onKeyDown={onTabKeys(
                  LEFT_TABS.map(([value]) => value),
                  tab,
                  setTab,
                )}
                className={`rounded-t-lg px-3 py-2 text-[12.5px] font-medium transition-colors ${
                  tab === id
                    ? 'border-b-2 border-amber-glow text-ink-50'
                    : 'border-b-2 border-transparent text-ink-300 hover:text-ink-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`read-panel-${tab}`}
            aria-labelledby={`read-tab-${tab}`}
            tabIndex={0}
            className="min-h-0 flex-1 overflow-y-auto p-6">
            {tab === 'lesson' && <Lecture markdown={content.lesson} />}

            {tab === 'brief' && (
              <div className="flex max-w-[68ch] flex-col gap-5">
                <div>
                  <h2 className="text-[21px] font-semibold tracking-tight">{project.title}</h2>
                  <p className="mt-1.5 text-[14px] text-ink-300">{project.tagline}</p>
                  {project.chain && (
                    <ol className="mt-3 flex items-center gap-1.5" aria-label="Steps in this build">
                      {Array.from({ length: project.chain.of }, (_, index) => (
                        <li
                          key={index}
                          aria-current={index + 1 === project.chain!.step ? 'step' : undefined}
                          className={`h-1 w-10 rounded-full ${
                            index + 1 < project.chain!.step
                              ? 'bg-jade'
                              : index + 1 === project.chain!.step
                                ? 'bg-amber-glow'
                                : 'bg-ink-700'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-mono text-[11px] text-ink-400">
                        step {project.chain.step} of {project.chain.of}
                      </span>
                    </ol>
                  )}
                </div>

                <div className="panel-lit rounded-xl border border-ink-700 p-4">
                  <span className="font-mono text-[10px] tracking-widest text-ink-400 uppercase">
                    Your objective
                  </span>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-100">
                    {project.objective}
                  </p>
                </div>

                {content.brief.includes('##') && <Lecture markdown={content.brief} />}

                <div className="flex flex-wrap gap-2">
                  {project.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-md border border-scry/20 bg-scry/8 px-2.5 py-1 font-mono text-[11.5px] text-scry"
                    >
                      {concept}
                    </span>
                  ))}
                </div>

                <p className="text-[13px] text-ink-300">
                  The full teaching for this module is under{' '}
                  <button
                    onClick={() => setTab('lesson')}
                    className="text-amber-glow underline underline-offset-2"
                  >
                    Lesson
                  </button>
                  .
                </p>

                <WizardPanel
                  act={project.act}
                  pose={pose}
                  saying={saying}
                  hints={content.hints}
                  revealed={hintsRevealed}
                  failures={failures}
                  onReveal={onRevealHint}
                />
              </div>
            )}

            {tab === 'notes' && (
              <div className="h-full">
                <NotesPane projectId={project.id} />
              </div>
            )}
          </div>
        </section>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Width of the reading pane"
          aria-valuenow={Math.round(split)}
          aria-valuemin={26}
          aria-valuemax={68}
          tabIndex={0}
          onKeyDown={(event) => {
            // A splitter you can only drag is a splitter half the audience
            // cannot move. Arrows nudge, Home/End go to the stops.
            const step = event.shiftKey ? 8 : 2
            const next =
              event.key === 'ArrowLeft'
                ? split - step
                : event.key === 'ArrowRight'
                  ? split + step
                  : event.key === 'Home'
                    ? 26
                    : event.key === 'End'
                      ? 68
                      : null
            if (next === null) return
            event.preventDefault()
            setSplit(Math.min(68, Math.max(26, next)))
          }}
          onMouseDown={() => {
            dragging.current = true
            document.body.classList.add('dragging')
          }}
          className="hidden w-1.5 shrink-0 cursor-col-resize hover:bg-amber-glow/30 focus-visible:bg-amber-glow/50 lg:block"
        />

        <section className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <div
            id="editor"
            className="editor-frame min-h-[220px] flex-1 overflow-hidden rounded-xl border border-ink-700 bg-ink-950"
            data-running={busy ? 'true' : 'false'}
            data-outcome={
              state === 'done' && lastAction === 'check' && report && 'ok' in report
                ? report.ok
                  ? 'pass'
                  : 'fail'
                : undefined
            }
          >
            <Suspense
              fallback={
                <div
                  role="status"
                  className="p-4 font-mono text-[12.5px] whitespace-pre-wrap text-ink-400"
                >
                  {code || 'Opening the editor…'}
                </div>
              }
            >
              <Editor
                value={code}
                onChange={onCodeChange}
                onRun={() => execute('run')}
                disabled={busy}
              />
            </Suspense>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <button
              onClick={() => execute('run')}
              disabled={busy}
              className="rounded-lg bg-amber-glow px-5 py-2.5 text-[13px] font-semibold text-amber-ink transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {busy && lastAction === 'run' ? 'Running…' : 'Run'}
            </button>

            <button
              onClick={() => execute('check')}
              disabled={busy}
              className="rounded-lg border border-jade/45 bg-jade/10 px-5 py-2.5 text-[13px] font-semibold text-jade transition-colors hover:bg-jade/20 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {busy && lastAction === 'check' ? 'Checking…' : 'Check'}
            </button>

            <button
              onClick={() => {
                if (code !== content.starter && !confirm('Replace your code with the starter?')) return
                onCodeChange(content.starter)
              }}
              className="rounded-lg border border-ink-600 px-4 py-2.5 text-[13px] font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
            >
              Reset code
            </button>

            {passed && onNext && (
              <button
                onClick={onNext}
                className="rounded-lg border border-jade/45 px-4 py-2.5 text-[13px] font-semibold text-jade transition-colors hover:bg-jade/10"
              >
                Next →
              </button>
            )}

            <span className="ml-auto font-mono text-[11px] text-ink-400">
              Cmd/Ctrl+Enter run &middot; +Shift check
            </span>
          </div>

          <Stage
            state={state}
            status={status}
            report={report}
            blobs={blobs}
            error={error}
            lastAction={lastAction}
            preferredTab={project.stage as StageTab}
            liveOutput={liveOutput}
            awaitingInput={awaitingInput}
            canBlockForInput={pythonRunner.interactive}
            onSubmitInput={(line) => {
              setAwaitingInput(false)
              pythonRunner.submitInput(line)
            }}
            onEndInput={() => {
              setAwaitingInput(false)
              pythonRunner.endInput()
            }}
            onStop={() => {
              setAwaitingInput(false)
              pythonRunner.stop()
            }}
          />
        </section>
      </main>
    </div>
  )
}
