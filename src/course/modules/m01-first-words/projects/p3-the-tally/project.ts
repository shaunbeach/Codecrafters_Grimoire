import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-tally',
  title: 'The Reckoning',
  tagline: 'Split a tavern bill without starting a fight',
  shape: 'project',
  difficulty: 2,
  concepts: ['arithmetic', 'f-strings', ':.2f', 'floats'],
  objective:
    'Write split_bill(total, tip_percent, people) returning a two-line summary of the bill.',
  stage: 'console',
  source: 'day-02',
}
export default project
