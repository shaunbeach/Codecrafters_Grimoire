import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm10-memory',
  act: 'act2',
  order: 10,
  title: 'Memory',
  region: 'The Vault',
  blurb: 'Load it, change it, write it back — the shape of every real programme.',
  concepts: ['round-tripping', 'file formats', 'content in data not code', 'scoring'],
  projects: [
    'p1-the-habit-stone',
    'p2-the-tally-of-days',
    'p3-the-question-bank',
    'p4-the-examination',
  ],
}

export default module
