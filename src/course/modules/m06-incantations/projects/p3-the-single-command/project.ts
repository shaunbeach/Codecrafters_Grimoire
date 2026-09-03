import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-single-command',
  title: 'One Command',
  tagline: 'Parse a line, decide, answer',
  shape: 'project',
  difficulty: 3,
  concepts: ['.split()', 'dispatch', 'validation'],
  objective: 'Write run_command(store, line) carrying out one command against a dictionary.',
  stage: 'console',
  chain: { id: 'the-ledger-tool', step: 1, of: 2 },
  source: 'day-13a',
}
export default project
