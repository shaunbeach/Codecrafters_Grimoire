import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-nested-sight',
  title: 'The Nested Sight',
  tagline: 'Search inside what you found',
  shape: 'project',
  difficulty: 3,
  concepts: ['nested find', 'None checks', 'keeping fields together'],
  objective: 'Write scrape_stories(html) returning one dict per article, with its fields correctly paired.',
  stage: 'console',
  source: 'day-25b',
}
export default project
