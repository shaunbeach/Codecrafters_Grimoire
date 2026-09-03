import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-write-the-summary',
  title: 'Write the Summary',
  tagline: 'Draw a new ledger out of an old one',
  shape: 'project',
  difficulty: 3,
  concepts: ['Workbook()', 'append()', 'grouping', 'Font'],
  objective:
    'Write build_summary(source, destination) which groups sales by region and writes a new report workbook.',
  packages: ['openpyxl'],
  stage: 'files',
  chain: { id: 'quarterly-report', step: 3, of: 3 },
}

export default project
