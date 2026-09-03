import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm01-first-words',
  act: 'act1',
  order: 1,
  title: 'First Words',
  region: 'The Threshold',
  blurb: 'Making the machine speak, and shaping what it says.',
  concepts: ['print()', 'strings', 'variables', 'f-strings', 'len()', 'input()'],
  projects: [
    'p1-the-banner',
    'p2-the-signpost',
    'p3-the-tally',
    'p4-the-herald',
    'p5-reading-the-runes',
  ],
}

export default module
