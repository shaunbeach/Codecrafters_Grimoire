import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-bound-volume',
  title: 'The Bound Volume',
  tagline: 'Read structure a PDF cannot give you',
  shape: 'project',
  difficulty: 3,
  concepts: ['python-docx', 'paragraph styles', 'filtering'],
  objective: 'Write outline(path) returning the headings of a Word document, with their levels.',
  packages: ['pypdf', 'python-docx'],
  stage: 'files',
}
export default project
