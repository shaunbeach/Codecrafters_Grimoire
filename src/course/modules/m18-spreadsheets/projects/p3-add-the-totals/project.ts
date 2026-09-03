import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-add-the-totals',
  title: 'Add the Totals',
  tagline: 'Transmute a computed column into the ledger',
  shape: 'project',
  difficulty: 3,
  concepts: ['writing cells', 'save()', 'max_row', 'get_column_letter'],
  objective:
    'Write add_totals(path) which adds a Total column to the sales workbook and saves it in place.',
  packages: ['openpyxl'],
  stage: 'files',
  chain: { id: 'quarterly-report', step: 2, of: 3 },
}

export default project
