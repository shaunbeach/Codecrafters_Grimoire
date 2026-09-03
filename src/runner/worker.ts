/// <reference lib="webworker" />
import { HARNESS_PY } from './harness'
import { resolvePackages } from './packages'
import { STUB_SOURCES } from './stubs'
import { adoptStdinChannel, blockingReadLine, type StdinChannel } from './stdin'
import type { StdinTransferPayload, WorkerRequest } from './types'

type LoadPyodide = (opts: { indexURL: string }) => Promise<any>

// The runtime lives under public/pyodide/. Resolve it against Vite's base path
// so the app also works served from a subpath, as GitHub Pages does.
const BASE = import.meta.env.BASE_URL

let pyodide: any = null
let booting: Promise<any> | null = null
let wheels: Record<string, string> = {}
/** Everything Pyodide knows how to fetch, whether or not we vendored it. */
let lockNames: Set<string> = new Set()
/** Present only when the page is cross-origin isolated. */
let stdin: StdinChannel | null = null
let currentId = 0

/** Packages already loaded into this interpreter, so we only pay once. */
const loaded = new Set<string>()
const installedStubs = new Set<string>()

function post(message: unknown, transfer: Transferable[] = []) {
  ;(self as unknown as Worker).postMessage(message, transfer)
}

async function boot(id: number) {
  if (pyodide) return pyodide
  if (booting) return booting

  booting = (async () => {
    post({ id, kind: 'status', message: 'Loading the Python runtime…' })
    // From /public at runtime rather than bundled: Pyodide resolves its own
    // .wasm and stdlib relative to indexURL.
    const runtimeUrl = new URL(`${BASE}pyodide/pyodide.mjs`, self.location.origin).href
    const { loadPyodide } = (await import(/* @vite-ignore */ runtimeUrl)) as {
      loadPyodide: LoadPyodide
    }

    post({ id, kind: 'status', message: 'Starting Python…' })
    const py = await loadPyodide({ indexURL: `${BASE}pyodide/` })
    py.runPython(HARNESS_PY)

    wheels = await fetch(`${BASE}pyodide/wheels/wheels.json`)
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}))

    const lock = await fetch(`${BASE}pyodide/pyodide-lock.json`)
      .then((response) => (response.ok ? response.json() : { packages: {} }))
      .catch(() => ({ packages: {} }))
    lockNames = new Set(Object.keys(lock.packages ?? {}).map((name) => name.toLowerCase()))

    // Bridges into Python. The stdin one blocks this whole thread, which is
    // exactly what input() means; the stdout one streams output so a blocked
    // program has already shown its prompt.
    py.globals.set('__stdin_bridge', () => {
      if (!stdin) return null
      return blockingReadLine(stdin, () => {
        post({ id: currentId, kind: 'awaiting-input' })
      })
    })
    py.globals.set('__stdout_bridge', (chunk: string) => {
      if (chunk) post({ id: currentId, kind: 'stdout', chunk })
    })
    py.runPython('__harness_set_bridges(__stdin_bridge, __stdout_bridge)')

    if (stdin) py.setInterruptBuffer(stdin.interrupt)

    py.runPython('__harness_mark_baseline()')
    pyodide = py
    post({ id, kind: 'status', message: 'Python is ready.' })
    return py
  })()

  return booting
}

/**
 * Load whatever a project declared. Real packages come from Pyodide's
 * distribution or our vendored wheels; the impossible ones are replaced by a
 * stand-in module registered under the library's own name.
 */
async function ensurePackages(py: any, id: number, packages: readonly string[]) {
  if (!packages.length) return

  const { load, stubs, remote, unknown } = resolvePackages(packages, {
    wheels,
    wheelBase: `${BASE}pyodide/wheels/`,
    lockNames,
  })

  if (unknown.length) {
    throw new Error(
      `This project asks for ${unknown.join(', ')}, which the runtime does not know how to load.`,
    )
  }

  const missing = load.filter((name) => !loaded.has(name))
  if (missing.length) {
    const fetching = remote.filter((name) => !loaded.has(name))
    post({
      id,
      kind: 'status',
      message: fetching.length
        ? `Fetching ${fetching.join(', ')}…`
        : `Loading ${packages.join(', ')}…`,
    })
    await py.loadPackage(missing)
    missing.forEach((name) => loaded.add(name))
  }

  for (const name of stubs) {
    if (installedStubs.has(name)) continue
    const source = STUB_SOURCES[name]
    if (!source) throw new Error(`No stand-in module is available for ${name}.`)
    py.globals.set('__stub_name', name)
    py.globals.set('__stub_source', source)
    py.runPython('__harness_install_stub(__stub_name, __stub_source)')
    installedStubs.add(name)
  }

  // Packages and stubs are infrastructure, not project state — fold them into
  // the baseline so the per-run reset does not tear them back out.
  py.runPython('__harness_mark_baseline()')
}

/** Copy image bytes out of the WASM heap so they survive the next allocation. */
function drainBlobs(py: any): Array<{ id: string; buffer: ArrayBuffer }> {
  const ids: string[] = JSON.parse(py.runPython('__harness_blob_ids()'))
  const blobs: Array<{ id: string; buffer: ArrayBuffer }> = []

  for (const blobId of ids) {
    py.globals.set('__blob_id', blobId)
    const view = py.runPython('__harness_blob(__blob_id)').toJs() as Uint8Array
    const copy = new Uint8Array(view.length)
    copy.set(view)
    blobs.push({ id: blobId, buffer: copy.buffer })
  }

  py.runPython('__harness_clear_blobs()')
  return blobs
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data
  const started = performance.now()
  currentId = request.id

  try {
    // Adopt on whatever arrives first; boot installs the interrupt buffer.
    const offered = (request as { stdin?: StdinTransferPayload }).stdin
    if (offered && !stdin) stdin = adoptStdinChannel(offered)

    const py = await boot(request.id)

    if (request.kind === 'boot') {
      post({ id: request.id, kind: 'ready' })
      return
    }

    if (request.kind === 'capabilities') {
      post({
        id: request.id,
        kind: 'result',
        payload: JSON.parse(py.runPython('__harness_capabilities()')),
        blobs: [],
      })
      return
    }

    if (request.kind === 'packages') {
      await ensurePackages(py, request.id, request.packages)
      post({ id: request.id, kind: 'result', payload: { loaded: [...loaded] }, blobs: [] })
      return
    }

    await ensurePackages(py, request.id, request.packages ?? [])

    // Every run starts from a clean workspace and a clean interpreter.
    py.runPython('__harness_reset()')

    const spec = { ...(request.spec ?? {}) }
    if (request.kind === 'script') {
      spec.interactive = Boolean(spec.interactive) && stdin !== null
    }

    py.globals.set('__user_code', request.code)
    py.globals.set('__spec', JSON.stringify(spec))

    const raw: string =
      request.kind === 'test'
        ? py.runPython('__harness_run(__user_code, __spec)')
        : py.runPython('__harness_script(__user_code, __spec)')

    const payload = JSON.parse(raw)
    payload.durationMs = Math.round(performance.now() - started)

    const blobs = drainBlobs(py)
    post(
      { id: request.id, kind: 'result', payload, blobs },
      blobs.map((blob) => blob.buffer),
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    post({
      id: request.id,
      kind: 'error',
      message: message.includes('__grimoire_cancelled__')
        ? 'You stopped the program.'
        : message,
    })
  }
}
