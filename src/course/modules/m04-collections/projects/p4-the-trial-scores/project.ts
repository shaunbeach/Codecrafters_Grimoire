import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-trial-scores',
  title: 'The Trial Scores',
  tagline: 'Drop the worst attempt, then judge the rest',
  shape: 'drill',
  difficulty: 2,
  concepts: ['sorted()', 'slicing', 'sum()', 'ZeroDivisionError'],
  objective: 'Write judge(scores) which drops the lowest score and averages what remains.',
  stage: 'console',
}
export default project
