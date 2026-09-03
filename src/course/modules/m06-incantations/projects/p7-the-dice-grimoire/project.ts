import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p7-the-dice-grimoire',
  title: 'The Dice Grimoire',
  tagline: "Import somebody else's work",
  shape: 'project',
  difficulty: 2,
  concepts: ['import', 'modules', 'namespaces'],
  objective: 'Import the provided dice module and build roll_stats() and best_of() on top of it.',
  stage: 'console',
  source: 'day-14',
}
export default project
