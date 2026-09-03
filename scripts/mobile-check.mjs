// The workspace on a phone.
//
// Stacking the two panes put the editor, the run buttons and the Stage all
// below the fold: you pressed Run and the screen did not change. These checks
// are geometric on purpose — not "is the element in the DOM" but "is it inside
// the viewport", which is the only version of the question that matters here.
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5173'
const browser = await chromium.launch()

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail })

const PHONE = { width: 390, height: 844 }

const page = await browser.newPage({
  viewport: PHONE,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

/** Is the element's box inside the viewport, and actually painted? */
const onScreen = (locator) =>
  locator.evaluate((el) => {
    const b = el.getBoundingClientRect()
    const seen = b.width > 0 && b.height > 0
    return seen && b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth
  })

await page.goto(base, { waitUntil: 'networkidle' })
await page.evaluate(() =>
  localStorage.setItem(
    'grimoire.progress.v2',
    JSON.stringify({
      version: 2,
      passed: {},
      attempts: {},
      failures: {},
      hintsRevealed: {},
      startedOn: new Date().toISOString(),
      lastProject: null,
      freeRoam: true,
    }),
  ),
)

const first = await page.evaluate(
  async () => (await import('/src/course/index.ts')).ORDERED_PROJECT_IDS[0],
)
await page.goto(`${base}#/p/${encodeURIComponent(first)}`, { waitUntil: 'networkidle' })
await page.waitForSelector('[data-mobile-panes]', { timeout: 60000 })

// ------------------------------------------------------------ the fold
check('the pane switcher is shown on a phone', await onScreen(page.locator('[data-mobile-panes]')))
check(
  'the page itself does not scroll',
  await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1),
  await page.evaluate(() => `${document.documentElement.scrollHeight} > ${innerHeight}`),
)
check(
  'the brief is what opens first',
  (await page.locator('[data-mobile-panes] button[aria-pressed="true"]').innerText()) === 'Brief',
)
check('the brief is readable', await onScreen(page.locator('#read-panel-brief')))

// The editor and the run buttons must be reachable without hunting.
await page.locator('[data-mobile-panes] button', { hasText: 'Code' }).tap()
await page.waitForSelector('.cm-content', { timeout: 60000 })
check('Code shows the editor', await onScreen(page.locator('#editor')))
check(
  'the editor fills its frame, with no dead space',
  await page.evaluate(() => {
    const frame = document.querySelector('#editor').getBoundingClientRect().height
    const cm = document.querySelector('.cm-editor')?.getBoundingClientRect().height ?? 0
    return frame > 0 && frame - cm < 4
  }),
  await page.evaluate(() => {
    const frame = Math.round(document.querySelector('#editor').getBoundingClientRect().height)
    const cm = Math.round(document.querySelector('.cm-editor')?.getBoundingClientRect().height ?? 0)
    return `frame ${frame}px, editor ${cm}px`
  }),
)
const runButton = page.getByRole('button', { name: 'Run', exact: true })
check('Run is on screen beside the editor', await onScreen(runButton))
check(
  'the reading pane is out of the way',
  await page.locator('[data-pane="left"]').evaluate((el) => el.getBoundingClientRect().height === 0),
)

// --------------------------------------------- pressing Run shows the run
await page.locator('.cm-content').tap()
await page.keyboard.press('ControlOrMeta+a')
await page.keyboard.press('Backspace')
await page.keyboard.insertText('print("the output is visible")\n')
await runButton.tap()

check(
  'Run switches to Output by itself',
  (await page.locator('[data-mobile-panes] button[aria-pressed="true"]').innerText()).startsWith(
    'Output',
  ),
)

await page.waitForFunction(
  () => /the output is visible/.test(document.querySelector('#stage-panel-console')?.textContent ?? ''),
  null,
  { timeout: 180000 },
)
check('the console panel is inside the viewport', await onScreen(page.locator('#stage-panel-console')))
check(
  'the printed line is actually visible',
  await page.evaluate(() => {
    const pre = [...document.querySelectorAll('#stage-panel-console pre')].find((el) =>
      /the output is visible/.test(el.textContent),
    )
    if (!pre) return false
    const b = pre.getBoundingClientRect()
    return b.top >= 0 && b.top < innerHeight && b.height > 0
  }),
)
check('Run stays on screen after a run', await onScreen(runButton))

// ------------------------------------------------------- and so does Check
await page.getByRole('button', { name: 'Check', exact: true }).tap()
await page.waitForFunction(
  () => /passed|failed/i.test(document.querySelector('[aria-live="polite"].sr-only')?.textContent ?? ''),
  null,
  { timeout: 180000 },
)
check(
  'Check lands on the verdict too',
  (await page.locator('[data-mobile-panes] button[aria-pressed="true"]').innerText()).startsWith(
    'Output',
  ),
)
const tests = page.locator('#stage-panel-tests')
check('the test results are on screen', (await tests.count()) > 0 && (await onScreen(tests)))

// --------------------------------------------- a blocking prompt is usable
await page.locator('[data-mobile-panes] button', { hasText: 'Code' }).tap()
await page.locator('.cm-content').tap()
await page.keyboard.press('ControlOrMeta+a')
await page.keyboard.press('Backspace')
await page.keyboard.insertText('who = input("Name? ")\nprint("Hello,", who)\n')
await page.getByRole('button', { name: 'Run', exact: true }).tap()
const box = page.getByLabel('Your program is waiting for input')
await box.waitFor({ timeout: 180000 })
check('the input box is on screen when the program blocks', await onScreen(box))
await box.fill('Sabrina')
await page.keyboard.press('Enter')
await page.waitForFunction(
  () => /Hello, Sabrina/.test(document.querySelector('#stage-panel-console')?.textContent ?? ''),
  null,
  { timeout: 60000 },
)
check('typing an answer resumes the program', true)

// ------------------------------------------------ the desktop is untouched
const wide = await browser.newPage({ viewport: { width: 1500, height: 1000 } })
await wide.goto(`${base}#/p/${encodeURIComponent(first)}`, { waitUntil: 'networkidle' })
await wide.waitForSelector('.cm-content', { timeout: 60000 })
const together = await wide.evaluate(() => {
  const shown = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return false
    const b = el.getBoundingClientRect()
    return b.width > 0 && b.height > 0
  }
  const switcher = document.querySelector('[data-mobile-panes]')
  return {
    brief: shown('#read-panel-brief'),
    editor: shown('#editor'),
    stage: shown('#stage-panel-console'),
    switcherHidden: !switcher || switcher.getBoundingClientRect().height === 0,
  }
})
check(
  'on a wide screen all three panes still show at once',
  together.brief && together.editor && together.stage,
  JSON.stringify(together),
)
check('the switcher is hidden on a wide screen', together.switcherHidden)

const width = Math.max(...results.map((r) => r.name.length))
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}${r.ok ? '' : `  → ${r.detail}`}`)
}
const failed = results.filter((r) => !r.ok).length
if (errors.length) console.log('\nPAGE ERRORS:\n' + errors.slice(0, 6).join('\n'))
console.log(
  failed ? `\n${failed} of ${results.length} mobile checks failed.` : `\nAll ${results.length} mobile checks passed.`,
)
await browser.close()
process.exit(failed || errors.length ? 1 : 0)
