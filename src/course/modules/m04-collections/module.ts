import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm04-collections',
  act: 'act1',
  order: 4,
  title: 'Collections',
  region: 'The Pack',
  blurb: 'Holding many things at once, and changing them without losing them.',
  concepts: ['lists', 'indexing', 'append / remove / pop', 'in', 'sorted()'],
  projects: [
    'p1-the-name-generator',
    'p2-the-task-board',
    'p3-the-next-task',
    'p4-the-trial-scores',
    'p5-common-allies',
  ],
}

export default module
