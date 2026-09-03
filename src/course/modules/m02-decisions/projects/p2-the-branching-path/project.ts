import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-branching-path',
  title: 'The Branching Path',
  tagline: 'A decision inside a decision',
  shape: 'project',
  difficulty: 2,
  concepts: ['nested if', 'IndexError', 'guard clauses'],
  objective: 'Write adventure(choices) which walks a branching story and returns the ending reached.',
  stage: 'console',
  source: 'day-04',
}
export default project
