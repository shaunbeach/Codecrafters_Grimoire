import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-marked-plate',
  title: 'The Marked Plate',
  tagline: 'Stamp one image onto another',
  shape: 'project',
  difficulty: 3,
  concepts: ['paste()', 'masks', 'RGBA', 'convert()'],
  objective: 'Write stamp(base_path, mark_path, out_path, corner) placing a transparent mark on an image.',
  packages: ['pillow'],
  stage: 'image',
}
export default project
