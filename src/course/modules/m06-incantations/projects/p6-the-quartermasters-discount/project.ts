import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p6-the-quartermasters-discount',
  title: "The Quartermaster's Price",
  tagline: 'Defaults that make the common call short',
  shape: 'drill',
  difficulty: 2,
  concepts: ['default arguments', 'keyword arguments', 'round()'],
  objective: 'Write price(base, discount_percent=0, tax_rate=0.05) returning what is owed.',
  stage: 'console',
}
export default project
