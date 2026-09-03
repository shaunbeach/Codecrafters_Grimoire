import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-interchange',
  title: 'The Interchange',
  tagline: 'Save state a machine can read anywhere',
  shape: 'project',
  difficulty: 2,
  concepts: ['json.dump()', 'json.load()', 'indent', 'JSONDecodeError'],
  objective: 'Write save_state(path, state) and load_state(path) that survive a missing or broken file.',
  stage: 'files',
}
export default project
