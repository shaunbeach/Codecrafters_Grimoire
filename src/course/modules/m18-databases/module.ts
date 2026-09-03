import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm18-databases',
  act: 'act3',
  order: 18,
  title: 'The Deep Index',
  region: 'The Catacomb',
  blurb: 'A real database, and questions no list could answer quickly.',
  concepts: ['sqlite3', 'CREATE / INSERT / SELECT', 'placeholders', 'commit'],
  projects: ['p1-the-deep-index', 'p2-the-standing-question'],
}

export default module
