import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p5-the-tally-sheet',
  title: 'The Tally Sheet',
  tagline: 'Turn a file into rows you can work with',
  shape: 'project',
  difficulty: 3,
  concepts: ['split()', 'zip()', 'header rows'],
  objective: 'Write parse_csv(path) returning one dictionary per row, keyed by the header names.',
  stage: 'console',
  chain: { id: 'the-cohort', step: 1, of: 2 },
  source: 'day-16a',
}
export default project
