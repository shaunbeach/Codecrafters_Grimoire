import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-speaking-frame',
  title: 'The Speaking Frame',
  tagline: 'A terminal that looks designed',
  shape: 'project',
  difficulty: 3,
  concepts: ['ljust()', 'textwrap', 'box drawing', 'conversation loops'],
  objective: 'Write render_panel(text, title, width), reply_to(message) and chat() for a framed conversation.',
  stage: 'console',
  source: 'day-27',
}
export default project
