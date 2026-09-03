import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm08-failure',
  act: 'act2',
  order: 8,
  title: 'When Things Break',
  region: 'The Fault',
  blurb: 'Building things that survive being used by somebody who is not you.',
  concepts: ['try / except', 'raising', 'tracebacks', 'logging', 'defensive input'],
  projects: [
    'p1-the-bulletproof-answer',
    'p2-the-insistent-question',
    'p3-the-refusal',
    'p4-the-watchful-eye',
    'p5-the-untrusted-scroll',
  ],
}

export default module
