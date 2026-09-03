import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm07-files',
  act: 'act2',
  order: 7,
  title: 'Ink and Parchment',
  region: 'The Archive',
  blurb: 'The first time your work outlives the working that made it.',
  concepts: ['open()', 'with', 'read / write / append', 'splitlines()', 'CSV by hand'],
  projects: [
    'p1-the-ledger-stone',
    'p2-the-high-table',
    'p3-the-watch-log',
    'p4-the-daily-record',
    'p5-the-tally-sheet',
    'p6-judging-the-cohort',
  ],
}

export default module
