import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-high-table',
  title: 'The High Table',
  tagline: 'Load, change, sort, save',
  shape: 'project',
  difficulty: 3,
  concepts: ['sort(key=)', 'slicing', 'round trips'],
  objective: 'Write add_score(path, name, points) which keeps only the five best scores on disk.',
  stage: 'files',
  chain: { id: 'the-high-table', step: 2, of: 2 },
  source: 'day-15b',
}
export default project
