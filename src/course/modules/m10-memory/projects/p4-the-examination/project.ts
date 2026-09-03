import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-examination',
  title: 'The Examination',
  tagline: 'Ask, judge, and keep score',
  shape: 'project',
  difficulty: 3,
  concepts: ['input()', 'scoring', 'forgiving comparison'],
  objective: 'Write run_quiz(questions) which asks each question, scores the answers and reports.',
  stage: 'console',
  chain: { id: 'the-examination', step: 2, of: 2 },
  source: 'day-21b',
}
export default project
