import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-quartermasters-book',
  title: "The Quartermaster's Book",
  tagline: 'Counts that go up, down, and away entirely',
  shape: 'project',
  difficulty: 2,
  concepts: ['dict', '.get()', 'del', 'sorted()'],
  objective: 'Write add_item, remove_item and inventory_report over a {item: quantity} dictionary.',
  stage: 'console',
  source: 'day-09',
}
export default project
