import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-patient-caller',
  title: 'The Patient Caller',
  tagline: 'Ask again, but not immediately',
  shape: 'drill',
  difficulty: 3,
  concepts: ['retries', 'backoff', 'RequestException', 'being a good guest'],
  objective: 'Write fetch_with_retry(url, attempts) which retries a flaky call politely.',
  stage: 'console',
}
export default project
