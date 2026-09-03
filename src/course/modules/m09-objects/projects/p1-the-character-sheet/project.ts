import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-character-sheet',
  title: 'The Character Sheet',
  tagline: 'An object that owns its own state',
  shape: 'project',
  difficulty: 3,
  concepts: ['class', '__init__', 'self', 'methods', '__str__'],
  objective: 'Write a Character class with health, strength, attack(), take_damage(), heal() and is_alive().',
  stage: 'console',
  source: 'day-18',
}
export default project
