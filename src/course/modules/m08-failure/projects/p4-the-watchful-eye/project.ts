import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-watchful-eye',
  title: 'The Watchful Eye',
  tagline: 'Write down what happened, for later',
  shape: 'drill',
  difficulty: 3,
  concepts: ['logging', 'levels', 'basicConfig(force=True)'],
  objective: 'Write sum_takings(amounts, log_path) which totals what it can and logs what it skipped.',
  stage: 'files',
}
export default project
