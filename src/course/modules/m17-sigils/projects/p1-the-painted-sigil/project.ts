import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-painted-sigil',
  title: 'The Painted Sigil',
  tagline: 'Make an image out of nothing',
  shape: 'drill',
  difficulty: 2,
  concepts: ['Image.new()', 'ImageDraw', 'coordinates', 'saving'],
  objective: 'Write paint_sigil(path, size, colour) drawing a bordered sigil plate and saving it.',
  packages: ['pillow'],
  stage: 'image',
}
export default project
