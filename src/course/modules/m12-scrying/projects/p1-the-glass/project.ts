import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p1-the-glass',
  title: 'The Glass',
  tagline: 'Look into a page and take what you find',
  shape: 'project',
  difficulty: 3,
  concepts: ['BeautifulSoup', 'find_all()', 'get_text(strip=True)', '.get()'],
  objective: 'Write scrape_headlines(html) and scrape_links(html) to pull the titles and URLs off a page.',
  stage: 'console',
  source: 'day-25a',
}
export default project
