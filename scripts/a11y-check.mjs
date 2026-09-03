// Phase 6 acceptance: the app is operable from the keyboard alone, and the
// Quest Map's list fallback says exactly what the pictorial map says.
//
// Not an axe-style rule sweep — those catch missing alt text, not a tab strip
// you cannot leave. These are the journeys a keyboard or screen-reader user
// actually has to complete: reach the course, read the state, open a project,
// move between tabs, ask for a hint, and be told what the run did.
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })

const errors = []
page.on('pageerror', (e) => errors.push(e.message))

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail })

/** The accessible name a screen reader would announce, near enough. */
const nameOf = (locator) =>
  locator.evaluate((el) => el.getAttribute('aria-label') || el.textContent.replace(/\s+/g, ' ').trim())

// Free roam, so the whole course is reachable and statuses are interesting.
await page.goto(base, { waitUntil: 'networkidle' })
await page.evaluate(() => {
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
      freeRoam: false,
    }),
  )
  localStorage.setItem('grimoire.mapView', 'map')
})
await page.goto(base, { waitUntil: 'networkidle' })

// ------------------------------------------------------------- landmarks
check('page has one main landmark', (await page.locator('main').count()) === 1)
check('page has a level-1 heading', (await page.locator('h1').count()) === 1)
check(
  'progress is exposed as a progressbar',
  await page.locator('[role="progressbar"][aria-valuenow]').count(),
)
check(
  'document title names the app',
  (await page.title()).includes('Grimoire'),
  await page.title(),
)

// No positive tabindex anywhere: it reorders the whole page for everyone.
check(
  'no positive tabindex',
  (await page.locator('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').count()) === 0,
)

// ------------------------------------------------------------- skip link
await page.keyboard.press('Tab')
const first = await nameOf(page.locator(':focus'))
check('first tab stop is the skip link', /skip to the course/i.test(first), first)
await page.keyboard.press('Enter')
const skipped = await page.evaluate(() => document.activeElement?.id)
check('skip link moves focus to the course', skipped === 'course', String(skipped))

// ------------------------------------------------- map and list agree exactly
//
// The list is not a summary of the map, it is the same data. If they ever
// disagree, one of them is lying to somebody about what they may open.
const mapState = await page.evaluate(() =>
  [...document.querySelectorAll('main button[aria-label]')].map((el) => el.getAttribute('aria-label')),
)

await page.getByRole('button', { name: 'List', exact: true }).click()
await page.waitForTimeout(150)

const listState = await page.evaluate(() =>
  [...document.querySelectorAll('main li button')].map((el) => {
    // Direct children only: the row is icon / (title, tagline) / status, and
    // a descendant search finds the tagline first.
    const columns = [...el.children]
    const title = columns[1]?.firstElementChild?.textContent?.trim() ?? ''
    const status = columns[columns.length - 1]?.textContent?.trim() ?? ''
    return { title, status, disabled: el.disabled, current: el.getAttribute('aria-current') === 'step' }
  }),
)

check('list has a row per map node', listState.length === mapState.length,
  `${listState.length} rows vs ${mapState.length} nodes`)

const mismatched = listState.filter((row, index) => {
  const label = mapState[index] ?? ''
  if (!label.startsWith(row.title)) return true
  // "Passed" / "Open" / "Locked" — the map says it in its label, the list in
  // its trailing column. Both must say the same word about the same project.
  const word = row.status.split('·')[0].trim()
  return !label.includes(word)
})
check('every row reports the same status as its node', mismatched.length === 0,
  JSON.stringify(mismatched.slice(0, 3)))

const lockedRows = listState.filter((row) => row.status.startsWith('Locked'))
check('locked rows are disabled in the list too',
  lockedRows.length > 0 && lockedRows.every((row) => row.disabled),
  `${lockedRows.filter((r) => !r.disabled).length} locked rows still enabled`)
check('exactly one row is marked as where you are',
  listState.filter((row) => row.current).length === 1)

await page.getByRole('button', { name: 'Map', exact: true }).click()

// --------------------------------------------------------- the workspace
const firstProject = await page.evaluate(async () => {
  const { ORDERED_PROJECT_IDS } = await import('/src/course/index.ts')
  return ORDERED_PROJECT_IDS[0]
})
await page.goto(`${base}#/p/${encodeURIComponent(firstProject)}`, { waitUntil: 'networkidle' })
await page.waitForSelector('.cm-content', { timeout: 60000 })

check('workspace title names the project',
  (await page.title()).includes(await page.locator('h1').first().innerText()),
  await page.title())
check('workspace has one main landmark', (await page.locator('main').count()) === 1)

// Reading tabs: one tab stop, arrows move within it.
const readTabs = page.locator('[role="tablist"][aria-label="Reading"] [role="tab"]')
check('reading tabs are a tablist', (await readTabs.count()) === 3)
check('only the selected reading tab is in the tab order',
  (await page.locator('[role="tablist"][aria-label="Reading"] [role="tab"][tabindex="0"]').count()) === 1)

await readTabs.first().focus()
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(100)
check('ArrowRight selects the next reading tab',
  (await nameOf(page.locator(':focus'))) === 'Lesson' &&
    (await page.locator('[role="tab"][aria-selected="true"]').first().innerText()) === 'Lesson')
await page.keyboard.press('End')
await page.waitForTimeout(100)
check('End selects the last reading tab', (await nameOf(page.locator(':focus'))) === 'Notes')
await page.keyboard.press('Home')
await page.waitForTimeout(150)
check('Home returns to the first', (await nameOf(page.locator(':focus'))) === 'Brief')

// Output tabs, same contract.
const stageTabs = page.locator('[role="tablist"][aria-label="Output"] [role="tab"]')
await stageTabs.first().focus()
await page.keyboard.press('ArrowLeft')
await page.waitForTimeout(100)
check('ArrowLeft wraps around the output tabs',
  (await nameOf(page.locator(':focus'))).startsWith('Tests'),
  await nameOf(page.locator(':focus')))

// The splitter must be movable without a mouse.
const splitter = page.locator('[role="separator"][aria-valuenow]')
check('splitter exposes a value', await splitter.count())
const before = await splitter.getAttribute('aria-valuenow')
await splitter.focus()
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(80)
const after = await splitter.getAttribute('aria-valuenow')
check('splitter moves with the arrow keys', Number(after) > Number(before), `${before} → ${after}`)

// --------------------------------------------------------------- hints
const hintButton = page.getByRole('button', { name: /Ask for a hint/ })
check('a hint can be asked for', await hintButton.count())
await hintButton.click()
await page.waitForTimeout(200)
check('revealed hints land in a live region',
  await page.locator('[aria-live="polite"] li').count(),
  'no live hint list')
check('the button now offers the next tier',
  await page.getByRole('button', { name: /Ask for more \(2 of 3\)/ }).count())

// ------------------------------------------------- the run is announced
await page.locator('.cm-content').click()
await page.keyboard.press('ControlOrMeta+a')
await page.keyboard.press('Backspace')
await page.keyboard.insertText('print("keyboard only")\n')
await page.getByRole('button', { name: 'Check', exact: true }).click()
await page.waitForFunction(
  () => /passed|failed|error/i.test(document.querySelector('[aria-live="polite"].sr-only')?.textContent ?? ''),
  { timeout: 120000 },
)
const spoken = await page.locator('[aria-live="polite"].sr-only').innerText()
check('the verdict is announced, not only coloured', /checks (passed|failed)|error/i.test(spoken), spoken)

// Escape leaves the workspace — the documented way out.
await page.keyboard.press('Escape')
await page.waitForTimeout(200)
check('Escape returns to the map', page.url().endsWith('#/'), page.url())

const width = Math.max(...results.map((r) => r.name.length))
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}${r.ok ? '' : `  → ${r.detail}`}`)
}
const failed = results.filter((r) => !r.ok).length
if (errors.length) console.log('\nPAGE ERRORS:\n' + errors.slice(0, 6).join('\n'))
console.log(
  failed
    ? `\n${failed} of ${results.length} accessibility checks failed.`
    : `\nAll ${results.length} accessibility checks passed.`,
)
await browser.close()
process.exit(failed || errors.length ? 1 : 0)
