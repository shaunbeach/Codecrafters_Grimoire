import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-habit-stone',
  title: 'The Habit Stone',
  tagline: 'A format you choose, and can read back',
  shape: 'project',
  difficulty: 3,
  concepts: ['partition()', 'defensive parsing', 'sorted output'],
  objective: 'Write load_habits(path) and save_habits(path, habits) that round-trip exactly.',
  stage: 'files',
  chain: { id: 'the-vault', step: 1, of: 2 },
  source: 'day-20a',
}
export default project
