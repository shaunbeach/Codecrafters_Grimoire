import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-far-oracle',
  title: 'The Far Oracle',
  tagline: 'Ask a machine you have never seen',
  shape: 'project',
  difficulty: 3,
  concepts: ['requests.get()', 'params', 'status codes', 'nested JSON'],
  objective: 'Write fetch_weather(city) which calls the service, checks the status and flattens the JSON.',
  stage: 'console',
  source: 'day-22',
}
export default project
