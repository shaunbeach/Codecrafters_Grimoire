import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-read-the-rows',
  title: 'Read the Rows',
  tagline: 'Get the figures out of the sealed book',
  shape: 'project',
  difficulty: 2,
  concepts: ['iter_rows', 'header rows', 'zip', 'None handling'],
  objective:
    'Write load_sales(path) which returns one dictionary per data row, keyed by the header names.',
  packages: ['openpyxl'],
  stage: 'console',
  chain: { id: 'quarterly-report', step: 1, of: 3 },
}

export default project
