import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-wandering-voice',
  title: 'The Wandering Voice',
  tagline: 'Headers, failure, and formatting',
  shape: 'project',
  difficulty: 3,
  concepts: ['headers', 'RequestException', 'textwrap', 'defensive parsing'],
  objective: 'Write fetch_joke() and format_joke(joke) which survive every way a call can fail.',
  stage: 'console',
  source: 'day-23',
}
export default project
