import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-working-world',
  title: 'The Working World',
  tagline: 'Two classes that between them run a game',
  shape: 'project',
  difficulty: 4,
  concepts: ['classes', 'dependency injection', 'collaborating objects', 'state'],
  objective: 'Build the World and Player classes so look(), move(), take() and inventory all work.',
  stage: 'console',
  chain: { id: 'the-trial', step: 2, of: 3 },
  source: 'day-29',
}
export default project
