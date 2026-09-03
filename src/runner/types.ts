export interface TestCase {
  name: string
  passed: boolean
  message: string
  traceback: string
}

export interface FatalError {
  headline: string
  traceback: string
}

// ------------------------------------------------------------------- stage

export type StageKind =
  | 'text'
  | 'table'
  | 'json'
  | 'image'
  | 'sheet'
  | 'pdf'
  | 'document'
  | 'archive'
  | 'binary'
  | 'html'
  | 'outbox'
  | 'screen'
  | 'regex'

export type StageChange = 'created' | 'modified' | 'deleted' | 'emitted'

/**
 * Decoded in Python and shipped as JSON. Only images carry raw bytes, because
 * only images have no useful structured form — everything else was parsed by a
 * library that already lives in the worker.
 */
export interface StagePreview {
  kind: StageKind
  [field: string]: unknown
}

export interface StageBlobRef {
  id: string
  mime: string
  bytes: number
  inline: boolean
}

export interface StageArtifact {
  id: string
  kind: StageKind
  change: StageChange
  title: string
  path?: string
  bytes: number
  truncated: boolean
  preview: StagePreview
  blob?: StageBlobRef
  order: number
}

export interface StageReport {
  artifacts: StageArtifact[]
  notes: string[]
  skipped: Array<{ path: string; bytes: number; reason: 'too-big' | 'too-many' }>
  workspace: string
}

// ------------------------------------------------------------------ reports

export interface RunReport {
  ok: boolean
  stdout: string
  tests: TestCase[]
  fatal: FatalError | null
  stage: StageReport | null
  durationMs: number
}

export interface ScriptReport {
  stdout: string
  fatal: FatalError | null
  stage: StageReport | null
  durationMs: number
}

/** Raw bytes that arrived alongside a report, keyed by blob id. */
export type StageBlobs = Record<string, ArrayBuffer>

// -------------------------------------------------------------------- specs

export interface RunSpec {
  /** Script mode only: let input() block and wait for a typed line. */
  interactive?: boolean
  /** The hidden test suite. Ignored in script mode. */
  tests?: string
  /** Per-project scaffolding: fixtures, fake modules, seeded data. */
  setup?: string
  /** Files written into the workspace before anything runs. */
  fixtures?: Record<string, string>
  /** Lines fed to input() when running a script without a live terminal. */
  stdin?: string[]
  /** Name the learner's code is registered under in sys.modules. */
  moduleName?: string
  workspace?: string
  seed?: number
  limits?: Partial<StageLimits>
}

export interface StageLimits {
  maxFiles: number
  maxBytesPerFile: number
  maxTotalBytes: number
  maxTextChars: number
  maxTableRows: number
  maxSheetCells: number
}

// ------------------------------------------------------------------- worker

export interface StdinTransferPayload {
  controlBuffer: SharedArrayBuffer
  interruptBuffer: SharedArrayBuffer
}

export type WorkerRequest =
  | { id: number; kind: 'boot'; stdin?: StdinTransferPayload }
  | { id: number; kind: 'capabilities' }
  | { id: number; kind: 'packages'; packages: string[] }
  | { id: number; kind: 'test'; code: string; spec: RunSpec; packages?: string[] }
  | { id: number; kind: 'script'; code: string; spec: RunSpec; packages?: string[] }

export type WorkerResponse =
  | { id: number; kind: 'status'; message: string }
  | { id: number; kind: 'ready' }
  /** Output as it is produced, so a blocked program still shows its prompt. */
  | { id: number; kind: 'stdout'; chunk: string }
  /** The worker is about to park in Atomics.wait. Nothing else reaches it. */
  | { id: number; kind: 'awaiting-input' }
  | { id: number; kind: 'result'; payload: unknown; blobs: Array<{ id: string; buffer: ArrayBuffer }> }
  | { id: number; kind: 'error'; message: string }
