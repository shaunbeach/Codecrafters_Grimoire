import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-guessing-game',
  title: 'The Number Oracle',
  tagline: 'A loop that answers until it is right',
  shape: 'project',
  difficulty: 2,
  concepts: ['while', 'break', 'random.randint()', 'accumulators'],
  objective: 'Write pick_secret(low, high) and play_round(secret, guesses) returning a hint per guess.',
  stage: 'console',
  source: 'day-05',
}
export default project
