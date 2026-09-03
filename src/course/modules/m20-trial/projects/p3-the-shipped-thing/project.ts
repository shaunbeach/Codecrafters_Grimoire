import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-shipped-thing',
  title: 'The Shipped Thing',
  tagline: 'Make it survive a real person',
  shape: 'capstone',
  difficulty: 4,
  concepts: ['json saves', 'defensive loading', 'CLI loops', 'never failing silently'],
  objective: 'Add save_game(), load_game() and a play() loop that cannot be crashed by bad input.',
  stage: 'console',
  chain: { id: 'the-trial', step: 3, of: 3 },
  source: 'day-30',
}
export default project
