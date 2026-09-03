import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p6-judging-the-cohort',
  title: 'Judging the Cohort',
  tagline: 'Averages, and the empty-file problem',
  shape: 'project',
  difficulty: 3,
  concepts: ['int()', 'averages', 'ZeroDivisionError', 'max by key'],
  objective: 'Write class_average(rows, column) and top_student(rows) over the parsed tally sheet.',
  stage: 'console',
  chain: { id: 'the-cohort', step: 2, of: 2 },
  source: 'day-16b',
}
export default project
