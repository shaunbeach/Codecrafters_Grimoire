import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-counting-the-runes',
  title: 'Counting the Runes',
  tagline: 'Tally what you find as you walk',
  shape: 'drill',
  difficulty: 2,
  concepts: ['dict counting', '.get()', 'string iteration', '.lower()'],
  objective: 'Write count_runes(text) returning how many times each letter appears.',
  stage: 'console',
}
export default project
