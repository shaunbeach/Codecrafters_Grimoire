import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-drafted-order',
  title: 'The Drafted Order',
  tagline: 'Produce paperwork of your own',
  shape: 'drill',
  difficulty: 3,
  concepts: ['add_heading()', 'add_paragraph()', 'styles', 'round trips'],
  objective: 'Write draft_order(path, title, sections) writing a structured Word document.',
  packages: ['pypdf', 'python-docx'],
  stage: 'files',
}
export default project
