// Phase 2 acceptance: the shell renders, the wizard's states are reviewable,
// and the Stage receives real output from the Phase 1 runtime.
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5173'
const out = process.env.OUT || '/tmp/shots2'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })

const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail })

await page.goto(base, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${out}/1-map.png` })

check('map renders', (await page.locator('h1').first().innerText()).includes('Grimoire'))
check('cross-origin isolated', await page.evaluate(() => globalThis.crossOriginIsolated === true))
check('act sections present', (await page.locator('section[aria-labelledby^="act-"]').count()) === 3,
  String(await page.locator('section[aria-labelledby^="act-"]').count()))
// Read the expected count from the course rather than hardcoding it, so adding
// a module does not fail a test that has nothing to do with it.
const expectedNodes = await page.evaluate(async () => {
  const { TOTAL_PROJECTS } = await import('/src/course/index.ts')
  return TOTAL_PROJECTS
})
const nodeCount = await page.locator('.relative > button[aria-label]').count()
check(`every project has a node (${expectedNodes})`, nodeCount === expectedNodes,
  `${nodeCount} nodes for ${expectedNodes} projects`)
check('locked nodes are disabled',
  (await page.locator('button[aria-label*="Locked"][disabled]').count()) > 20)

// List view must carry the same state.
await page.getByRole('button', { name: 'List', exact: true }).click()
await page.waitForTimeout(200)
await page.screenshot({ path: `${out}/2-list.png` })
const listRows = await page.locator('li button[aria-label], li button').count()
check('list view renders every project', listRows >= expectedNodes, String(listRows))
check('list marks the current step',
  (await page.locator('button[aria-current="step"]').count()) === 1)
await page.getByRole('button', { name: 'Map', exact: true }).click()

// Wizard gallery
await page.goto(`${base}#/wizard`, { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: `${out}/3-wizard.png` })
check('wizard gallery shows five poses', (await page.locator('button[aria-pressed]').count()) >= 5)
await page.getByRole('button', { name: 'Sympathetic' }).click()
await page.waitForTimeout(150)
await page.screenshot({ path: `${out}/4-wizard-sympathetic.png` })
check('pose can be toggled', (await page.locator('button[aria-pressed="true"]').count()) >= 1)
await page.getByRole('button', { name: 'The Archmage' }).click()
await page.waitForTimeout(150)
const act3 = await page.locator('tbody').innerText()
check('act III voice differs', /scry|glass|phantom|world|channel|omens/i.test(act3), act3.slice(0, 90))
await page.screenshot({ path: `${out}/5-wizard-act3.png` })

// Open the first project in the course. Asking the course rather than naming a
// project keeps this check working when content is renamed or reordered.
const firstProject = await page.evaluate(async () => {
  const { ORDERED_PROJECT_IDS, getProject } = await import('/src/course/index.ts')
  const id = ORDERED_PROJECT_IDS[0]
  return { id, title: getProject(id).title }
})
await page.goto(`${base}#/p/${encodeURIComponent(firstProject.id)}`, { waitUntil: 'networkidle' })
await page.waitForSelector('.cm-content')
await page.screenshot({ path: `${out}/6-project.png` })
check(
  'project view renders',
  (await page.locator('h1').first().innerText()).includes(firstProject.title),
  `expected ${firstProject.title}`,
)
check('Run and Check are separate', (await page.getByRole('button', { name: 'Run', exact: true }).count()) === 1 &&
  (await page.getByRole('button', { name: 'Check', exact: true }).count()) === 1)

// Run a script that writes files and draws an image — proves the Stage wiring.
await page.locator('.cm-content').click()
await page.keyboard.press('ControlOrMeta+a')
await page.keyboard.press('Backspace')
await page.keyboard.insertText(`print("the lamp is lit")
with open("notes.txt", "w") as f:
    f.write("first line\\nsecond line\\n")
`)
await page.getByRole('button', { name: 'Run', exact: true }).click()
await page.waitForSelector('#stage-panel-files, #stage-panel-console', { timeout: 120000 })
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/7-stage-run.png` })
const consoleText = await page.locator('#stage-panel-console, #stage-panel-files').first().innerText()
check('stage received runtime output', /lamp is lit|notes\.txt/.test(consoleText), consoleText.slice(0, 120))

await page.getByRole('tab', { name: /Files/ }).click()
await page.waitForTimeout(300)
const filesText = await page.locator('#stage-panel-files').innerText()
check('files tab shows the created file', filesText.includes('notes.txt'), filesText.slice(0, 120))
check('file diff marks it created', filesText.toLowerCase().includes('created'))
await page.screenshot({ path: `${out}/8-stage-files.png` })

// Check (grading) path
await page.getByRole('button', { name: 'Check', exact: true }).click()
await page.waitForSelector('#stage-panel-tests, #stage-panel-console', { timeout: 120000 })
await page.waitForTimeout(600)
await page.screenshot({ path: `${out}/9-stage-check.png` })
const tabs = await page.locator('[role="tab"]').allInnerTexts()
check('tests tab populated', tabs.some((t) => /Tests\s*\d/.test(t)), tabs.join(' | '))

// Notes persistence
await page.getByRole('tab', { name: 'Notes' }).click()
await page.locator('textarea').fill('Modulo is the remainder. Do not forget again.')
await page.waitForTimeout(700)
await page.goto(`${base}#/grimoire`, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.screenshot({ path: `${out}/10-grimoire.png` })
const grimoire = await page.locator('body').innerText()
check('note reached the grimoire', grimoire.includes('Modulo is the remainder'), grimoire.slice(0, 140))

const width = Math.max(...results.map((r) => r.name.length))
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}${r.ok ? '' : `  → ${r.detail}`}`)
}
const failed = results.filter((r) => !r.ok).length
if (errors.length) console.log('\nCONSOLE ERRORS:\n' + errors.slice(0, 6).join('\n'))
console.log(failed ? `\n${failed} of ${results.length} shell checks failed.` : `\nAll ${results.length} shell checks passed.`)
await browser.close()
process.exit(failed || errors.length ? 1 : 0)
