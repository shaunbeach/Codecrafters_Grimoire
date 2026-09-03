import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-roster',
  title: 'The Roster',
  tagline: 'A dictionary inside a dictionary',
  shape: 'drill',
  difficulty: 3,
  concepts: ['nested dicts', '.get() with defaults', 'KeyError'],
  objective: 'Write look_up(roster, name, field) which reads a nested roster without ever raising.',
  stage: 'console',
}
export default project
