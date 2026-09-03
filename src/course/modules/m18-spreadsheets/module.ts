import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm18-spreadsheets',
  act: 'act3',
  order: 13,
  title: 'Spreadsheets',
  region: 'The Counting House',
  blurb:
    'The grand ledgers the working world actually runs on. Read one, transmute it, and conjure another from nothing.',
  concepts: ['openpyxl', 'workbooks & sheets', 'cell coordinates', 'iteration', 'writing files'],
  projects: [
    'p1-open-the-ledger',
    'p2-read-the-rows',
    'p3-add-the-totals',
    'p4-write-the-summary',
    'p5-the-audit',
    'p6-the-invoice',
  ],
}

export default module
