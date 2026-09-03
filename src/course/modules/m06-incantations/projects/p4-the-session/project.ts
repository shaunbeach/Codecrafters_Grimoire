import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-session',
  title: 'The Whole Session',
  tagline: 'A loop around a working you already have',
  shape: 'project',
  difficulty: 2,
  concepts: ['loops', 'accumulators', 'tuples', 'reuse'],
  objective: 'Write run_session(commands) which replays a whole script of commands and reports what happened.',
  stage: 'console',
  chain: { id: 'the-ledger-tool', step: 2, of: 2 },
  source: 'day-13b',
}
export default project
