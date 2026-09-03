import type {
  CourseModule,
  CourseProject,
  Hint,
  ProjectContent,
  ProjectId,
  ProjectShape,
} from './types'

/**
 * Loads authored modules from src/course/modules.
 *
 * Content is real .md and .py files on disk, pulled in at build time. Metadata
 * is colocated with each project rather than gathered in one central manifest:
 * a 130-entry manifest is a merge-conflict magnet, and a project you can delete
 * by deleting its folder is a project you can reason about.
 *
 * Metadata is eager — the map cannot draw without it, and all 81 projects'
 * titles and taglines together are a few kilobytes. Prose and Python are not:
 * they are half a megabyte, and they load per module when a project opens.
 */

export interface ModuleFile {
  id: string
  act: 'act1' | 'act2' | 'act3'
  order: number
  title: string
  region: string
  blurb: string
  concepts: string[]
  /** Project folder names, in the order they should be attempted. */
  projects: string[]
}

export interface ProjectFile {
  slug: string
  title: string
  tagline: string
  shape: ProjectShape
  difficulty: 1 | 2 | 3 | 4 | 5
  concepts: string[]
  objective: string
  packages?: string[]
  stage?: 'console' | 'files' | 'image'
  /** Multi-step builds show as a linked run: "Step 2 of 3". */
  chain?: { id: string; step: number; of: number }
  source?: string
}

const modules = import.meta.glob('./modules/*/module.ts', {
  import: 'default',
  eager: true,
}) as Record<string, ModuleFile>

const projects = import.meta.glob('./modules/*/projects/*/project.ts', {
  import: 'default',
  eager: true,
}) as Record<string, ProjectFile>

/**
 * Lazy content, one chunk per module.
 *
 * Each module folder has a generated content.ts that eagerly imports its own
 * .md and .py files (see scripts/gen-content-entries.mjs). Importing that one
 * file dynamically is what makes the split work: glob the individual files
 * instead and the build emits five hundred chunks, six per project; group them
 * with a bundler rule instead and they become static imports of the entry, so
 * the whole course downloads before the map paints.
 *
 * Paths inside the returned record are relative to the module folder:
 * './lesson.md', './projects/<slug>/brief.md'.
 */
type ModuleContent = Record<string, string>

const contentEntries = import.meta.glob('./modules/*/content.ts', {
  import: 'default',
}) as Record<string, () => Promise<ModuleContent>>

/** Hints are separated by a `---` line, tier 1 first. */
export function parseHints(markdown: string): Hint[] {
  return markdown
    .split(/^---$/m)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((chunk, index) => ({ tier: (index + 1) as 1 | 2 | 3, text: chunk }))
}

export interface LoadedModule {
  module: CourseModule
  projects: CourseProject[]
}

/** Where each project's files live, so content can be found from an id alone. */
const location = new Map<ProjectId, { dir: string; slug: string }>()

export function loadAuthoredModules(): LoadedModule[] {
  const out: LoadedModule[] = []

  for (const [path, meta] of Object.entries(modules)) {
    const dir = path.split('/')[2]

    const loaded: CourseProject[] = meta.projects.flatMap((slug, index) => {
      const project = projects[`./modules/${dir}/projects/${slug}/project.ts`]
      if (!project) return []

      const id = `${meta.id}.${slug}`
      location.set(id, { dir, slug })

      return [
        {
          id,
          moduleId: meta.id,
          act: meta.act,
          index,
          title: project.title,
          tagline: project.tagline,
          shape: project.shape,
          difficulty: project.difficulty,
          concepts: project.concepts,
          objective: project.objective,
          packages: project.packages ?? [],
          stage: project.stage ?? 'console',
          chain: project.chain,
          source: project.source,
        },
      ]
    })

    out.push({
      module: {
        id: meta.id,
        act: meta.act,
        index: meta.order,
        title: meta.title,
        region: meta.region,
        blurb: meta.blurb,
        concepts: meta.concepts,
        projectIds: loaded.map((project) => project.id),
      },
      projects: loaded,
    })
  }

  return out.sort((a, b) => a.module.index - b.module.index)
}

const modulesInFlight = new Map<string, Promise<ModuleContent>>()

function fetchModuleContent(dir: string): Promise<ModuleContent> {
  const existing = modulesInFlight.get(dir)
  if (existing) return existing

  const load = contentEntries[`./modules/${dir}/content.ts`]
  if (!load) return Promise.reject(new Error(`No content for module: ${dir}`))

  const pending = load()
  modulesInFlight.set(dir, pending)
  // A failed fetch must not poison the cache: a flaky network should be
  // retryable by pressing the button again, not by reloading the page.
  pending.catch(() => modulesInFlight.delete(dir))
  return pending
}

/**
 * Fetches everything a project needs to be read and run.
 *
 * Its siblings come along for free — they are in the same chunk — so working
 * through a module costs one request, not one per project.
 */
export async function loadProjectContent(id: ProjectId): Promise<ProjectContent> {
  const where = location.get(id)
  if (!where) throw new Error(`No such project: ${id}`)
  const { dir, slug } = where

  const files = await fetchModuleContent(dir)
  // An absent optional file (setup.py, mostly) is an empty string, not a throw.
  const grab = (file: string) => files[`./projects/${slug}/${file}`] ?? ''

  return {
    lesson: files['./lesson.md'] ?? '',
    brief: grab('brief.md'),
    hints: parseHints(grab('hints.md')),
    starter: grab('starter.py'),
    tests: grab('tests.py'),
    solution: grab('solution.py'),
    setup: grab('setup.py'),
  }
}
