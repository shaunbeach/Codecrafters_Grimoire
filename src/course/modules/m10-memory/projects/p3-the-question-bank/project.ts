import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-question-bank',
  title: 'The Question Bank',
  tagline: 'Content in a file, not in your code',
  shape: 'project',
  difficulty: 2,
  concepts: ['file parsing', 'partition()', 'tuples'],
  objective: 'Write load_questions(path) turning a question file into (question, answer) pairs.',
  stage: 'console',
  chain: { id: 'the-examination', step: 1, of: 2 },
  source: 'day-21a',
}
export default project
