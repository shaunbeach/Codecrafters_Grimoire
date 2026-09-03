import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-sealed-writ',
  title: 'The Sealed Writ',
  tagline: 'Take pages out of a document that has none',
  shape: 'project',
  difficulty: 3,
  concepts: ['pypdf', 'PdfReader', 'PdfWriter', 'binary mode'],
  objective: 'Write extract_pages(source, destination, pages) building a new PDF from chosen pages.',
  packages: ['pypdf', 'python-docx'],
  stage: 'files',
}
export default project
