import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-sealed-archive',
  title: 'The Sealed Archive',
  tagline: 'Fold a folder into one file',
  shape: 'drill',
  difficulty: 3,
  concepts: ['zipfile', 'arcname', 'relpath()'],
  objective: 'Write seal(folder, archive_path) which zips a folder with sensible names inside.',
  stage: 'files',
}
export default project
