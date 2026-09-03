import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-selective-hand',
  title: 'The Selective Hand',
  tagline: 'Reach through a whole tree',
  shape: 'drill',
  difficulty: 3,
  concepts: ['os.walk()', 'shutil.copy()', 'nested folders'],
  objective: 'Write gather(source, destination, extension) copying every matching file out of a tree.',
  stage: 'files',
}
export default project
