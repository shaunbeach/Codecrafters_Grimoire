import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p5-the-audit',
  title: 'The Audit',
  tagline: 'A working that stops and asks you',
  shape: 'project',
  difficulty: 3,
  concepts: ['input()', 'interactive loops', 'validation', 'saving changes'],
  objective:
    'Write run_audit(path) which finds rows with no units, asks what to do about each, and saves the result.',
  packages: ['openpyxl'],
  stage: 'files',
}

export default project
