import { POSE_SPECS, type WizardPose } from './poses'

/**
 * One wizard, five expressions.
 *
 * Still a single SVG with swappable face and arm groups — the body, the robe
 * and the staff are drawn once and every pose reuses them. What changed in the
 * redraw is the amount of information in the drawing: brows and a nose so the
 * face reads at 64px, a beard with strands, a hat that has been slept in, a
 * belt with things on it, half-moon spectacles, and a staff whose orb is lit
 * from inside rather than filled with a colour.
 *
 * Every colour comes from a CSS custom property so he sits correctly on any
 * surface, and every animation is behind prefers-reduced-motion.
 */

const SIZES = { xs: 40, sm: 64, md: 96, lg: 140, xl: 190 } as const
export type WizardSize = keyof typeof SIZES

interface Props {
  pose?: WizardPose
  size?: WizardSize
  className?: string
  /** Decorative by default; give him a label when he carries meaning alone. */
  title?: string
}

const INK = 'var(--color-ink-950)'

/** Brows carry most of the expression; the eyes and mouth confirm it. */
function Brows({ pose }: { pose: WizardPose }) {
  const stroke = { stroke: 'var(--wiz-beard)', strokeWidth: 2.6, strokeLinecap: 'round' as const, fill: 'none' }
  switch (pose) {
    case 'thinking':
      // One up, one down: the face of someone doing the sum.
      return (
        <g {...stroke}>
          <path d="M44 44 q5 -5 11 -2" />
          <path d="M62 41 q5 -4 11 1" />
        </g>
      )
    case 'conspiratorial':
      return (
        <g {...stroke}>
          <path d="M44 42 q5 -1 11 2" />
          <path d="M62 44 q5 -3 11 -1" />
        </g>
      )
    case 'delighted':
      return (
        <g {...stroke}>
          <path d="M44 42 q5 -6 11 -3" />
          <path d="M62 39 q5 -3 11 3" />
        </g>
      )
    case 'sympathetic':
      // Inner ends lifted — concern, not judgement.
      return (
        <g {...stroke}>
          <path d="M44 46 q6 -6 11 -3" />
          <path d="M62 43 q5 -3 11 3" />
        </g>
      )
    default:
      return (
        <g {...stroke}>
          <path d="M44 44 q5 -4 11 -2" />
          <path d="M62 42 q5 -2 11 2" />
        </g>
      )
  }
}

function Face({ pose }: { pose: WizardPose }) {
  // Eyes sit at y=50, 8px either side of the centre line at x=58.
  const eye = (cx: number, cy: number, r = 2.4) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={INK} />
      <circle cx={cx - 0.8} cy={cy - 0.8} r={0.7} fill="#ffffff" opacity="0.9" />
    </g>
  )
  const mouthStroke = { stroke: INK, strokeWidth: 1.8, strokeLinecap: 'round' as const, fill: 'none' }

  switch (pose) {
    case 'delighted':
      return (
        <g>
          {/* Eyes closed with joy, cheeks up. */}
          <path d="M46 51 q4 -4.5 8 0" {...mouthStroke} strokeWidth={2} />
          <path d="M62 51 q4 -4.5 8 0" {...mouthStroke} strokeWidth={2} />
          <ellipse cx="45" cy="56" rx="3.2" ry="1.8" fill="#e9967a" opacity="0.55" />
          <ellipse cx="71" cy="56" rx="3.2" ry="1.8" fill="#e9967a" opacity="0.55" />
          <path d="M51 61 q7 7 14 0 q-7 2.5 -14 0Z" fill={INK} />
        </g>
      )
    case 'thinking':
      return (
        <g>
          {/* Eyes drift up and aside — the universal sign of working it out. */}
          {eye(51, 47.5)}
          {eye(66, 47)}
          <path d="M53 61 q4 1.5 8 0" {...mouthStroke} />
        </g>
      )
    case 'conspiratorial':
      return (
        <g>
          {eye(50, 50)}
          {/* A wink. */}
          <path d="M62.5 50 q3.5 -2.5 7 0" {...mouthStroke} strokeWidth={2} />
          <path d="M52 60 q5 4 10 -1" {...mouthStroke} />
        </g>
      )
    case 'sympathetic':
      return (
        <g>
          {eye(50, 51.5, 2.2)}
          {eye(66, 51.5, 2.2)}
          <path d="M53 62 q5 -3 10 0" {...mouthStroke} />
        </g>
      )
    default:
      return (
        <g>
          <g className="wiz-blink" style={{ transformOrigin: '58px 50px' }}>
            {eye(50, 50)}
            {eye(66, 50)}
          </g>
          <path d="M54 61 q4 1 8 0" {...mouthStroke} strokeWidth={1.6} />
        </g>
      )
  }
}

/** A sleeve is a tapered path with a cuff; a hand is skin with a hint of knuckle. */
function Sleeve({ d, cuff }: { d: string; cuff: [number, number] }) {
  return (
    <g>
      <path d={d} stroke="var(--wiz-robe-light)" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d={d} stroke="var(--wiz-robe)" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.35" strokeDasharray="0 14 40" />
      <circle cx={cuff[0]} cy={cuff[1]} r="5.6" fill="var(--wiz-trim)" opacity="0.9" />
    </g>
  )
}

function Hand({ x, y, r = 4.4 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="var(--wiz-skin)" />
      <path
        d={`M${x - r * 0.6} ${y - r * 0.2} q${r * 0.6} -${r * 0.5} ${r * 1.2} 0`}
        stroke="var(--wiz-skin-dark)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}

function Arms({ pose }: { pose: WizardPose }) {
  switch (pose) {
    case 'thinking':
      // One hand up at the beard, the other tucked.
      return (
        <g>
          <Sleeve d="M44 90 q-9 8 -7 18" cuff={[37, 108]} />
          <Sleeve d="M72 88 q7 -12 -3 -18" cuff={[69, 70]} />
          <Hand x={67} y={68} />
        </g>
      )
    case 'conspiratorial':
      // A hand cupped beside the mouth.
      return (
        <g>
          <Sleeve d="M44 90 q-10 6 -9 16" cuff={[35, 106]} />
          <Sleeve d="M72 88 q11 -8 -1 -20" cuff={[71, 68]} />
          <path d="M67 62 q7 3 5 10" stroke="var(--wiz-skin)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      )
    case 'delighted':
      // Both arms thrown up.
      return (
        <g>
          <Sleeve d="M44 88 q-15 -10 -13 -27" cuff={[31, 61]} />
          <Sleeve d="M72 88 q15 -10 13 -27" cuff={[85, 61]} />
          <Hand x={30} y={56} />
          <Hand x={86} y={56} />
        </g>
      )
    case 'sympathetic':
      // One hand open, offered.
      return (
        <g>
          <Sleeve d="M44 90 q-13 10 -5 20" cuff={[39, 110]} />
          <Sleeve d="M72 90 q10 8 14 4" cuff={[86, 94]} />
          <ellipse cx="90" cy="93" rx="5.2" ry="3.6" fill="var(--wiz-skin)" />
        </g>
      )
    default:
      // Idle: hands clasped in front, which reads at any size and keeps the
      // silhouette calm.
      return (
        <g>
          <Sleeve d="M42 88 q-10 12 -2 22" cuff={[40, 110]} />
          <Sleeve d="M74 88 q10 12 2 22" cuff={[76, 110]} />
          <ellipse cx="58" cy="112" rx="8" ry="5.2" fill="var(--wiz-skin)" />
          <path d="M52 112 h12" stroke="var(--wiz-skin-dark)" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      )
  }
}

export function Wizard({ pose = 'idle', size = 'md', className = '', title }: Props) {
  const spec = POSE_SPECS[pose]
  const px = SIZES[size]
  // Gradient ids must be unique per instance: several wizards share a page.
  const uid = `wz-${size}-${pose}`

  return (
    <svg
      viewBox="0 0 120 150"
      width={px}
      height={(px * 150) / 120}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={
        {
          '--wiz-robe': '#4a3d8f',
          '--wiz-robe-dark': '#2f2566',
          '--wiz-robe-light': '#6656ad',
          '--wiz-inner': '#8a78d6',
          '--wiz-skin': '#ebcba6',
          '--wiz-skin-dark': '#c9a07a',
          '--wiz-beard': '#e6e9f0',
          '--wiz-beard-dark': '#b9c0cf',
          '--wiz-leather': '#5a3b22',
          '--wiz-trim': 'var(--color-amber-glow)',
          overflow: 'visible',
        } as React.CSSProperties
      }
    >
      <defs>
        <radialGradient id={`${uid}-orb`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fffbea" />
          <stop offset="35%" stopColor="#ffe08a" />
          <stop offset="75%" stopColor="var(--color-amber-deep)" />
          <stop offset="100%" stopColor="#7a4d10" />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-amber-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-amber-glow)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-robe`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="var(--wiz-robe-light)" />
          <stop offset="55%" stopColor="var(--wiz-robe)" />
          <stop offset="100%" stopColor="var(--wiz-robe-dark)" />
        </linearGradient>
        <linearGradient id={`${uid}-hat`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="var(--wiz-robe-light)" />
          <stop offset="100%" stopColor="var(--wiz-robe-dark)" />
        </linearGradient>
        <linearGradient id={`${uid}-beard`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--wiz-beard)" />
          <stop offset="100%" stopColor="var(--wiz-beard-dark)" />
        </linearGradient>
      </defs>

      {/* Cast shadow: he stands on something. */}
      <ellipse cx="60" cy="143" rx="30" ry="4.5" fill="var(--color-ink-950)" opacity="0.35" />

      <g
        className={spec.bodyClass}
        style={{ transform: `rotate(${spec.tilt}deg)`, transformOrigin: '58px 130px' }}
      >
        {/* Staff, behind the body: gnarled, with a leather grip and a cradle for the orb. */}
        <path
          d="M97 42 q-3 22 -2 46 q1 26 -2 52"
          stroke="#4e361c"
          strokeWidth="4.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M97 42 q-3 22 -2 46 q1 26 -2 52"
          stroke="#7d5a30"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path d="M94 96 v14" stroke="var(--wiz-leather)" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M92 98 h5 M92 102 h5 M92 106 h5" stroke="#3a2412" strokeWidth="0.9" />
        {/* Claw cradle */}
        <path d="M91 40 q-5 -8 2 -13 M103 40 q5 -8 -2 -13" stroke="#4e361c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="97" cy="29" r="18" fill={`url(#${uid}-halo)`} className={spec.orbClass} />
        <circle cx="97" cy="29" r="8.5" fill={`url(#${uid}-orb)`} />
        <circle cx="94.5" cy="26" r="2.2" fill="#ffffff" opacity="0.85" />
        <g className="wiz-orbit" style={{ transformOrigin: '97px 29px' }}>
          <circle cx="107" cy="29" r="1.1" fill="#fff3c4" />
          <circle cx="87" cy="29" r="0.8" fill="#fff3c4" opacity="0.8" />
        </g>

        {/* Robe: body, inner panel, folds, hem. */}
        <path
          d="M58 74 q24 6 28 42 q4 20 3 24 h-62 q-1 -4 3 -24 q4 -36 28 -42Z"
          fill={`url(#${uid}-robe)`}
        />
        <path d="M58 80 q-6 30 -9 58 h18 q-3 -28 -9 -58Z" fill="var(--wiz-inner)" opacity="0.55" />
        <g stroke="var(--wiz-robe-dark)" strokeWidth="1.3" fill="none" opacity="0.55" strokeLinecap="round">
          <path d="M40 100 q-2 20 -4 38" />
          <path d="M76 100 q2 20 4 38" />
          <path d="M48 118 q-1 10 -2 20" />
        </g>
        <path className="wiz-hem" d="M27 140 q31 6 62 0" stroke="var(--wiz-trim)" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
        <path d="M27 140 q31 6 62 0" stroke="var(--wiz-trim)" strokeWidth="0.8" strokeDasharray="1.5 3" fill="none" opacity="0.9" transform="translate(0 -4)" />

        {/* Belt, buckle, pouch, and a hanging key. */}
        <path d="M37 96 q21 5 42 0" stroke="var(--wiz-leather)" strokeWidth="5" fill="none" />
        <rect x="54" y="93.5" width="8" height="6" rx="1" fill="var(--wiz-trim)" />
        <rect x="56" y="95" width="4" height="3" rx="0.6" fill="var(--wiz-leather)" />
        <path d="M70 99 q-1 8 5 9 q6 -1 5 -9Z" fill="var(--wiz-leather)" />
        <path d="M70 99 h10" stroke="#3a2412" strokeWidth="1.2" />
        <path d="M45 99 v8" stroke="var(--wiz-trim)" strokeWidth="1.2" />
        <circle cx="45" cy="109" r="2" stroke="var(--wiz-trim)" strokeWidth="1.2" fill="none" />

        <Arms pose={pose} />

        {/* Hair, behind the head. */}
        <path d="M42 46 q-6 10 -2 22 q4 -2 6 -10Z" fill={`url(#${uid}-beard)`} />
        <path d="M74 46 q6 10 2 22 q-4 -2 -6 -10Z" fill={`url(#${uid}-beard)`} />

        {/* Head. */}
        <circle cx="58" cy="52" r="16" fill="var(--wiz-skin)" />
        <path d="M44 56 q3 10 14 12 q11 -2 14 -12" fill="var(--wiz-skin-dark)" opacity="0.25" />
        {/* Nose. */}
        <path d="M58 52 q3 4 1 7" stroke="var(--wiz-skin-dark)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Beard: shape, then strands. */}
        <path d="M44 58 q2 30 14 34 q12 -4 14 -34 q-14 9 -28 0Z" fill={`url(#${uid}-beard)`} />
        <g stroke="var(--wiz-beard-dark)" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M50 66 q0 10 3 18" />
          <path d="M58 68 q0 12 0 20" />
          <path d="M66 66 q0 10 -3 18" />
        </g>
        {/* Moustache. */}
        <path d="M49 62 q9 6 18 0 q-4 5 -9 4 q-5 1 -9 -4Z" fill="var(--wiz-beard)" />

        <Brows pose={pose} />
        <Face pose={pose} />

        {/* Half-moon spectacles. */}
        <g stroke="#d9c07a" strokeWidth="1.1" fill="none">
          <path d="M45 52 a5 4 0 0 0 10 0" />
          <path d="M61 52 a5 4 0 0 0 10 0" />
          <path d="M55 52 h6" />
          <path d="M45 52 l-3 -1.5 M71 52 l3 -1.5" />
        </g>

        {/* Hat: brim, band, a cone that has been sat on, a bent tip. */}
        <ellipse cx="58" cy="40" rx="29" ry="7" fill="var(--wiz-robe-dark)" />
        <ellipse cx="58" cy="39" rx="29" ry="6.2" fill="var(--wiz-robe)" />
        <g className="wiz-hat" style={{ transformOrigin: '58px 40px' }}>
          <path d="M39 40 q4 -20 16 -30 q6 -6 10 -8 q-2 12 6 26 q4 8 5 12Z" fill={`url(#${uid}-hat)`} />
          {/* The tip flops over. */}
          <path d="M65 2 q10 -4 14 6 q-6 -2 -10 3" fill="var(--wiz-robe-light)" />
          <path d="M39 40 q6 -4 14 -10" stroke="var(--wiz-robe-light)" strokeWidth="1.2" fill="none" opacity="0.6" />
          {/* A patch, stitched. */}
          <path d="M46 26 l7 -3 l3 6 l-7 3Z" fill="var(--wiz-robe-dark)" />
          <path d="M46 26 l7 -3 l3 6 l-7 3Z" stroke="var(--wiz-trim)" strokeWidth="0.7" strokeDasharray="1.2 1.4" fill="none" />
          {/* Band and buckle. */}
          <path d="M40 38 q18 6 36 0" stroke="var(--wiz-leather)" strokeWidth="3.2" fill="none" />
          <rect x="55" y="37" width="6" height="4.6" rx="0.8" fill="var(--wiz-trim)" />
          {/* Moon and stars. */}
          <path d="M60 18 a4 4 0 1 0 3 6 a3 3 0 1 1 -3 -6Z" fill="var(--wiz-trim)" opacity="0.95" />
          <path d="M53 14 l1 2.2 2.4 .3 -1.8 1.6 .5 2.4 -2.1 -1.2 -2.1 1.2 .5 -2.4 -1.8 -1.6 2.4 -.3Z" fill="var(--wiz-trim)" />
          <circle cx="66" cy="28" r="1" fill="var(--wiz-trim)" />
        </g>

        {spec.sparkles && (
          <g fill="var(--color-amber-glow)">
            <path className="wiz-sparkle" style={{ animationDelay: '0s' }} d="M22 44 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6Z" />
            <path className="wiz-sparkle" style={{ animationDelay: '0.35s' }} d="M104 64 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3Z" />
            <path className="wiz-sparkle" style={{ animationDelay: '0.7s' }} d="M84 16 l1.1 2.7 2.7 1.1 -2.7 1.1 -1.1 2.7 -1.1 -2.7 -2.7 -1.1 2.7 -1.1Z" />
            <path className="wiz-sparkle" style={{ animationDelay: '1.05s' }} d="M18 90 l1.1 2.7 2.7 1.1 -2.7 1.1 -1.1 2.7 -1.1 -2.7 -2.7 -1.1 2.7 -1.1Z" />
          </g>
        )}
      </g>
    </svg>
  )
}
