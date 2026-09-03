// A budget for what the first paint costs.
//
// The splitting is easy to undo by accident, and the failure is silent: one
// eager import in the wrong file pulls CodeMirror or 33,000 words of lesson
// prose back into the entry chunk, and the app just gets slower. Worse, a
// chunk can be split and still be downloaded immediately — a `modulepreload`
// link in the HTML head costs a visitor the bytes whether or not the code ever
// runs. Both failures happened while building this, so both are asserted.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const dist = join(ROOT, 'dist')
const assets = join(dist, 'assets')

if (!existsSync(assets)) {
  console.log('No dist/ — run `npm run build` first.')
  process.exit(1)
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  )

const files = walk(assets).map((path) => {
  const source = readFileSync(path)
  return {
    name: path.slice(assets.length + 1).replace(/\\/g, '/'),
    bytes: statSync(path).size,
    gzip: /\.(js|css)$/.test(path) ? gzipSync(source).length : null,
  }
})

const kb = (n) => `${(n / 1024).toFixed(1)} kB`
const find = (pattern) => files.filter((f) => pattern.test(f.name))
const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail })

const entry = find(/^index-.*\.js$/)[0]
const css = find(/^index-.*\.css$/)[0]
const editor = find(/^Editor-.*\.js$/)[0]
const workspace = find(/^ProjectView-.*\.js$/)[0]
const content = find(/^content\//)
const worker = find(/^worker-.*\.js$/)[0]

// What a visitor downloads before the map appears.
const BUDGET_GZIP = 110 * 1024

check('an entry chunk exists', entry, files.map((f) => f.name).join(', '))
check(
  `entry chunk is under ${kb(BUDGET_GZIP)} gzipped`,
  entry && entry.gzip < BUDGET_GZIP,
  entry && `${kb(entry.gzip)} gzipped, ${kb(entry.bytes)} raw`,
)

check('CodeMirror is a chunk of its own', editor, 'no Editor-*.js chunk')
check('the workspace is a chunk of its own', workspace, 'no ProjectView-*.js chunk')
check(`course content is split per module (${content.length})`, content.length >= 20,
  `${content.length} content chunks`)

const contentBytes = content.reduce((total, f) => total + f.bytes, 0)
check(
  'the entry chunk carries no lesson prose',
  entry && entry.bytes < contentBytes,
  entry && `entry ${kb(entry.bytes)} vs ${kb(contentBytes)} of content`,
)
check(
  'the entry chunk does not contain the editor',
  entry && editor && entry.bytes < editor.bytes,
  entry && editor && `entry ${kb(entry.bytes)} vs editor ${kb(editor.bytes)}`,
)

const oversized = content.filter((f) => f.bytes > 120 * 1024)
check('no content chunk is oversized', oversized.length === 0,
  oversized.map((f) => `${f.name} ${kb(f.bytes)}`).join(', '))

check('the Python worker is its own file', worker, 'no worker-*.js')

// ------------------------------------------------ split, and actually lazy
//
// A `<link rel="modulepreload">` for a lazy chunk downloads it during first
// paint. Splitting it and then preloading it is worse than not splitting: same
// bytes, more requests.
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const preloaded = [...html.matchAll(/rel="modulepreload"[^>]*href="([^"]+)"/g)].map((m) => m[1])
const lazily = /(content\/|Editor-|ProjectView-|GrimoireView-|WizardGallery-)/
const wrongly = preloaded.filter((href) => lazily.test(href))
check('the HTML preloads no lazy chunk', wrongly.length === 0, wrongly.join(', '))
check('the HTML preloads little', preloaded.length <= 3,
  `${preloaded.length}: ${preloaded.map((h) => h.split('/').pop()).join(', ')}`)

const width = Math.max(...results.map((r) => r.name.length))
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}${r.ok ? '' : `  → ${r.detail}`}`)
}

const row = (label, bytes, gzip) =>
  `  ${label.padEnd(30)} ${kb(bytes).padStart(10)}  ${(gzip == null ? '' : kb(gzip)).padStart(10)}${gzip == null ? '' : ' gzipped'}`

console.log('\nFirst paint')
for (const asset of [entry, css].filter(Boolean)) console.log(row(asset.name, asset.bytes, asset.gzip))
console.log(
  `  ${'TOTAL'.padEnd(30)} ${''.padStart(10)}  ` +
    `${kb([entry, css].filter(Boolean).reduce((t, f) => t + f.gzip, 0)).padStart(10)} gzipped`,
)

console.log('\nOn demand')
for (const asset of [workspace, editor].filter(Boolean)) console.log(row(asset.name, asset.bytes, asset.gzip))
console.log(row(`${content.length} content chunks`, contentBytes, content.reduce((t, f) => t + f.gzip, 0)))
console.log(
  `  ${'largest single module'.padEnd(30)} ` +
    `${kb(Math.max(...content.map((f) => f.bytes))).padStart(10)}`,
)

const failed = results.filter((r) => !r.ok).length
console.log(failed ? `\n${failed} bundle check(s) failed.` : `\nAll ${results.length} bundle checks passed.`)
process.exit(failed ? 1 : 0)
