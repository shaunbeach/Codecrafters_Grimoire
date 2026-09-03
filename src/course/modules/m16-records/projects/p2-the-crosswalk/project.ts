import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p2-the-crosswalk',
  title: 'The Crosswalk',
  tagline: 'Read one format, write another',
  shape: 'project',
  difficulty: 3,
  concepts: ['csv.DictReader', 'newline=\'\'', 'type conversion', 'json.dump()'],
  objective: 'Write csv_to_json(csv_path, json_path) converting a roster and typing its numbers.',
  stage: 'files',
}
export default project
