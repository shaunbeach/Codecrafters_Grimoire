import type { ProjectFile } from '../../../../loadModules'

const project: ProjectFile = {
  slug: 'p4-the-unseen-fingers',
  title: 'The Unseen Fingers',
  tagline: 'Drive a programme that has no API',
  shape: 'drill',
  difficulty: 3,
  concepts: ['pyautogui', 'locateCenterOnScreen', 'None checks', 'raising'],
  objective: 'Write fill_form(fields, submit_image) which types into a form and clicks its button.',
  stage: 'console',
  packages: ['pyautogui'],
}
export default project
