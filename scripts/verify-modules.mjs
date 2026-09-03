// Verifies authored course modules: every solution passes, every starter fails,
// declared packages load, hints are present, and the brief says what it must.
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { bootRuntime, ROOT } from './lib/runtime.mjs'
import { entrySource, moduleDirs as authoredModuleDirs } from './gen-content-entries.mjs'

const modulesDir = join(ROOT, 'src/course/modules')
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '')

/** project.ts is TypeScript; we only need a few fields, so read them out. */
function readMeta(source) {
  const pick = (key) => source.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1]
  const list = (key) => {
    const raw = source.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`, 's'))?.[1] ?? ''
    return raw.split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean)
  }
  return {
    title: pick('title'),
    shape: pick('shape'),
    objective: pick('objective'),
    packages: list('packages'),
    chain: source.includes('chain:'),
  }
}

const REQUIRED_HEADINGS = ['## The situation', '## Your objective']

const only = process.argv.slice(2)
const moduleDirs = readdirSync(modulesDir).filter(
  (d) => !only.length || only.some((o) => d.includes(o)),
)

const rt = await bootRuntime()
let failures = 0
const fail = (label, detail) => {
  console.log(`  ✗ ${label}\n      ${String(detail).replace(/\n/g, '\n      ').slice(0, 500)}`)
  failures++
}

for (const dir of moduleDirs) {
  const base = join(modulesDir, dir)
  const moduleSource = read(join(base, 'module.ts'))
  const lesson = read(join(base, 'lesson.md'))

  console.log(`\n${dir}`)
  console.log('-'.repeat(dir.length))

  if (!lesson.trim()) fail(dir, 'lesson.md is missing or empty')
  else console.log(`  ✓ lesson (${lesson.split(/\s+/).length} words)`)

  const order = (moduleSource.match(/projects:\s*\[([^\]]*)\]/s)?.[1] ?? '')
    .split(',')
    .map((s) => s.trim().replace(/^'|'$/g, ''))
    .filter(Boolean)

  if (!order.length) fail(dir, 'module.ts lists no projects')

  for (const slug of order) {
    const p = join(base, 'projects', slug)
    if (!existsSync(p)) {
      fail(slug, 'folder is missing')
      continue
    }

    const meta = readMeta(read(join(p, 'project.ts')))
    const brief = read(join(p, 'brief.md'))
    const hints = read(join(p, 'hints.md'))
    const tests = read(join(p, 'tests.py'))
    const solution = read(join(p, 'solution.py'))
    const starter = read(join(p, 'starter.py'))
    const setup = read(join(p, 'setup.py'))

    const problems = []
    if (!meta.objective) problems.push('project.ts has no objective')
    for (const heading of REQUIRED_HEADINGS) {
      if (!brief.includes(heading)) problems.push(`brief.md is missing "${heading}"`)
    }
    const tiers = hints.split(/^---$/m).map((s) => s.trim()).filter(Boolean)
    if (tiers.length < 3) problems.push(`hints.md has ${tiers.length} tiers, expected 3`)
    if (!tests.trim()) problems.push('tests.py is empty')
    if (!solution.trim()) problems.push('solution.py is empty')

    if (problems.length) {
      fail(slug, problems.join('\n'))
      continue
    }

    // Packages must actually load before we can judge the Python.
    try {
      if (meta.packages.length) await rt.load(meta.packages)
    } catch (error) {
      fail(slug, `packages ${meta.packages.join(', ')} failed: ${error.message}`)
      continue
    }

    rt.reset()
    const passing = rt.runTests(solution, { tests, setup })
    if (passing.fatal) {
      fail(slug, `solution crashed: ${passing.fatal.headline}\n${passing.fatal.traceback}`)
      continue
    }
    const bad = passing.tests.filter((t) => !t.passed)
    if (!passing.tests.length) {
      fail(slug, 'no tests were collected')
      continue
    }
    if (bad.length) {
      fail(slug, bad.map((t) => `${t.name}: ${t.message}`).join('\n'))
      continue
    }

    // Run it again WITHOUT resetting the workspace. A suite whose tests mutate
    // a shared fixture passes the first time and quietly changes meaning after
    // that — which produces false passes, the worst kind of green.
    const repeat = rt.runTests(solution, { tests, setup })
    if (!repeat.ok) {
      const changed = repeat.tests.filter((t) => !t.passed).map((t) => t.name)
      fail(
        slug,
        'the suite passes once but not twice in the same workspace — a test is ' +
          'leaving the fixture changed for the next one.\n  failing on repeat: ' +
          changed.join(', '),
      )
      continue
    }

    rt.reset()
    const starterRun = rt.runTests(starter, { tests, setup })
    if (!starterRun.fatal && starterRun.ok) {
      fail(slug, 'the STARTER code passes — this project can be beaten without writing anything')
      continue
    }

    const touched = passing.stage?.artifacts.length ?? 0
    const chain = meta.chain ? ' · chained' : ''
    console.log(
      `  ✓ ${slug.padEnd(22)} ${String(passing.tests.length).padStart(2)} tests` +
        `${touched ? `, ${touched} file${touched === 1 ? '' : 's'}` : ''}${chain}`,
    )
  }
}

// The generated content entries are what makes lazy loading work; a module
// added without one loads no prose at all, and only in a production build.
console.log('\ncontent entries')
console.log('---------------')
const stale = authoredModuleDirs().filter(
  (dir) => read(join(modulesDir, dir, 'content.ts')) !== entrySource(dir),
)
if (stale.length) {
  fail('content entries', `stale or missing: ${stale.join(', ')}\n  run: npm run gen:content`)
} else {
  console.log(`  ✓ all ${authoredModuleDirs().length} modules have a current content.ts`)
}

console.log(
  failures ? `\n${failures} problem(s) found.` : `\nAll authored modules verified.`,
)
process.exit(failures ? 1 : 0)
