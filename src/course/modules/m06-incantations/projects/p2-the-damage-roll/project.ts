import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-damage-roll',
  title: 'The Damage Roll',
  tagline: 'Hand back two things at once',
  shape: 'project',
  difficulty: 3,
  concepts: ['tuples', 'unpacking', 'max()', 'composition'],
  objective: 'Write roll_attack(power, defence) returning a (damage, is_critical) tuple, plus resolve_battle().',
  stage: 'console',
  source: 'day-12',
}
export default project
