import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-sorting-hall',
  title: 'The Sorting Hall',
  tagline: 'Two hours of dragging, in nine milliseconds',
  shape: 'project',
  difficulty: 3,
  concepts: ['os.listdir()', 'splitext()', 'shutil.move()', 'makedirs(exist_ok=True)'],
  objective: 'Write organise(folder) which files everything loose into subfolders by extension.',
  stage: 'files',
  source: 'day-24',
}
export default project
