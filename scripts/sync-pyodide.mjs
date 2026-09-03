// Assembles everything Python needs into public/, so the app serves its own
// runtime instead of depending on a CDN at run time.
//
//   1. the Pyodide core, copied out of node_modules
//   2. pure-Python wheels that Pyodide's distribution does not carry
//
// Run by `npm install` (postinstall) and by `npm run sync-pyodide`.
import { copyFileSync, mkdirSync, existsSync, writeFileSync, statSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const runtimeDir = join(root, 'public/pyodide')
const wheelDir = join(runtimeDir, 'wheels')

const CORE_FILES = [
  'pyodide.mjs',
  'pyodide.js',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
]

/**
 * Wheels we vendor ourselves. Every one is `py3-none-any` — pure Python, no
 * compilation — which is the only reason this is possible offline. Versions are
 * pinned so a course that verifies today verifies identically next year.
 *
 * Their own dependencies (lxml, typing-extensions) already ship in Pyodide's
 * distribution, so this list is closed.
 */
const WHEELS = [
  { project: 'openpyxl', version: '3.1.5' },
  { project: 'et_xmlfile', version: '2.0.0' }, // openpyxl's only dependency
  { project: 'pypdf', version: '6.16.2' },
  { project: 'python-docx', version: '1.2.0' },
]

/**
 * Packages that live in Pyodide's own distribution but ship as separate wheel
 * files. Pyodide resolves these relative to indexURL, so unless they sit beside
 * the runtime the browser silently falls back to a CDN — which defeats the
 * offline promise and will break under cross-origin isolation later.
 *
 * Dependencies are resolved from the lockfile, so this list is only the
 * packages a project may name directly. The scientific stack (numpy, pandas,
 * matplotlib) is deliberately absent: it is 10.7 MB and no module needs it.
 */
const DISTRIBUTION = [
  'pillow',
  'beautifulsoup4',
  'lxml',
  'requests',
  'regex',
  'rich',
  'micropip',
]

function copyCore() {
  mkdirSync(runtimeDir, { recursive: true })
  for (const name of CORE_FILES) {
    copyFileSync(join(root, 'node_modules/pyodide', name), join(runtimeDir, name))
  }
  console.log(`runtime  ${CORE_FILES.length} files -> public/pyodide/`)
}

async function wheelUrl({ project, version }) {
  const response = await fetch(`https://pypi.org/pypi/${project}/${version}/json`)
  if (!response.ok) throw new Error(`PyPI lookup failed for ${project} ${version}`)
  const data = await response.json()
  const wheel = data.urls.find(
    (file) => file.packagetype === 'bdist_wheel' && file.filename.endsWith('-none-any.whl'),
  )
  if (!wheel) throw new Error(`${project} ${version} has no pure-Python wheel`)
  return wheel
}

async function fetchWheels() {
  mkdirSync(wheelDir, { recursive: true })
  const manifest = {}

  for (const pin of WHEELS) {
    const wheel = await wheelUrl(pin)
    const target = join(wheelDir, wheel.filename)
    manifest[pin.project] = wheel.filename

    if (existsSync(target)) {
      console.log(`wheel    ${wheel.filename} (cached)`)
      continue
    }
    const bytes = Buffer.from(await (await fetch(wheel.url)).arrayBuffer())
    writeFileSync(target, bytes)
    console.log(`wheel    ${wheel.filename} (${Math.round(bytes.length / 1024)} KB)`)
  }

  // The runtime reads this to turn a package name into a wheel URL.
  writeFileSync(join(wheelDir, 'wheels.json'), JSON.stringify(manifest, null, 2) + '\n')
  const total = Object.values(manifest).reduce(
    (sum, name) => sum + statSync(join(wheelDir, name)).size,
    0,
  )
  console.log(`wheels   ${Object.keys(manifest).length} pinned, ${Math.round(total / 1024)} KB total`)
}

/** Every package `names` needs, including transitive dependencies. */
function closure(names, lock) {
  const byName = new Map(Object.entries(lock.packages).map(([key, p]) => [key.toLowerCase(), p]))
  const chosen = new Map()

  const visit = (name) => {
    const entry = byName.get(name.toLowerCase())
    if (!entry || chosen.has(entry.file_name)) return
    chosen.set(entry.file_name, entry)
    for (const dependency of entry.depends ?? []) visit(dependency)
  }

  for (const name of names) {
    if (!byName.has(name.toLowerCase())) throw new Error(`${name} is not in pyodide-lock.json`)
    visit(name)
  }
  return [...chosen.values()]
}

async function fetchDistribution() {
  const lock = JSON.parse(readFileSync(join(runtimeDir, 'pyodide-lock.json'), 'utf8'))
  const version = JSON.parse(readFileSync(join(root, 'node_modules/pyodide/package.json'), 'utf8')).version
  const cdn = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`
  const cache = join(root, 'node_modules/pyodide')

  const packages = closure(DISTRIBUTION, lock)
  let total = 0
  let fetched = 0

  for (const entry of packages) {
    const target = join(runtimeDir, entry.file_name)
    if (!existsSync(target)) {
      const cached = join(cache, entry.file_name)
      if (existsSync(cached)) {
        copyFileSync(cached, target)
      } else {
        const response = await fetch(cdn + entry.file_name)
        if (!response.ok) throw new Error(`Could not fetch ${entry.file_name} from ${cdn}`)
        writeFileSync(target, Buffer.from(await response.arrayBuffer()))
        fetched++
      }
    }
    total += statSync(target).size
  }

  console.log(
    `packages ${packages.length} from the distribution` +
      `${fetched ? ` (${fetched} downloaded)` : ''}, ${(total / 1024 / 1024).toFixed(1)} MB total`,
  )
}

copyCore()
await fetchWheels()
await fetchDistribution()
