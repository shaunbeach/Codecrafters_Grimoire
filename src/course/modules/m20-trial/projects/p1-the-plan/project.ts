import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-plan',
  title: 'The Plan',
  tagline: 'Decide what it is before you build it',
  shape: 'project',
  difficulty: 3,
  concepts: ['data modelling', 'NotImplementedError', 'fresh state', 'architecture'],
  objective: 'Define PROJECT_PLAN, new_game_state() and the stubs your trial will fill in.',
  stage: 'console',
  chain: { id: 'the-trial', step: 1, of: 3 },
  source: 'day-28',
}
export default project
