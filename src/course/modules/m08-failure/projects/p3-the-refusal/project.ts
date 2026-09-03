import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-refusal',
  title: 'The Refusal',
  tagline: 'Fail where the problem is',
  shape: 'drill',
  difficulty: 2,
  concepts: ['raise', 'ValueError', 'TypeError', 'useful messages'],
  objective: 'Write carriage_cost(weight) which refuses impossible loads instead of guessing.',
  stage: 'console',
}
export default project
