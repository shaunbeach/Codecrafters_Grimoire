import type { Act } from './types'

export const ACTS: Act[] = [
  {
    id: 'act1',
    index: 1,
    name: 'The Apprentice',
    blurb:
      'Syntax and logic. You learn to make the machine speak, decide and repeat — in a world of taverns, goblins and dice.',
    voice: 'apprentice',
  },
  {
    id: 'act2',
    index: 2,
    name: 'The Artisan',
    blurb:
      'Structure and craft. Files that outlive the program, errors that do not kill it, and objects that hold their own shape.',
    voice: 'artisan',
  },
  {
    id: 'act3',
    index: 3,
    name: 'The Archmage',
    blurb:
      'The real magic. The network, the filesystem and the screen are not metaphors any more — they are the material you work in.',
    voice: 'archmage',
  },
]

/**
 * Modules live in src/course/modules, one folder each. Nothing is seeded from
 * the old day-based content any more — the migration is complete.
 */
