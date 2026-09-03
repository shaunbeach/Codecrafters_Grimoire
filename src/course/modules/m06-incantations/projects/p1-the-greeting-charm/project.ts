import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-greeting-charm',
  title: 'The Greeting Charm',
  tagline: 'Optional parts, and calling your own work',
  shape: 'project',
  difficulty: 2,
  concepts: ['def', 'default arguments', 'keyword arguments', 'reuse'],
  objective: 'Write greet(name, title, excited) and shout_all(names) using default and keyword arguments.',
  stage: 'console',
  source: 'day-11',
}
export default project
