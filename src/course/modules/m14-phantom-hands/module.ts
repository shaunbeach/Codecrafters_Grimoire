import type { ModuleFile } from '../../loadModules'

const module: ModuleFile = {
  id: 'm14-phantom-hands',
  act: 'act3',
  order: 14,
  title: 'Phantom Hands',
  region: 'The Sorting Hall',
  blurb: 'Moving things in the world without touching one of them yourself.',
  concepts: ['os', 'shutil', 'zipfile', 'paths', 'pyautogui', 'dry runs'],
  projects: [
    'p1-the-sorting-hall',
    'p2-the-selective-hand',
    'p3-the-sealed-archive',
    'p4-the-unseen-fingers',
  ],
}

export default module
