import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-daily-record',
  title: 'The Daily Record',
  tagline: 'Add to a file without destroying it',
  shape: 'drill',
  difficulty: 2,
  concepts: ['append mode', 'open modes', 'return values'],
  objective: 'Write record(path, entry) which appends a dated line and returns the new total.',
  stage: 'files',
}
export default project
