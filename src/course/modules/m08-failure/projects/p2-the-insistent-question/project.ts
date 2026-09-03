import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-insistent-question',
  title: 'The Insistent Question',
  tagline: 'Ask again until the answer is usable',
  shape: 'project',
  difficulty: 2,
  concepts: ['while True', 'retry loops', 'input()'],
  objective: 'Write ask_for_number(prompt) which keeps asking until it is given a whole number.',
  stage: 'console',
  chain: { id: 'the-insistent-prompt', step: 2, of: 2 },
  source: 'day-17b',
}
export default project
