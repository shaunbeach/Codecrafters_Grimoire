// Phase 6 acceptance, against the built app rather than the dev server.
//
// Dev mode serves every module unbundled, so it cannot tell you whether the
// code splitting worked — or whether it broke something. This runs `vite
// preview` output and watches the network: what arrives before the map, what
// only arrives when a project opens, and whether Pyodide still boots in a
// worker once the worker is a hashed file in dist/ rather than a source path.
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })

const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

const requested = []
page.on('request', (r) => requested.push(r.url()))
const asked = (pattern) => requested.filter((url) => pattern.test(url))

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail })

// ------------------------------------------------------------ the map alone
await page.goto(base, { waitUntil: 'networkidle' })

check('the built map renders', (await page.locator('h1').first().innerText()).includes('Grimoire'))
check('cross-origin isolated in preview',
  await page.evaluate(() => globalThis.crossOriginIsolated === true))
check('no console errors on first load', errors.length === 0, errors.slice(0, 3).join(' | '))

// The whole point of the phase: none of this is paid for by someone looking
// at a map. (The workspace chunk is deliberately prefetched when the browser
// goes idle, so it is excluded — it is a prefetch, not a blocking cost.)
check('the editor did not load with the map', asked(/\/Editor-.*\.js/).length === 0,
  asked(/\/Editor-.*\.js/)[0] ?? '')
check('no lesson content loaded with the map', asked(/\/content\//).length === 0,
  `${asked(/\/content\//).length} content chunks`)
check('Pyodide did not load with the map', asked(/pyodide.*\.(js|wasm)/).length === 0,
  `${asked(/pyodide/).length} pyodide requests`)

const eager = asked(/\/assets\/.*\.(js|css)$/).filter((url) => !/content\/|Editor-/.test(url))
check('first paint is a handful of files', eager.length <= 6, `${eager.length}: ${eager.map((u) => u.split('/').pop()).join(', ')}`)

// ------------------------------------------------------- opening a project
const before = requested.length
await page.getByRole('button', { name: /^(Begin|Continue) — / }).click()
await page.waitForSelector('.cm-content', { timeout: 60000 })

const since = requested.slice(before)
check('opening a project fetches the editor',
  since.some((url) => /\/Editor-.*\.js/.test(url)) || asked(/\/Editor-.*\.js/).length > 0)
check('opening a project fetches exactly one module of content',
  new Set(asked(/\/content\//).map((u) => u.split('/').pop().replace(/-\w+\.js$/, ''))).size === 1,
  asked(/\/content\//).map((u) => u.split('/').pop()).join(', '))

check('the brief rendered from the fetched chunk',
  (await page.locator('#read-panel-brief').innerText()).length > 200)
check('the starter code reached the editor',
  (await page.locator('.cm-content').innerText()).trim().length > 0)

// --------------------------------------------- Pyodide, in the built worker
await page.locator('.cm-content').click()
await page.keyboard.press('ControlOrMeta+a')
await page.keyboard.press('Backspace')
await page.keyboard.insertText('import sys\nprint("built", sys.version_info.major)\n')
await page.getByRole('button', { name: 'Run', exact: true }).click()
await page.waitForFunction(
  () => /built 3/.test(document.querySelector('#stage-panel-console')?.textContent ?? ''),
  { timeout: 180000 },
)
check('Pyodide boots and runs in the production worker', true)
check('the worker was served as its own hashed file', asked(/\/assets\/worker-.*\.js/).length > 0,
  'no worker-*.js request')

// Grading, through the lazily fetched tests.
await page.getByRole('button', { name: 'Check', exact: true }).click()
await page.waitForFunction(
  () => /passed|failed/i.test(document.querySelector('[aria-live="polite"].sr-only')?.textContent ?? ''),
  { timeout: 180000 },
)
const verdict = await page.locator('[aria-live="polite"].sr-only').innerText()
check('the hidden suite ran from its content chunk', /checks? (passed|failed)/i.test(verdict), verdict)

// ------------------------------------------------------------- second visit
// A different module must fetch its own content, and not refetch the editor.
const beforeSecond = requested.length
await page.goto(`${base}#/`, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  const stored = JSON.parse(localStorage.getItem('grimoire.progress.v2') ?? '{}')
  localStorage.setItem('grimoire.progress.v2', JSON.stringify({ ...stored, freeRoam: true }))
})
await page.reload({ waitUntil: 'networkidle' })
await page.goto(`${base}#/p/m20-trial.p1-the-plan`, { waitUntil: 'networkidle' })
await page.waitForSelector('.cm-content', { timeout: 60000 })
const secondPass = requested.slice(beforeSecond)
check('a second module fetches its own content',
  secondPass.some((url) => /content\/m20-trial/.test(url)),
  secondPass.filter((u) => /content\//.test(u)).join(', '))

check('no console errors across the whole run', errors.length === 0, errors.slice(0, 3).join(' | '))

const width = Math.max(...results.map((r) => r.name.length))
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}${r.ok ? '' : `  → ${r.detail}`}`)
}
const failed = results.filter((r) => !r.ok).length
console.log(
  failed
    ? `\n${failed} of ${results.length} production checks failed.`
    : `\nAll ${results.length} production checks passed.`,
)
await browser.close()
process.exit(failed ? 1 : 0)
