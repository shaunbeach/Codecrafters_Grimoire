import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-open-the-ledger',
  title: 'Open the Ledger',
  tagline: 'Put the lens to the seal and read',
  shape: 'drill',
  difficulty: 1,
  concepts: ['load_workbook', 'sheetnames', 'cell coordinates'],
  objective:
    'Write sheet_names(path) and read_cell(path, sheet, ref) to look inside a workbook without opening Excel.',
  packages: ['openpyxl'],
  stage: 'files',
}

export default project
