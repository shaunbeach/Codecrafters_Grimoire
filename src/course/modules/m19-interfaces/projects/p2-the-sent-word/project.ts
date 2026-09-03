import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-sent-word',
  title: 'The Sent Word',
  tagline: 'Compose a message that leaves the building',
  shape: 'drill',
  difficulty: 3,
  concepts: ['EmailMessage', 'smtplib', 'starttls()', 'secrets in the environment'],
  objective: 'Write send_report(server, to, subject, body) which composes and sends a message safely.',
  stage: 'console',
}
export default project
