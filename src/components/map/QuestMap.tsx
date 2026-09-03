import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ACTS,
  COURSE,

  getProject,
  TOTAL_PROJECTS,
  type CourseProject,
  type ProjectId,
  type ProjectStatus,
} from '../../course'
import { currentProject, passedCount, statusFor, streak, type Progress } from '../../storage/progress'
import { SkipLink } from '../SkipLink'
import { Wizard } from '../wizard/Wizard'
import { serpentine } from './layout'
import { WorldCanvas } from './WorldCanvas'
import { worldFor } from './world'

interface Props {
  progress: Progress
  onOpen: (id: ProjectId) => void
  onOpenGrimoire: () => void
  onToggleFreeRoam: () => void
  onReset: () => void
}

type View = 'map' | 'list'
const VIEW_KEY = 'grimoire.mapView'

const STATUS_LABEL: Record<ProjectStatus, string> = {
  passed: 'Passed',
  open: 'Open',
  locked: 'Locked',
}

function useView(): [View, (view: View) => void] {
  const [view, setView] = useState<View>(() => {
    const stored = localStorage.getItem(VIEW_KEY) as View | null
    if (stored === 'map' || stored === 'list') return stored
    // A 30-node pictorial map is the wrong default for anyone who has asked
    // the system to calm down.
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'list' : 'map'
  })

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view)
  }, [view])

  return [view, setView]
}

function NodeButton({
  project,
  status,
  isCurrent,
  onOpen,
  style,
}: {
  project: CourseProject
  status: ProjectStatus
  isCurrent: boolean
  onOpen: () => void
  style?: React.CSSProperties
}) {
  const capstone = project.shape === 'capstone'

  return (
    <button
      style={style}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 focus-visible:outline-2"
      onClick={onOpen}
      disabled={status === 'locked'}
      aria-current={isCurrent ? 'step' : undefined}
      aria-label={`${project.title}. ${STATUS_LABEL[status]}.${isCurrent ? ' This is where you are.' : ''}`}
      title={status === 'locked' ? 'Finish the project before this one' : project.tagline}
    >
      <Rune status={status} current={isCurrent} capstone={capstone}>
        {status === 'passed' ? '✓' : status === 'locked' ? '' : project.index + 1}
      </Rune>
      <span
        className={`flex h-8 w-[140px] items-start justify-center text-center text-[11.5px] leading-tight ${
          status === 'locked'
            ? 'text-ink-300/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
            : 'text-ink-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:text-white'
        }`}
      >
        {project.title}
      </span>
    </button>
  )
}

/**
 * A standing stone with a glyph cut into it. Six facets, lit from the upper
 * right, so it reads as a solid rather than an outline — and the glow beneath
 * it comes from the canvas, so the light appears to fall on the ground.
 */
function Rune({
  status,
  current,
  capstone,
  children,
}: {
  status: ProjectStatus
  current: boolean
  capstone: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={`rune rune--${status} ${current ? 'rune--current' : ''} ${capstone ? 'rune--capstone' : ''}`}
    >
      <svg viewBox="0 0 64 80" aria-hidden>
        {/* Base shadow */}
        <ellipse cx="32" cy="76" rx="18" ry="4" fill="rgb(0 0 0 / 0.5)" />
        {/* Left, dark face */}
        <path d="M32 4 L12 22 L16 64 L32 76 Z" fill="var(--rune-b)" />
        {/* Right, lit face */}
        <path d="M32 4 L52 22 L48 64 L32 76 Z" fill="var(--rune-a)" />
        {/* Top facets */}
        <path d="M32 4 L12 22 L32 28 Z" fill="var(--rune-c)" opacity="0.7" />
        <path d="M32 4 L52 22 L32 28 Z" fill="var(--rune-c)" />
        {/* Engraved lines */}
        <g stroke="var(--rune-line)" strokeWidth="1.2" fill="none" opacity="0.9">
          <path d="M32 4 L32 76" opacity="0.35" />
          <path d="M12 22 L32 28 L52 22" />
          <path d="M18 56 L32 60 L46 56" opacity="0.6" />
        </g>
        {capstone && (
          <ellipse
            cx="32"
            cy="10"
            rx="26"
            ry="7"
            stroke="var(--rune-line)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.8"
          />
        )}
        {status === 'locked' && (
          <g stroke="#6b7484" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M26 44 v-5 a6 6 0 0 1 12 0 v5" />
            <rect x="23" y="44" width="18" height="12" rx="2" fill="#20242f" />
          </g>
        )}
      </svg>
      <span className="rune__glyph">{children}</span>
    </span>
  )
}

export function QuestMap({
  progress,
  onOpen,
  onOpenGrimoire,
  onToggleFreeRoam,
  onReset,
}: Props) {
  const [view, setView] = useView()
  const here = currentProject(progress)
  const done = passedCount(progress)
  const percent = Math.round((done / TOTAL_PROJECTS) * 100)

  // A world should reach both edges of its card. The card is as wide as the
  // course column, which depends on the viewport, so measure rather than guess
  // — a fixed width leaves a bare strip on wide screens and scrolls on narrow.
  const course = useRef<HTMLElement>(null)
  const [columnWidth, setColumnWidth] = useState(1088)
  useEffect(() => {
    const element = course.current
    if (!element) return
    const measure = () => {
      const next = Math.round(element.clientWidth)
      if (next > 0) setColumnWidth((prev) => (prev === next ? prev : next))
    }
    measure()
    const watcher = new ResizeObserver(measure)
    watcher.observe(element)
    return () => watcher.disconnect()
  }, [])

  const acts = useMemo(
    () =>
      ACTS.map((act) => ({
        act,
        regions: COURSE.modules
          .filter((module) => module.act === act.id)
          .map((module) => {
            const projects = module.projectIds
              .map((id) => getProject(id)!)
              .filter(Boolean)
            const layout = serpentine(projects.length, {
              perRow: 4,
              stepY: 164,
              padY: 92,
              minHeight: 250,
              // Inside the card's 1px border on each side.
              minWidth: Math.max(640, columnWidth - 2),
            })
            return { module, projects, layout, world: worldFor(module.act) }
          }),
      })),
    [columnWidth],
  )

  return (
    <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <SkipLink to="#course">Skip to the course</SkipLink>

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Wizard pose={done === TOTAL_PROJECTS ? 'delighted' : 'idle'} size="md" />
          <div>
            <h1 className="text-[26px] leading-tight font-semibold tracking-tight">
              Codecrafter&rsquo;s Grimoire
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-300">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-7">
          {[
            [done, 'passed'],
            [streak(progress), 'streak'],
            [TOTAL_PROJECTS - done, 'to go'],
          ].map(([value, label]) => (
            <div key={String(label)} className="flex flex-col items-end">
              <span className="text-[26px] leading-none font-semibold tabular-nums">{value}</span>
              <span className="mt-1.5 font-mono text-[10px] tracking-widest text-ink-400 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </header>

      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={TOTAL_PROJECTS}
        aria-valuetext={`${done} of ${TOTAL_PROJECTS} projects passed, ${percent} per cent`}
        className="mt-7 h-1 overflow-hidden rounded-full bg-ink-800"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-glow to-amber-deep transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label="Choose how to view the course"
          className="flex gap-1 rounded-lg border border-ink-700 p-1"
        >
          {(['map', 'list'] as View[]).map((option) => (
            <button
              key={option}
              onClick={() => setView(option)}
              aria-pressed={view === option}
              aria-controls="course"
              title={
                option === 'map'
                  ? 'Illustrated regions with a winding path'
                  : 'The same projects and the same state, as a plain list'
              }
              className={`rounded px-3 py-1 text-[12.5px] font-medium capitalize transition-colors ${
                view === option ? 'bg-ink-700 text-ink-50' : 'text-ink-300 hover:text-ink-100'
              }`}
            >
              {option === 'map' ? 'Map' : 'List'}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenGrimoire}
          className="rounded-lg border border-ink-700 px-3 py-1.5 text-[12.5px] font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
        >
          Your Grimoire
        </button>

        <button
          onClick={() => onOpen(here)}
          className="ml-auto rounded-lg bg-amber-glow px-4 py-2 text-[13px] font-semibold text-amber-ink transition-[filter] hover:brightness-110"
        >
          {done ? 'Continue' : 'Begin'} — {getProject(here)?.title}
        </button>
      </div>

      <main ref={course} id="course" aria-label={view === 'map' ? 'Quest map' : 'Course list'}>
      {view === 'map' ? (
        <div className="mt-10 flex flex-col gap-14">
          {acts.map(({ act, regions }) => (
            <section key={act.id} aria-labelledby={`act-${act.id}`}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-widest text-amber-glow uppercase">
                  Act {act.index}
                </span>
                <h2 id={`act-${act.id}`} className="text-[19px] font-semibold tracking-tight">
                  {act.name}
                </h2>
              </div>
              <p className="mt-1.5 max-w-2xl text-[13.5px] text-ink-300">{act.blurb}</p>

              <div className="mt-5 flex flex-col gap-5">
                {regions.map(({ module, projects, layout, world }) => {
                  const statuses = projects.map((project) => statusFor(project.id, progress))
                  const done = statuses.filter((status) => status === 'passed').length
                  const current = projects.findIndex((project) => project.id === here)

                  return (
                    <section
                      key={module.id}
                      aria-labelledby={`region-${module.id}`}
                      className="region-card overflow-hidden rounded-2xl border border-ink-700"
                    >
                      <div className="region-plaque flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3">
                        <h3
                          id={`region-${module.id}`}
                          className="text-[14.5px] font-semibold text-ink-50"
                        >
                          {module.title}
                        </h3>
                        <span className="font-mono text-[11px]" style={{ color: world.accent }}>
                          {module.region}
                        </span>
                        <span className="ml-auto font-mono text-[11px] text-ink-400 tabular-nums">
                          {done}/{projects.length}
                        </span>
                        <p className="w-full text-[12.5px] text-ink-300">{module.blurb}</p>
                      </div>

                      <div className="overflow-x-auto" style={{ background: world.ground[1] }}>
                        <div
                          className="relative"
                          style={{ width: layout.width, height: layout.height }}
                        >
                          <WorldCanvas
                            moduleId={module.id}
                            world={world}
                            layout={layout}
                            statuses={statuses}
                            current={current}
                          />

                          {projects.map((project, index) => (
                            <NodeButton
                              key={project.id}
                              project={project}
                              status={statuses[index]}
                              isCurrent={project.id === here}
                              onOpen={() => onOpen(project.id)}
                              style={{
                                left: layout.points[index].x,
                                top: layout.points[index].y,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <ListView progress={progress} here={here} onOpen={onOpen} />
      )}
      </main>

      <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink-700 pt-6">
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-300">
          <input
            type="checkbox"
            checked={progress.freeRoam}
            onChange={onToggleFreeRoam}
            className="size-4 accent-[var(--color-amber-glow)]"
          />
          Free roam — open every project
        </label>
        <button
          onClick={() => {
            if (confirm('Erase all progress, code and notes? This cannot be undone.')) onReset()
          }}
          className="rounded-lg border border-ink-700 px-3 py-1.5 text-[12.5px] text-ink-300 transition-colors hover:border-rust/50 hover:text-rust"
        >
          Reset everything
        </button>
      </footer>
    </div>
  )
}

/**
 * The same information, linearly. Not a courtesy: it is the only usable view
 * with a keyboard or a screen reader, and it reads the identical state.
 */
function ListView({
  progress,
  here,
  onOpen,
}: {
  progress: Progress
  here: ProjectId
  onOpen: (id: ProjectId) => void
}) {
  return (
    <div className="mt-8 flex flex-col gap-10">
      {ACTS.map((act) => (
        <section key={act.id} aria-labelledby={`list-act-${act.id}`}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] tracking-widest text-amber-glow uppercase">
              Act {act.index}
            </span>
            <h2 id={`list-act-${act.id}`} className="text-[19px] font-semibold tracking-tight">
              {act.name}
            </h2>
          </div>

          {COURSE.modules
            .filter((module) => module.act === act.id)
            .map((module) => (
              <div key={module.id} className="mt-6">
                <h3 className="text-[14px] font-semibold text-ink-100">
                  {module.title}
                  <span className="ml-2 font-mono text-[11px] font-normal text-ink-400">
                    {module.region}
                  </span>
                </h3>
                <p className="mt-0.5 text-[12.5px] text-ink-300">{module.blurb}</p>

                <ul className="mt-3 flex flex-col divide-y divide-ink-800 rounded-xl border border-ink-700">
                  {module.projectIds.map((id) => {
                    const project = getProject(id)
                    if (!project) return null
                    const status = statusFor(id, progress)

                    return (
                      <li key={id}>
                        <button
                          onClick={() => onOpen(id)}
                          disabled={status === 'locked'}
                          aria-current={id === here ? 'step' : undefined}
                          className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors enabled:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span
                            aria-hidden
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                              status === 'passed'
                                ? 'border-jade text-jade'
                                : status === 'locked'
                                  ? 'border-ink-600 text-ink-500'
                                  : 'border-amber-glow text-amber-glow'
                            }`}
                          >
                            {status === 'passed' ? '✓' : status === 'locked' ? '🔒' : '○'}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-medium text-ink-50">
                              {project.title}
                            </span>
                            <span className="block truncate text-[12px] text-ink-300">
                              {project.tagline}
                            </span>
                          </span>

                          <span className="shrink-0 font-mono text-[10px] tracking-wider text-ink-400 uppercase">
                            {STATUS_LABEL[status]}
                            {id === here && ' · here'}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
        </section>
      ))}
    </div>
  )
}
