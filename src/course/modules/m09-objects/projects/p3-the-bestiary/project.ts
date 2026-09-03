import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-bestiary',
  title: 'The Bestiary',
  tagline: 'Three monsters, one parent',
  shape: 'project',
  difficulty: 3,
  concepts: ['inheritance', 'super()', 'overriding', 'polymorphism'],
  objective: 'Write Goblin, Dragon and Slime, each inheriting from Enemy and overriding what differs.',
  stage: 'console',
  chain: { id: 'the-bestiary', step: 2, of: 2 },
  source: 'day-19b',
}
export default project
