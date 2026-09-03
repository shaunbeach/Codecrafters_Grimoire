import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-sealed-purse',
  title: 'The Sealed Purse',
  tagline: 'An object that refuses to be put in a bad state',
  shape: 'drill',
  difficulty: 3,
  concepts: ['encapsulation', 'raising from methods', '__len__', '__str__'],
  objective: 'Write a Purse class that never allows a negative balance and reports itself clearly.',
  stage: 'console',
}
export default project
