import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-standing-question',
  title: 'The Standing Question',
  tagline: 'Ask what a list could not',
  shape: 'drill',
  difficulty: 3,
  concepts: ['GROUP BY', 'aggregate functions', 'ORDER BY', 'LIMIT'],
  objective: 'Write reward_by_status(path) and richest(path, limit) answering questions in SQL, not Python.',
  stage: 'files',
}
export default project
