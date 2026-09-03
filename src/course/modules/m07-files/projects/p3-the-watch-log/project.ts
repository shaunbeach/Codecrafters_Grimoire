import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-watch-log',
  title: 'The Watch Log',
  tagline: 'Read a long file without holding all of it',
  shape: 'drill',
  difficulty: 2,
  concepts: ['iterating a file', 'startswith()', 'counting', 'strip()'],
  objective: 'Write count_level(path, level) counting how many log lines carry a given level.',
  stage: 'console',
}
export default project
