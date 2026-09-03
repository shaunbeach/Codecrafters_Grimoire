import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p6-the-invoice',
  title: 'The Invoice',
  tagline: 'The trial of the counting house',
  shape: 'capstone',
  difficulty: 4,
  concepts: ['filtering', 'building workbooks', 'formatting', 'raising errors'],
  objective:
    'Write build_invoice(source, destination, region) producing a formatted single-region invoice.',
  packages: ['openpyxl'],
  stage: 'files',
}

export default project
