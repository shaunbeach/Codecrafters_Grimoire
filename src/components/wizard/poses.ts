export type WizardPose =
  | 'idle'
  | 'thinking'
  | 'conspiratorial'
  | 'delighted'
  | 'sympathetic'

export const POSES: WizardPose[] = [
  'idle',
  'thinking',
  'conspiratorial',
  'delighted',
  'sympathetic',
]

export interface PoseSpec {
  label: string
  /** What the pose is *for* — shown in the review gallery. */
  when: string
  bodyClass: string
  orbClass: string
  /** Slight tilt, so the silhouette differs before you read the face. */
  tilt: number
  sparkles: boolean
}

export const POSE_SPECS: Record<WizardPose, PoseSpec> = {
  idle: {
    label: 'Idle',
    when: 'On the map, and whenever nothing is happening.',
    bodyClass: 'wiz-bob',
    orbClass: 'wiz-glow',
    tilt: 0,
    sparkles: false,
  },
  thinking: {
    label: 'Thinking',
    when: 'While Python boots or a check is running.',
    bodyClass: 'wiz-bob-quick',
    orbClass: 'wiz-glow-fast',
    tilt: -3,
    sparkles: false,
  },
  conspiratorial: {
    label: 'Conspiratorial',
    when: 'Leaning in to offer a hint.',
    bodyClass: 'wiz-lean',
    orbClass: 'wiz-glow',
    tilt: -6,
    sparkles: false,
  },
  delighted: {
    label: 'Delighted',
    when: 'A check passed.',
    bodyClass: 'wiz-bob-quick',
    orbClass: 'wiz-glow-fast',
    tilt: 3,
    sparkles: true,
  },
  sympathetic: {
    label: 'Sympathetic',
    when: 'A check failed. He looks at the error, not at you.',
    bodyClass: 'wiz-sigh',
    orbClass: 'wiz-glow',
    tilt: 4,
    sparkles: false,
  },
}
