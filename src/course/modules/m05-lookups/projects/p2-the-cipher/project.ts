import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-cipher',
  title: 'The Shifted Alphabet',
  tagline: 'A table built once, consulted often',
  shape: 'project',
  difficulty: 3,
  concepts: ['ord() / chr()', 'modulo', 'dict as a lookup table', '.join()'],
  objective: 'Write build_cipher(shift), encode(text, shift) and decode(text, shift).',
  stage: 'console',
  source: 'day-10',
}
export default project
