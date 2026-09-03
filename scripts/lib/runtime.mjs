// Boots the same Python runtime the browser uses, under Node. Shared by every
// verification script so there is exactly one definition of "the runtime".
import { loadPyodide } from 'pyodide'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')

/** Pull the Python source out of harness.ts without importing TypeScript. */
export function harnessSource() {
  const ts = readFileSync(join(ROOT, 'src/runner/harness.ts'), 'utf8')
  const start = ts.indexOf('String.raw`') + 'String.raw`'.length
  const end = ts.lastIndexOf('`;')
  const source = ts.slice(start, end)

  // This extraction is regex-based and forgiving; the TypeScript parser is not.
  // A backtick or ${ inside the Python ends the template literal early and
  // breaks the browser build while these scripts carry on happily — so fail
  // here too, where the feedback is immediate.
  if (source.includes('`') || source.includes('${')) {
    throw new Error(
      'harness.ts: the Python source contains a backtick or ${ — either would ' +
        'terminate the template literal. Use plain quotes in docstrings.',
    )
  }
  return source
}

/** The stand-in modules, read straight off disk. */
export function stubSources() {
  const dir = join(ROOT, 'src/runner/stubs')
  const stubs = {}
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.py'))) {
    stubs[name.replace(/\.py$/, '')] = readFileSync(join(dir, name), 'utf8')
  }
  return stubs
}

export function wheelManifest() {
  const path = join(ROOT, 'public/pyodide/wheels/wheels.json')
  if (!existsSync(path)) {
    throw new Error('public/pyodide/wheels/wheels.json is missing — run: npm run sync-pyodide')
  }
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** Wheels are loaded by URL; under Node that means a file:// URL. */
export const WHEEL_BASE = pathToFileURL(join(ROOT, 'public/pyodide/wheels/')).href

/**
 * A booted interpreter plus the small amount of plumbing the worker also does.
 * `packages` are loaded once here; call `mark()` afterwards so `reset()` knows
 * what "clean" means.
 */
export async function bootRuntime({ packages = [], stubs = [] } = {}) {
  const py = await loadPyodide({ indexURL: join(ROOT, 'node_modules/pyodide') })
  py.runPython(harnessSource())

  const api = {
    py,
    async load(names) {
      const { load, stubs: needed, unknown } = resolveWith(names)
      if (unknown.length) throw new Error(`Unknown packages: ${unknown.join(', ')}`)
      if (load.length) await py.loadPackage(load)
      const sources = stubSources()
      for (const name of needed) {
        if (!sources[name]) throw new Error(`No stub source for ${name}`)
        py.globals.set('__stub_name', name)
        py.globals.set('__stub_source', sources[name])
        py.runPython('__harness_install_stub(__stub_name, __stub_source)')
      }
      return { load, stubs: needed }
    },
    mark() {
      py.runPython('__harness_mark_baseline()')
    },
    reset() {
      py.runPython('__harness_reset()')
    },
    runTests(code, spec) {
      py.globals.set('__code', code)
      py.globals.set('__spec', JSON.stringify(spec))
      return JSON.parse(py.runPython('__harness_run(__code, __spec)'))
    },
    runScript(code, spec) {
      py.globals.set('__code', code)
      py.globals.set('__spec', JSON.stringify(spec))
      return JSON.parse(py.runPython('__harness_script(__code, __spec)'))
    },
    blobs() {
      const ids = JSON.parse(py.runPython('__harness_blob_ids()'))
      const out = {}
      for (const id of ids) {
        py.globals.set('__blob_id', id)
        out[id] = py.runPython('__harness_blob(__blob_id)').toJs()
      }
      return out
    },
  }

  if (stubs.length || packages.length) await api.load([...packages, ...stubs])
  api.mark()
  return api
}

// packages.ts is TypeScript; Node cannot import it directly in every version,
// so mirror the tiny bit of logic the scripts need.
let cachedResolver = null
function resolveWith(names) {
  if (!cachedResolver) cachedResolver = buildResolver()
  return cachedResolver(names)
}

function buildResolver() {
  const source = readFileSync(join(ROOT, 'src/runner/packages.ts'), 'utf8')
  const grab = (name) => {
    const match = source.match(new RegExp(`${name}[^=]*=\\s*new Set\\(\\[([^\\]]*)\\]`))
    return new Set(
      (match?.[1] ?? '')
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean),
    )
  }
  const inLock = grab('IN_LOCK')
  const stubs = grab('STUBS')
  const wheels = wheelManifest()
  const deps = { openpyxl: ['et_xmlfile'], 'python-docx': ['lxml', 'typing-extensions'] }

  // Anything in the lockfile can be fetched on demand even when not vendored.
  const lock = JSON.parse(
    readFileSync(join(ROOT, 'public/pyodide/pyodide-lock.json'), 'utf8'),
  )
  const lockNames = new Set(Object.keys(lock.packages ?? {}).map((n) => n.toLowerCase()))

  return (names) => {
    const load = []
    const needed = []
    const remote = []
    const unknown = []
    const seen = new Set()
    const add = (name) => {
      if (seen.has(name)) return
      seen.add(name)
      if (stubs.has(name)) return void needed.push(name)
      if (wheels[name]) {
        for (const d of deps[name] ?? []) add(d)
        return void load.push(WHEEL_BASE + wheels[name])
      }
      if (inLock.has(name)) return void load.push(name)
      if (lockNames.has(name.toLowerCase())) {
        remote.push(name)
        return void load.push(name)
      }
      unknown.push(name)
    }
    for (const n of names) add(n)
    return { load, stubs: needed, remote, unknown }
  }
}
