// A loop that never ends must be stopped, and the runner must survive it.
// Proving the recovery matters as much as proving the stop: the worker is
// terminated, so the next run is served by a freshly booted interpreter.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(process.env.BASE || 'http://localhost:5173', { waitUntil: 'networkidle' })

const result = await page.evaluate(async () => {
  const { pythonRunner } = await import('/src/runner/pythonRunner.ts')

  let timedOut = null
  try {
    await pythonRunner.runTests('while True:\n    pass\n', {
      tests: 'def test_x():\n    """always true"""\n    assert True\n',
    })
  } catch (error) {
    timedOut = String(error.message)
  }

  const { report } = await pythonRunner.runTests('def add(a, b):\n    return a + b\n', {
    tests: 'def test_add():\n    """adds two numbers"""\n    assert require("add")(1, 2) == 3\n',
  })

  return { timedOut, recovered: report.ok }
})

await browser.close()

const stopped = Boolean(result.timedOut?.includes('was stopped'))
console.log(`${stopped ? '✓' : '✗'} infinite loop stopped: ${result.timedOut ?? 'never stopped'}`)
console.log(`${result.recovered ? '✓' : '✗'} runner recovered after the kill`)

process.exit(stopped && result.recovered ? 0 : 1)
