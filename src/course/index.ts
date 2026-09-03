import { ACTS } from './structure'
import { loadAuthoredModules } from './loadModules'
import type {
  Act,
  ActId,
  CourseModule,
  CourseProject,
  ModuleId,
  ProjectId,
} from './types'

export * from './types'
export { ACTS } from './structure'
export { loadProjectContent } from './loadModules'

const AUTHORED = loadAuthoredModules()

// Every module is authored now; the day-porting seam is gone.
const ALL_MODULES: CourseModule[] = AUTHORED.map((entry) => entry.module).sort(
  (a, b) =>
    ACTS.findIndex((act) => act.id === a.act) - ACTS.findIndex((act) => act.id === b.act) ||
    a.index - b.index,
)
const ALL_PROJECTS: CourseProject[] = AUTHORED.flatMap((entry) => entry.projects)

const projectsById = new Map(ALL_PROJECTS.map((project) => [project.id, project]))
const modulesById = new Map(ALL_MODULES.map((module) => [module.id, module]))
const actsById = new Map(ACTS.map((act) => [act.id, act]))

export const COURSE = {
  acts: ACTS,
  modules: ALL_MODULES,
  projects: ALL_PROJECTS,
}

export const TOTAL_PROJECTS = ALL_PROJECTS.length

export function getProject(id: ProjectId): CourseProject | undefined {
  return projectsById.get(id)
}

export function getModule(id: ModuleId): CourseModule | undefined {
  return modulesById.get(id)
}

export function getAct(id: ActId): Act | undefined {
  return actsById.get(id)
}

export function modulesOfAct(act: ActId): CourseModule[] {
  return ALL_MODULES.filter((module) => module.act === act)
}

export function projectsOfModule(id: ModuleId): CourseProject[] {
  const module = modulesById.get(id)
  if (!module) return []
  return module.projectIds.map((projectId) => projectsById.get(projectId)!).filter(Boolean)
}

/** Course order — the sequence the map draws and unlocking follows. */
export const ORDERED_PROJECT_IDS: ProjectId[] = ALL_MODULES.flatMap((module) => module.projectIds)

export function projectAfter(id: ProjectId): CourseProject | undefined {
  const position = ORDERED_PROJECT_IDS.indexOf(id)
  if (position < 0 || position + 1 >= ORDERED_PROJECT_IDS.length) return undefined
  return projectsById.get(ORDERED_PROJECT_IDS[position + 1])
}

export function projectBefore(id: ProjectId): CourseProject | undefined {
  const position = ORDERED_PROJECT_IDS.indexOf(id)
  if (position <= 0) return undefined
  return projectsById.get(ORDERED_PROJECT_IDS[position - 1])
}
