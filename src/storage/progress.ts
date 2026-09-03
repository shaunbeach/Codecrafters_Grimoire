import { ORDERED_PROJECT_IDS, type ProjectId, type ProjectStatus } from '../course'
import * as db from './db'

const KEY = 'grimoire.progress.v2'
const LEGACY_KEY = 'py30.progress.v1'

/**
 * The index stays in localStorage — it is a few KB and we want it synchronously
 * on first paint. The bulky per-project material (code drafts, notes) lives in
 * IndexedDB.
 */
export interface Progress {
  version: 2
  passed: Record<ProjectId, string>
  attempts: Record<ProjectId, number>
  /** Failures since the last pass — what the wizard's patience is measured in. */
  failures: Record<ProjectId, number>
  /** Highest hint tier revealed, per project. */
  hintsRevealed: Record<ProjectId, number>
  startedOn: string
  lastProject: ProjectId | null
  freeRoam: boolean
}

export const EMPTY: Progress = {
  version: 2,
  passed: {},
  attempts: {},
  failures: {},
  hintsRevealed: {},
  startedOn: new Date().toISOString(),
  lastProject: null,
  freeRoam: false,
}

/**
 * Fold a v1 record into v2.
 *
 * The 30 days became Act I, in the same order, so a day maps to a position in
 * the course rather than to an id — day ids stopped existing when the modules
 * replaced them, and a migration that writes ids nothing matches is worse than
 * no migration at all, because it looks like it worked.
 */
const projectIdForDay = (day: number): ProjectId | undefined =>
  ORDERED_PROJECT_IDS[day - 1]

function migrate(raw: string): Progress | null {
  try {
    const old = JSON.parse(raw)
    if (!old || typeof old !== 'object') return null

    const next: Progress = { ...EMPTY, startedOn: old.startedOn ?? EMPTY.startedOn }
    for (const [day, at] of Object.entries(old.passed ?? {})) {
      const id = projectIdForDay(Number(day))
      if (id) next.passed[id] = String(at)
    }
    for (const [day, count] of Object.entries(old.attempts ?? {})) {
      const id = projectIdForDay(Number(day))
      if (id) next.attempts[id] = Number(count)
    }
    next.freeRoam = Boolean(old.freeRoam)

    // Drafts move stores, not just keys.
    for (const [day, code] of Object.entries(old.drafts ?? {})) {
      const id = projectIdForDay(Number(day))
      if (id) void db.put('drafts', id, String(code))
    }
    return next
  } catch {
    return null
  }
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.version === 2) return { ...EMPTY, ...parsed }
    }

    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const migrated = migrate(legacy)
      if (migrated) {
        saveProgress(migrated)
        // Keep the old key: a migration bug should be recoverable.
        localStorage.setItem(`${LEGACY_KEY}.migrated`, new Date().toISOString())
        return migrated
      }
    }
  } catch {
    // A corrupt store should never stop somebody learning.
  }
  return { ...EMPTY }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    /* quota or private browsing — carry on without persistence */
  }
}

// ------------------------------------------------------------------ queries

export function statusFor(id: ProjectId, progress: Progress): ProjectStatus {
  if (progress.passed[id]) return 'passed'
  if (progress.freeRoam) return 'open'

  const position = ORDERED_PROJECT_IDS.indexOf(id)
  if (position <= 0) return 'open'
  return progress.passed[ORDERED_PROJECT_IDS[position - 1]] ? 'open' : 'locked'
}

/** The lowest project that is open and not yet beaten. */
export function currentProject(progress: Progress): ProjectId {
  for (const id of ORDERED_PROJECT_IDS) {
    if (!progress.passed[id] && statusFor(id, progress) !== 'locked') return id
  }
  return ORDERED_PROJECT_IDS[ORDERED_PROJECT_IDS.length - 1]
}

export function passedCount(progress: Progress): number {
  return Object.keys(progress.passed).length
}

export function streak(progress: Progress): number {
  let count = 0
  for (const id of ORDERED_PROJECT_IDS) {
    if (!progress.passed[id]) break
    count += 1
  }
  return count
}

// ------------------------------------------------------------------ drafts

export const loadDraft = (id: ProjectId) => db.get<string>('drafts', id)
export const saveDraft = (id: ProjectId, code: string) => db.put('drafts', id, code)
export const loadNote = (id: ProjectId) => db.get<string>('notes', id)
export const saveNote = (id: ProjectId, text: string) => db.put('notes', id, text)
export const allNotes = () => db.entries<string>('notes')
export const clearEverything = () => db.clearAll()
