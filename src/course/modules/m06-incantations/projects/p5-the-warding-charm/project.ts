import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p5-the-warding-charm',
  title: 'The Warding Charm',
  tagline: 'Many conditions, one verdict',
  shape: 'drill',
  difficulty: 3,
  concepts: ['any() / all()', 'string methods', 'multiple returns'],
  objective: 'Write ward_strength(phrase) returning the first reason a ward is weak, or ACCEPTED.',
  stage: 'console',
}
export default project
