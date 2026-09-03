import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import {
  getProject,
  loadProjectContent,
  projectAfter,
  type ProjectContent,
  type ProjectId,
} from './course'
import { QuestMap } from './components/map/QuestMap'
import { Loading } from './components/Loading'
import { navigate, useRoute } from './router'
import {
  EMPTY,
  clearEverything,
  loadDraft,
  loadProgress,
  saveDraft,
  saveProgress,
  statusFor,
  type Progress,
} from './storage/progress'

/**
 * The map is the landing route, so it is the only view in the entry chunk.
 * Everything the workspace needs — the editor, the markdown renderer, the
 * Python worker — is a few hundred kilobytes that nobody looking at a map has
 * asked for, and it arrives while they are reading the brief instead.
 */
const ProjectView = lazy(() =>
  import('./components/project/ProjectView').then((m) => ({ default: m.ProjectView })),
)
const GrimoireView = lazy(() =>
  import('./components/notes/GrimoireView').then((m) => ({ default: m.GrimoireView })),
)
const WizardGallery = lazy(() =>
  import('./components/wizard/WizardGallery').then((m) => ({ default: m.WizardGallery })),
)

/** Warm the workspace chunk once the map is idle, so opening a project is instant. */
function usePrefetchWorkspace(active: boolean) {
  useEffect(() => {
    if (!active) return
    const idle =
      window.requestIdleCallback?.(() => void import('./components/project/ProjectView')) ??
      window.setTimeout(() => void import('./components/project/ProjectView'), 1200)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number)
      else window.clearTimeout(idle as number)
    }
  }, [active])
}

export default function App() {
  const route = useRoute()
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => saveProgress(progress), [progress])

  const project = route.name === 'project' ? getProject(route.projectId) : undefined

  usePrefetchWorkspace(route.name === 'map')

  // The lesson, brief, hints and Python arrive per module; code drafts come
  // from IndexedDB. Both land a tick after the project does.
  const [content, setContent] = useState<ProjectContent | null>(null)
  const [code, setCode] = useState('')
  const [draftReady, setDraftReady] = useState(false)
  const saveTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!project) return
    let live = true
    setContent(null)
    setDraftReady(false)

    const id = project.id
    Promise.all([loadProjectContent(id), loadDraft(id)]).then(([loaded, stored]) => {
      if (!live) return
      setContent(loaded)
      setCode(stored ?? loaded.starter)
      setDraftReady(true)
    })

    return () => {
      live = false
    }
  }, [project?.id])

  useEffect(() => () => window.clearTimeout(saveTimer.current), [])

  // The document title is the first thing a screen reader announces after a
  // route change, and hash routing changes none of it by itself.
  useEffect(() => {
    const suffix = "Codecrafter's Grimoire"
    document.title =
      route.name === 'project' && project
        ? `${project.title} — ${suffix}`
        : route.name === 'grimoire'
          ? `Your Grimoire — ${suffix}`
          : route.name === 'wizard'
            ? `Wizard poses — ${suffix}`
            : suffix
  }, [route.name, project?.title])

  const updateCode = useCallback(
    (next: string) => {
      setCode(next)
      if (!project || !draftReady) return
      window.clearTimeout(saveTimer.current)
      const id = project.id
      saveTimer.current = window.setTimeout(() => void saveDraft(id, next), 350)
    },
    [project?.id, draftReady],
  )

  const recordAttempt = useCallback(() => {
    if (!project) return
    setProgress((current) => ({
      ...current,
      attempts: { ...current.attempts, [project.id]: (current.attempts[project.id] ?? 0) + 1 },
      lastProject: project.id,
    }))
  }, [project?.id])

  const recordResult = useCallback(
    (passed: boolean) => {
      if (!project) return
      setProgress((current) => {
        if (passed) {
          return {
            ...current,
            passed: current.passed[project.id]
              ? current.passed
              : { ...current.passed, [project.id]: new Date().toISOString() },
            failures: { ...current.failures, [project.id]: 0 },
          }
        }
        return {
          ...current,
          failures: { ...current.failures, [project.id]: (current.failures[project.id] ?? 0) + 1 },
        }
      })
    },
    [project?.id],
  )

  const revealHint = useCallback(
    (tier: number) => {
      if (!project) return
      setProgress((current) => ({
        ...current,
        hintsRevealed: {
          ...current.hintsRevealed,
          [project.id]: Math.max(current.hintsRevealed[project.id] ?? 0, tier),
        },
      }))
    },
    [project?.id],
  )

  const openProject = useCallback(
    (id: ProjectId) => {
      if (statusFor(id, progress) === 'locked') return
      navigate({ name: 'project', projectId: id })
    },
    [progress],
  )

  if (route.name === 'wizard') {
    return (
      <Suspense fallback={<Loading label="Fetching the wizard" />}>
        <WizardGallery onBack={() => navigate({ name: 'map' })} />
      </Suspense>
    )
  }

  if (route.name === 'grimoire') {
    return (
      <Suspense fallback={<Loading label="Opening your grimoire" />}>
        <GrimoireView onBack={() => navigate({ name: 'map' })} />
      </Suspense>
    )
  }

  if (project) {
    const next = projectAfter(project.id)
    const canGoOn = Boolean(next && (progress.passed[project.id] || progress.freeRoam))

    if (!content) return <Loading label={`Opening ${project.title}`} />

    return (
      <Suspense fallback={<Loading label={`Opening ${project.title}`} />}>
        <ProjectView
          key={project.id}
          project={project}
          content={content}
          code={code}
          attempts={progress.attempts[project.id] ?? 0}
          failures={progress.failures[project.id] ?? 0}
          hintsRevealed={progress.hintsRevealed[project.id] ?? 0}
          alreadyPassed={Boolean(progress.passed[project.id])}
          onCodeChange={updateCode}
          onAttempt={recordAttempt}
          onResult={recordResult}
          onRevealHint={revealHint}
          onClose={() => navigate({ name: 'map' })}
          onNext={canGoOn && next ? () => openProject(next.id) : null}
        />
      </Suspense>
    )
  }

  return (
    <QuestMap
      progress={progress}
      onOpen={openProject}
      onOpenGrimoire={() => navigate({ name: 'grimoire' })}
      onToggleFreeRoam={() =>
        setProgress((current) => ({ ...current, freeRoam: !current.freeRoam }))
      }
      onReset={() => {
        void clearEverything()
        localStorage.removeItem('grimoire.progress.v2')
        setProgress({ ...EMPTY, startedOn: new Date().toISOString() })
        navigate({ name: 'map' })
      }}
    />
  )
}
