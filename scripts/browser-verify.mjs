// Runs every project's reference solution through the real in-browser worker, so
// we know Pyodide-in-Chromium behaves the same as Pyodide-in-Node — including
// vendored wheels, the stand-in modules and the workspace diff.
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5173'
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('pageerror', (error) => errors.push(error.message))

// Nothing may leave the origin. If Pyodide reaches for a CDN wheel, the offline
// promise is broken and this is where we find out — not a learner on a plane.
const offOrigin = []
await page.route('**', (route) => {
  const url = route.request().url()
  if (url.startsWith(base) || url.startsWith('data:') || url.startsWith('blob:')) {
    return route.continue()
  }
  offOrigin.push(url)
  return route.abort()
})

await page.goto(base, { waitUntil: 'networkidle' })

const results = await page.evaluate(async () => {
  const { COURSE, loadProjectContent } = await import('/src/course/index.ts')
  const { pythonRunner } = await import('/src/runner/pythonRunner.ts')

  const out = []
  for (const project of COURSE.projects) {
    try {
      // Content is fetched per module now, exactly as the app fetches it — so
      // a broken content chunk fails here rather than in front of a learner.
      const content = await loadProjectContent(project.id)
      const { report } = await pythonRunner.runTests(
        content.solution,
        { tests: content.tests, setup: content.setup },
        project.packages,
      )
      out.push({
        id: project.id,
        ok: report.ok,
        total: report.tests.length,
        touched: report.stage?.artifacts.length ?? 0,
        fatal: report.fatal ? `${report.fatal.headline}\n${report.fatal.traceback}` : null,
        failing: report.tests.filter((t) => !t.passed).map((t) => `${t.name}: ${t.message}`),
      })
    } catch (error) {
      out.push({ id: project.id, ok: false, thrown: String(error) })
    }
  }
  return out
})

// A separate pass for the machinery the 30 days do not exercise: vendored
// wheels, the stand-in modules and byte transport all live in the worker.
const runtime = await page.evaluate(async () => {
  const { pythonRunner } = await import('/src/runner/pythonRunner.ts')
  const checks = []

  const sheet = await pythonRunner.runScript(
    'from openpyxl import Workbook\n' +
      'wb = Workbook(); wb.active.append(["Region", "Sales"]); wb.active.append(["North", 4200])\n' +
      'wb.save("sales.xlsx")\n',
    {},
    ['openpyxl'],
  )
  const grid = sheet.report.stage?.artifacts.find((a) => a.path === 'sales.xlsx')
  checks.push({
    name: 'vendored openpyxl wheel loads and decodes',
    ok: grid?.preview?.sheets?.[0]?.rows?.[1]?.[1] === 4200,
    detail: sheet.report.fatal?.headline ?? JSON.stringify(grid?.preview?.sheets?.[0]?.rows),
  })

  const image = await pythonRunner.runScript(
    'from PIL import Image\nImage.new("RGB", (40, 20), "red").save("dot.png")\n',
    {},
    ['pillow'],
  )
  const art = image.report.stage?.artifacts.find((a) => a.path === 'dot.png')
  const buffer = art?.blob ? image.blobs[art.blob.id] : null
  const head = buffer ? new Uint8Array(buffer).slice(0, 4) : null
  checks.push({
    name: 'image bytes transfer to the main thread',
    ok: Boolean(head && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47),
    detail: buffer ? `${buffer.byteLength} bytes` : (image.report.fatal?.headline ?? 'no blob'),
  })

  const gui = await pythonRunner.runScript(
    'import pyautogui\npyautogui.click(10, 20)\nprint(len(pyautogui.EVENTS))\n',
    {},
    ['pyautogui'],
  )
  checks.push({
    name: 'pyautogui stand-in works in the browser',
    ok: gui.report.stdout.trim() === '1',
    detail: gui.report.fatal?.headline ?? gui.report.stdout.trim(),
  })

  return checks
})

let bad = 0
for (const row of results) {
  const label = row.id
  if (row.ok) {
    const touched = row.touched ? `, ${row.touched} files touched` : ''
    console.log(`✓ ${label}  ${row.total} tests${touched}`)
  } else {
    bad++
    console.log(`✗ ${label}  ${row.thrown || row.fatal || ''}`)
    ;(row.failing || []).forEach((f) => console.log('    - ' + f))
  }
}

console.log('\nRuntime machinery')
for (const check of runtime) {
  if (!check.ok) bad++
  console.log(`${check.ok ? '✓' : '✗'} ${check.name}${check.ok ? '' : `  → ${check.detail}`}`)
}

console.log('\nOffline')
if (offOrigin.length) {
  bad++
  const unique = [...new Set(offOrigin)]
  console.log(`✗ ${unique.length} request(s) tried to leave the origin:`)
  unique.slice(0, 8).forEach((url) => console.log('    ' + url))
} else {
  console.log('✓ no request left the origin')
}

if (errors.length) console.log('\nPAGE ERRORS:\n' + errors.join('\n'))
console.log(
  bad ? `\n${bad} check(s) failed in the browser.` : `\nAll ${results.length} projects and ${runtime.length} runtime checks pass in the browser.`,
)

await browser.close()
process.exit(bad ? 1 : 0)
