/**
 * The course model. Projects live inside modules, modules inside acts.
 *
 * Ids are stable strings, never derived from position: they are IndexedDB keys
 * and URL segments, so renumbering a module must not lose anybody's progress.
 */

export type ActId = 'act1' | 'act2' | 'act3'
export type ModuleId = string
export type ProjectId = string

/** Which voice the wizard speaks in. The acts are also a tonal progression. */
export interface Act {
  id: ActId
  index: number
  name: string
  /** Shown under the act heading on the map. */
  blurb: string
  /**
   * Act I frames programming as learning magic; Act III frames the real
   * machine — the filesystem, the network, the screen — as the actual magic.
   */
  voice: 'apprentice' | 'artisan' | 'archmage'
}

export interface CourseModule {
  id: ModuleId
  act: ActId
  index: number
  title: string
  /** The place on the map. */
  region: string
  blurb: string
  concepts: string[]
  projectIds: ProjectId[]
}

export type ProjectShape = 'drill' | 'project' | 'capstone'

export interface CourseProject {
  id: ProjectId
  moduleId: ModuleId
  act: ActId
  index: number
  title: string
  tagline: string
  shape: ProjectShape
  difficulty: 1 | 2 | 3 | 4 | 5
  concepts: string[]
  objective: string
  /** Pyodide packages this project needs; loaded when it opens. */
  packages: string[]
  /** Multi-step builds appear as a linked run: "Step 2 of 3". */
  chain?: { id: string; step: number; of: number }
  /** Which Stage tab opens first once a run finishes. */
  stage: 'console' | 'files' | 'image'

  /** Where this came from, for our own bookkeeping. Never shown. */
  source?: string
}

/**
 * The words and the Python — everything a learner actually reads or runs.
 *
 * Split out of CourseProject on purpose. The map needs every project's title
 * and status, but nobody reads 33,000 words of lesson prose on the way past;
 * shipping it all in the entry chunk cost a third of a megabyte before the
 * first pixel. Content is fetched one module at a time, when a project opens.
 */
export interface ProjectContent {
  lesson: string
  brief: string
  hints: Hint[]
  starter: string
  tests: string
  solution: string
  setup: string
}

export interface Hint {
  tier: 1 | 2 | 3
  text: string
}

export type ProjectStatus = 'locked' | 'open' | 'passed'
