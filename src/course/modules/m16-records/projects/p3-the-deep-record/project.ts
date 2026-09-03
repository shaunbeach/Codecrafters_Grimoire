import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-deep-record',
  title: 'The Deep Record',
  tagline: 'Dig without falling through',
  shape: 'drill',
  difficulty: 3,
  concepts: ['nested lookup', 'KeyError', 'IndexError', 'defaults'],
  objective: 'Write dig(data, path, default) which follows a path into nested data safely.',
  stage: 'console',
}
export default project
