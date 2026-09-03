import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-name-generator',
  title: 'The Naming',
  tagline: 'Two lists, one adventurer',
  shape: 'project',
  difficulty: 2,
  concepts: ['lists', 'random.choice()', 'len()'],
  objective: 'Write generate_name(adjectives, nouns) and generate_party(adjectives, nouns, size).',
  stage: 'console',
  source: 'day-07',
}
export default project
