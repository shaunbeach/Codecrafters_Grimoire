/**
 * Turning a project's declared package list into things Pyodide can load.
 *
 * Three kinds of package exist as far as this course is concerned:
 *
 *   in-lock    ships in Pyodide's own distribution; load it by bare name
 *   vendored   a pure-Python wheel we serve ourselves from public/pyodide/wheels
 *   stub       impossible in a browser; we supply a look-alike module instead
 *
 * This module is deliberately free of Vite-isms so the verification scripts can
 * import it under plain Node.
 */

export type PackageName =
  // vendored out of Pyodide's distribution
  | 'pillow'
  | 'beautifulsoup4'
  | 'lxml'
  | 'requests'
  | 'rich'
  | 'regex'
  | 'micropip'
  // vendored pure-Python wheels
  | 'openpyxl'
  | 'pypdf'
  | 'python-docx'
  // stand-ins
  | 'pyautogui'
  | 'pyperclip'

/**
 * Packages Pyodide resolves by name, whose wheels we serve from public/pyodide
 * alongside the runtime. Kept in step with DISTRIBUTION in sync-pyodide.mjs.
 *
 * numpy, pandas and matplotlib are deliberately absent — 10.7 MB that no module
 * in this course needs. Declaring them here without shipping them would mean
 * the browser quietly reaching for a CDN.
 */
export const IN_LOCK: ReadonlySet<string> = new Set([
  'pillow',
  'beautifulsoup4',
  'lxml',
  'requests',
  'rich',
  'regex',
  'micropip',
  'soupsieve',
  'typing-extensions',
])

/** Pure-Python wheels we serve ourselves. Keys match wheels.json. */
export const VENDORED: ReadonlySet<string> = new Set(['openpyxl', 'pypdf', 'python-docx'])

/** Libraries a browser genuinely cannot provide, replaced by a stand-in. */
export const STUBS: ReadonlySet<string> = new Set(['pyautogui', 'pyperclip'])

/**
 * Dependencies Pyodide will not resolve for us, because vendored wheels are
 * loaded by URL and carry no dependency resolution.
 */
const WHEEL_DEPENDENCIES: Record<string, string[]> = {
  openpyxl: ['et_xmlfile'],
  'python-docx': ['lxml', 'typing-extensions'],
}

/** The module name you import, when it differs from the package name. */
export const IMPORT_NAME: Record<string, string> = {
  pillow: 'PIL',
  beautifulsoup4: 'bs4',
  'python-docx': 'docx',
  'typing-extensions': 'typing_extensions',
  'et_xmlfile': 'et_xmlfile',
}

export interface ResolvedPackages {
  /** Passed straight to pyodide.loadPackage — bare names and wheel URLs. */
  load: string[]
  /** Stub module names the harness should install into sys.modules. */
  stubs: string[]
  /**
   * Declared packages that exist in Pyodide's lockfile but are not vendored
   * here. They still load — Pyodide fetches them at the moment a project asks
   * — but that costs a network round trip, so the caller can warn.
   */
  remote: string[]
  /** Anything we could not place at all, so the caller can fail loudly. */
  unknown: string[]
}

export interface ResolveOptions {
  /** Contents of public/pyodide/wheels/wheels.json. */
  wheels: Record<string, string>
  /** URL or path prefix the vendored wheels are served from. */
  wheelBase: string
  /**
   * Every package name in pyodide-lock.json. Anything here that we have not
   * vendored can still be fetched on demand — which is how this course stays
   * small while leaving room for a data-science track later, where numpy and
   * pandas are simply declared in a project and pulled when that project opens.
   */
  lockNames?: ReadonlySet<string>
}

export function resolvePackages(
  names: readonly string[],
  options: ResolveOptions,
): ResolvedPackages {
  const { wheels, wheelBase, lockNames } = options
  const load: string[] = []
  const stubs: string[] = []
  const remote: string[] = []
  const unknown: string[] = []
  const seen = new Set<string>()

  const add = (name: string) => {
    if (seen.has(name)) return
    seen.add(name)

    if (STUBS.has(name)) {
      stubs.push(name)
      return
    }

    if (wheels[name]) {
      // Dependencies first — a wheel loaded by URL brings nothing with it.
      for (const dependency of WHEEL_DEPENDENCIES[name] ?? []) add(dependency)
      load.push(wheelBase + wheels[name])
      return
    }

    if (IN_LOCK.has(name)) {
      // Vendored beside the runtime; Pyodide resolves it from indexURL.
      load.push(name)
      return
    }

    if (lockNames?.has(name.toLowerCase())) {
      // Known to Pyodide but not shipped with us: fetched when asked for.
      remote.push(name)
      load.push(name)
      return
    }

    unknown.push(name)
  }

  for (const name of names) add(name)
  return { load, stubs, remote, unknown }
}
