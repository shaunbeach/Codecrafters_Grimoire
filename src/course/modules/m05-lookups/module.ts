import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm05-lookups',
  act: 'act1',
  order: 5,
  title: 'Lookups',
  region: 'The Ledger',
  blurb: 'Asking by name instead of by position — and what that makes possible.',
  concepts: ['dict', '.get()', '.items()', 'counting', 'ord() / chr()'],
  projects: [
    'p1-the-quartermasters-book',
    'p2-the-cipher',
    'p3-counting-the-runes',
    'p4-the-roster',
  ],
}

export default module
