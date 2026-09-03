import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p5-reading-the-runes',
  title: 'Reading the Runes',
  tagline: 'Restore a worn inscription to its proper case',
  shape: 'drill',
  difficulty: 2,
  concepts: ['.split()', '.capitalize()', '.join()', 'string methods'],
  objective: 'Write read_runes(text) which puts a battered inscription back into title case.',
  stage: 'console',
}
export default project
