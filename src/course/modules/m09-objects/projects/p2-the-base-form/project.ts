import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-base-form',
  title: 'The Base Form',
  tagline: 'One class, and everything shared',
  shape: 'project',
  difficulty: 2,
  concepts: ['class', 'attributes', 'max()', 'methods'],
  objective: 'Write the Enemy base class that every monster will inherit from.',
  stage: 'console',
  chain: { id: 'the-bestiary', step: 1, of: 2 },
  source: 'day-19a',
}
export default project
