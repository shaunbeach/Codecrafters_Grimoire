import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm06-incantations',
  act: 'act1',
  order: 6,
  title: 'Incantations',
  region: 'The Workshop',
  blurb: 'Naming a piece of behaviour so that you can stop rewriting it.',
  concepts: ['def', 'return', 'default arguments', 'composition', 'import'],
  projects: [
    'p1-the-greeting-charm',
    'p2-the-damage-roll',
    'p3-the-single-command',
    'p4-the-session',
    'p5-the-warding-charm',
    'p6-the-quartermasters-discount',
    'p7-the-dice-grimoire',
  ],
}

export default module
