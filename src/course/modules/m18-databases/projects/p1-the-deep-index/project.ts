import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-deep-index',
  title: 'The Deep Index',
  tagline: 'A database in one file',
  shape: 'project',
  difficulty: 3,
  concepts: ['sqlite3', 'CREATE TABLE', 'placeholders', 'commit()', 'rowcount'],
  objective: 'Write create_db, add_quest, complete_quest and open_quests using the sqlite3 module.',
  stage: 'files',
  source: 'day-26',
}
export default project
