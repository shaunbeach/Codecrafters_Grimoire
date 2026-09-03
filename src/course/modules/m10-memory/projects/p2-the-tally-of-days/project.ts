import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-tally-of-days',
  title: 'The Tally of Days',
  tagline: 'Load, change, save — the whole cycle',
  shape: 'project',
  difficulty: 2,
  concepts: ['dict counting', 'sorting by value', 'round trips'],
  objective: 'Write record_day(habits, name) and streak_report(habits) over the loaded tracker.',
  stage: 'files',
  chain: { id: 'the-vault', step: 2, of: 2 },
  source: 'day-20b',
}
export default project
