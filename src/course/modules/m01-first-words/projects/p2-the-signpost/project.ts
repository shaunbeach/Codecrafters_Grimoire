import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-signpost',
  title: 'The Signpost',
  tagline: 'Hand back a value instead of shouting it',
  shape: 'project',
  difficulty: 1,
  concepts: ['return', 'len()', 'string repetition', '\\n'],
  objective: 'Write build_sign(name) which returns a two-line signpost, name over rule.',
  stage: 'console',
  source: 'day-01b',
}
export default project
