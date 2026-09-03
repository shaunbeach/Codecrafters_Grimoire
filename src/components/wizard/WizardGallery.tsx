import { useState } from 'react'
import { ACTS, type ActId } from '../../course'
import { Wizard } from './Wizard'
import { POSE_SPECS, POSES, type WizardPose } from './poses'
import { hintPreamble, speak } from './lines'

const EVENTS = [
  'greeting',
  'booting',
  'checking',
  'pass',
  'passFirstTry',
  'failOffer',
  'fatalSyntax',
  'moduleComplete',
  'locked',
] as const

/**
 * A review surface for the character: every pose side by side, and every line
 * he can say in each of the three acts. Not part of the course — this exists so
 * the poses and the voice can be judged without playing through to Act III.
 */
export function WizardGallery({ onBack }: { onBack: () => void }) {
  const [focused, setFocused] = useState<WizardPose>('idle')
  const [act, setAct] = useState<ActId>('act1')
  const [nonce, setNonce] = useState(0)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 sm:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-widest text-amber-glow uppercase">
            Review surface
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">The Wizard</h1>
          <p className="mt-1.5 max-w-xl text-[13.5px] text-ink-300">
            One SVG body with swappable face and arms. Every animation is behind{' '}
            <code className="font-mono text-[12px] text-ink-100">prefers-reduced-motion</code>.
          </p>
        </div>
        <button
          onClick={onBack}
          className="rounded-lg border border-ink-600 px-4 py-2 text-[13px] font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
        >
          Back to the map
        </button>
      </header>

      <section className="flex flex-col items-center gap-6 rounded-2xl border border-ink-700 bg-ink-850 p-10">
        <Wizard pose={focused} size="xl" title={`The wizard, ${POSE_SPECS[focused].label}`} />
        <div className="text-center">
          <p className="text-[15px] font-semibold">{POSE_SPECS[focused].label}</p>
          <p className="mt-1 max-w-md text-[13px] text-ink-300">{POSE_SPECS[focused].when}</p>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[11px] tracking-widest text-ink-400 uppercase">
          All five states
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {POSES.map((pose) => (
            <button
              key={pose}
              onClick={() => setFocused(pose)}
              aria-pressed={focused === pose}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                focused === pose
                  ? 'border-amber-glow bg-amber-glow/8'
                  : 'border-ink-700 hover:border-ink-500'
              }`}
            >
              <Wizard pose={pose} size="sm" />
              <span
                className={`text-[12px] font-medium ${
                  focused === pose ? 'text-amber-glow' : 'text-ink-200'
                }`}
              >
                {POSE_SPECS[pose].label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-[11px] tracking-widest text-ink-400 uppercase">
            His voice, by act
          </h2>
          <div className="flex gap-1 rounded-lg border border-ink-700 p-1">
            {ACTS.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setAct(entry.id)}
                aria-pressed={act === entry.id}
                className={`rounded px-3 py-1 text-[12.5px] font-medium transition-colors ${
                  act === entry.id ? 'bg-ink-700 text-ink-50' : 'text-ink-300 hover:text-ink-100'
                }`}
              >
                {entry.name}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-[13.5px] text-ink-300">
          {ACTS.find((entry) => entry.id === act)?.blurb}
        </p>

        <button
          onClick={() => setNonce((value) => value + 1)}
          className="mt-4 rounded-lg border border-ink-600 px-3 py-1.5 text-[12.5px] text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
        >
          Draw new lines
        </button>

        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-700">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-ink-850">
                <th className="border-b border-ink-700 px-4 py-2.5 text-left font-mono text-[10px] tracking-wider text-ink-400 uppercase">
                  When
                </th>
                <th className="border-b border-ink-700 px-4 py-2.5 text-left font-mono text-[10px] tracking-wider text-ink-400 uppercase">
                  He says
                </th>
              </tr>
            </thead>
            <tbody key={`${act}-${nonce}`}>
              {EVENTS.map((event) => (
                <tr key={event}>
                  <td className="border-b border-ink-800 px-4 py-2.5 align-top font-mono text-[11.5px] text-ink-300">
                    {event}
                  </td>
                  <td className="border-b border-ink-800 px-4 py-2.5 text-ink-100 italic">
                    &ldquo;{speak(act, event)}&rdquo;
                  </td>
                </tr>
              ))}
              {[1, 2, 3].map((tier) => (
                <tr key={`hint-${tier}`}>
                  <td className="border-b border-ink-800 px-4 py-2.5 align-top font-mono text-[11.5px] text-ink-300">
                    hint tier {tier}
                  </td>
                  <td className="border-b border-ink-800 px-4 py-2.5 text-ink-100 italic">
                    &ldquo;{hintPreamble(act, tier)}&rdquo;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
