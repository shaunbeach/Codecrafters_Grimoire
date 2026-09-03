import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-bulletproof-answer',
  title: 'The Bulletproof Answer',
  tagline: 'Refuse to crash on nonsense',
  shape: 'project',
  difficulty: 2,
  concepts: ['try / except', 'ValueError', 'TypeError', 'ZeroDivisionError'],
  objective: 'Write safe_int(text, default) and average(numbers) so neither can ever raise.',
  stage: 'console',
  chain: { id: 'the-insistent-prompt', step: 1, of: 2 },
  source: 'day-17a',
}
export default project
