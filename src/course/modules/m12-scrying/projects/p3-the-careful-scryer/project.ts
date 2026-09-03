import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p3-the-careful-scryer',
  title: 'The Careful Scryer',
  tagline: 'Fail loudly when the page changes',
  shape: 'drill',
  difficulty: 3,
  concepts: ['defensive scraping', 'raising', 'reporting what broke'],
  objective: 'Write scrape_prices(html) which extracts prices and refuses to return silent nonsense.',
  stage: 'console',
}
export default project
