import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p5-the-untrusted-scroll',
  title: 'The Untrusted Scroll',
  tagline: 'Data somebody else wrote, and you cannot trust any of it',
  shape: 'drill',
  difficulty: 3,
  concepts: ['KeyError', 'TypeError', 'defensive parsing', 'defaults'],
  objective: 'Write read_scroll(record) turning an untrusted dictionary into a clean, complete one.',
  stage: 'console',
}
export default project
