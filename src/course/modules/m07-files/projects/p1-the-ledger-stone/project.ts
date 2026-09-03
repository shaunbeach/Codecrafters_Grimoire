import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-ledger-stone',
  title: 'The Ledger Stone',
  tagline: 'Write it down; read it back',
  shape: 'project',
  difficulty: 2,
  concepts: ['open()', 'with', 'write()', 'FileNotFoundError'],
  objective: 'Write save_scores(path, scores) and load_scores(path) so a score table survives the program ending.',
  stage: 'files',
  chain: { id: 'the-high-table', step: 1, of: 2 },
  source: 'day-15a',
}
export default project
