import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm03-repetition',
  act: 'act1',
  order: 3,
  title: 'Repetition',
  region: 'The Long Road',
  blurb: 'Loops, and the discipline of making sure they end.',
  concepts: ['while', 'for', 'range()', 'modulo', 'break', 'continue'],
  projects: [
    'p1-the-guessing-game',
    'p2-fizzbuzz',
    'p3-the-hailstone-path',
    'p4-the-cursed-count',
    'p5-the-unbreakable-number',
  ],
}

export default module
