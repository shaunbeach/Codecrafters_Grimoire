import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-uniform-seal',
  title: 'The Uniform Seal',
  tagline: 'Four hundred images, one shape',
  shape: 'project',
  difficulty: 3,
  concepts: ['thumbnail()', 'aspect ratio', 'batch processing', 'os.listdir()'],
  objective: 'Write fit_all(folder, box) resizing every image in a folder to fit a box, ratio intact.',
  packages: ['pillow'],
  stage: 'files',
}
export default project
