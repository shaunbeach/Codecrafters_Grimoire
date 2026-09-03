// Phase 3 acceptance: the Spreadsheets module is playable, the grid highlights
// the cells the learner's code wrote, and the terminal genuinely blocks.
import { chromium } from 'playwright'

const base = process.env.BASE || 'http://localhost:5173'
const out = process.env.OUT || '/tmp/shots3'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })

const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail })

async function openProject(slug) {
  await page.goto(`${base}#/p/m18-spreadsheets.${slug}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.cm-content', { timeout: 60000 })
}

async function typeCode(code) {
  await page.locator('.cm-content').click()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText(code)
}

// Free roam so the whole module is reachable without playing 30 projects first.
await page.goto(base, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  localStorage.setItem(
    'grimoire.progress.v2',
    JSON.stringify({ version: 2, passed: {}, attempts: {}, failures: {}, hintsRevealed: {},
      startedOn: new Date().toISOString(), lastProject: null, freeRoam: true }),
  )
})

// ---------------------------------------------------------------- structure
await page.goto(base, { waitUntil: 'networkidle' })
const body = await page.locator('body').innerText()
check('module appears on the map', body.includes('Spreadsheets') || body.includes('Counting House'),
  body.slice(0, 120))

await openProject('p3-add-the-totals')
const header = await page.locator('header').first().innerText()
check('project opens', header.includes('Add the Totals'), header)
check('chain shown in header', /Step 2 of 3/i.test(header), header)
const proseCount = await page.locator('.prose-lesson').count()
check('brief renders authored markdown', proseCount > 0, `${proseCount} prose blocks`)
// The Tailwind rewrite renamed this class once already; if the stylesheet and
// the component drift apart again, every lesson silently loses its formatting.
const h2Size = await page
  .locator('.prose-lesson h2')
  .first()
  .evaluate((el) => getComputedStyle(el).fontSize)
check('prose is actually styled', parseFloat(h2Size) >= 17, `h2 renders at ${h2Size}`)
await page.screenshot({ path: `${out}/1-brief.png` })

// ------------------------------------------------------------------- hints
// Hints are markdown like every other piece of course prose. If they are ever
// rendered as plain text again, the reader sees raw backticks and code fences.
for (let i = 0; i < 3; i += 1) {
  const button = page.getByRole('button', { name: /Ask for a hint|Ask for more/ })
  if (await button.count()) {
    await button.first().click()
    await page.waitForTimeout(200)
  }
}
const hintPanel = page.locator('aside')
const hintText = await hintPanel.innerText()
check('three hint tiers reveal', /omens|look here|plainly/i.test(hintText), hintText.slice(0, 120))
check('hints render as markdown, not raw text',
  !hintText.includes('```') && (await hintPanel.locator('pre').count()) > 0,
  hintText.slice(0, 160))
await page.screenshot({ path: `${out}/1b-hints.png` })

// ------------------------------------------------- the spreadsheet renderer
await typeCode(`from openpyxl import load_workbook


def add_totals(path):
    book = load_workbook(path)
    sheet = book.active
    column = sheet.max_column + 1
    sheet.cell(row=1, column=column, value="Total")
    written = 0
    for row in range(2, sheet.max_row + 1):
        units = sheet.cell(row=row, column=3).value or 0
        price = sheet.cell(row=row, column=4).value or 0
        sheet.cell(row=row, column=column, value=units * price)
        written += 1
    book.save(path)
    return written


if __name__ == "__main__":
    add_totals("sales.xlsx")
`)

await page.getByRole('button', { name: 'Run', exact: true }).click()
await page.waitForSelector('#stage-panel-files', { timeout: 180000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: `${out}/2-sheet.png` })

const filesPanel = await page.locator('#stage-panel-files').innerText()
check('xlsx recognised as a sheet', filesPanel.includes('sales.xlsx') && filesPanel.includes('sheet'),
  filesPanel.slice(0, 140))
check('marked as modified', filesPanel.toLowerCase().includes('modified'), filesPanel.slice(0, 140))
check('grid renders real values', filesPanel.includes('North') && filesPanel.includes('540'),
  filesPanel.slice(0, 200))
check('column letters shown', /\bA\b/.test(filesPanel) && /\bE\b/.test(filesPanel))

const highlighted = await page.locator('#stage-panel-files td.bg-jade\\/15').count()
check('modified cells highlighted', highlighted === 9, `${highlighted} highlighted, expected 9 (E1..E9)`)
const highlightText = await page.locator('#stage-panel-files td.bg-jade\\/15').allInnerTexts()
check('highlights are the Total column', highlightText[0] === 'Total' && highlightText.includes('540'),
  highlightText.join(','))
check('cell count reported', /9 cells written by your code/.test(filesPanel), filesPanel.slice(-160))

// --------------------------------------------------- the blocking terminal
await openProject('p5-the-audit')
check('interactive isolation available',
  await page.evaluate(() => globalThis.crossOriginIsolated === true))

await typeCode(`from openpyxl import load_workbook


def run_audit(path):
    book = load_workbook(path)
    sheet = book.active
    checked = fixed = skipped = 0
    for row in range(2, sheet.max_row + 1):
        if sheet.cell(row=row, column=3).value:
            continue
        checked += 1
        region = sheet.cell(row=row, column=1).value
        month = sheet.cell(row=row, column=2).value
        print(f"Row {row}: {region} {month} has no units.")
        answer = input("units> ")
        try:
            units = int(answer)
        except ValueError:
            skipped += 1
            continue
        if units < 0:
            skipped += 1
            continue
        sheet.cell(row=row, column=3, value=units)
        fixed += 1
    book.save(path)
    print(f"Audit complete: {fixed} fixed, {skipped} skipped.")
    return {"checked": checked, "fixed": fixed, "skipped": skipped}


if __name__ == "__main__":
    run_audit("sales.xlsx")
`)

await page.getByRole('button', { name: 'Run', exact: true }).click()

// The program must PAUSE here. If it does not, the input box never appears.
await page.waitForSelector('input[aria-label="Your program is waiting for input"]', { timeout: 180000 })
await page.waitForTimeout(400)
await page.screenshot({ path: `${out}/3-blocked.png` })

const consoleWhileBlocked = await page.locator('#stage-panel-console').innerText()
check('program blocked waiting for input', true)
check('prompt flushed BEFORE blocking',
  consoleWhileBlocked.includes('Row 7: East February has no units.') &&
    consoleWhileBlocked.includes('units>'),
  consoleWhileBlocked.slice(0, 200))
check('run had not finished', !consoleWhileBlocked.includes('Audit complete'),
  consoleWhileBlocked.slice(0, 200))

// Answer the first question; it must block again on the second.
await page.locator('input[aria-label="Your program is waiting for input"]').fill('45')
await page.keyboard.press('Enter')
await page.waitForTimeout(1500)
const afterFirst = await page.locator('#stage-panel-console').innerText()
check('first answer consumed and echoed', afterFirst.includes('Row 9: West February has no units.'),
  afterFirst.slice(0, 240))

await page.locator('input[aria-label="Your program is waiting for input"]').fill('skip')
await page.keyboard.press('Enter')
await page.waitForSelector('#stage-panel-files', { timeout: 60000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: `${out}/4-after-input.png` })

const finalConsole = await page.evaluate(() => document.body.innerText)
check('program resumed and finished', finalConsole.includes('Audit complete: 1 fixed, 1 skipped.'),
  finalConsole.slice(0, 300))

await page.getByRole('tab', { name: /Files/ }).click()
await page.waitForTimeout(400)
const auditFiles = await page.locator('#stage-panel-files').innerText()
check('typed value written into the sheet', auditFiles.includes('45'), auditFiles.slice(0, 200))
await page.screenshot({ path: `${out}/5-audit-sheet.png` })

// ------------------------------------------------------------- grading path
await page.getByRole('button', { name: 'Check', exact: true }).click()
await page.waitForSelector('#stage-panel-tests', { timeout: 180000 })
await page.waitForTimeout(600)
const testsPanel = await page.locator('#stage-panel-tests').innerText()
check('graded run passes with scripted input', !testsPanel.includes('✗'), testsPanel.slice(0, 200))
await page.screenshot({ path: `${out}/6-checked.png` })

const width = Math.max(...results.map((r) => r.name.length))
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}${r.ok ? '' : `  → ${String(r.detail).replace(/\n/g, ' ').slice(0, 150)}`}`)
}
const failed = results.filter((r) => !r.ok).length
if (errors.length) console.log('\nCONSOLE ERRORS:\n' + errors.slice(0, 5).join('\n'))
console.log(failed ? `\n${failed} of ${results.length} slice checks failed.` : `\nAll ${results.length} slice checks passed.`)
await browser.close()
process.exit(failed || errors.length ? 1 : 0)
