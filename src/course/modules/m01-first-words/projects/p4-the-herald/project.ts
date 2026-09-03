import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-herald',
  title: "The Herald's Cry",
  tagline: 'Measure a name, then announce it',
  shape: 'drill',
  difficulty: 1,
  concepts: ['len()', 'f-strings', '.upper()', 'guard clauses'],
  objective: 'Write announce(name) which returns the herald’s cry for a named arrival.',
  stage: 'console',
}
export default project
