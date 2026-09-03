import { useMemo } from 'react'
import type { ActId, Hint } from '../../course'
import { Markdown } from '../Lecture'
import { Wizard } from './Wizard'
import { hintPreamble, PATIENCE } from './lines'
import type { WizardPose } from './poses'

interface Props {
  act: ActId
  pose: WizardPose
  /** What he is saying right now, or null when he has nothing to add. */
  saying: string | null
  hints: Hint[]
  /** Highest tier already revealed for this project. */
  revealed: number
  /** Consecutive failed checks since the last pass. */
  failures: number
  onReveal: (tier: number) => void
}

export function WizardPanel({
  act,
  pose,
  saying,
  hints,
  revealed,
  failures,
  onReveal,
}: Props) {
  const sorted = useMemo(() => [...hints].sort((a, b) => a.tier - b.tier), [hints])
  const nextTier = revealed + 1
  const hasMore = nextTier <= sorted.length

  // He offers unprompted only once you have genuinely been stuck. Before that
  // the test output speaks for itself, and a character who chimes in on every
  // failure stops being welcome within the hour.
  const offering = failures >= PATIENCE && revealed === 0

  return (
    <aside className="panel-lit flex flex-col gap-3 rounded-xl border border-ink-700 p-4">
      <div className="flex items-start gap-3">
        <Wizard pose={pose} size="sm" className="shrink-0" />

        <div className="min-w-0 flex-1">
          {saying ? (
            <p className="wiz-enter text-[13px] leading-relaxed text-ink-100 italic">
              &ldquo;{saying}&rdquo;
            </p>
          ) : (
            <p className="text-[12.5px] text-ink-400">
              {failures > 0
                ? `${failures} attempt${failures === 1 ? '' : 's'} so far. He is watching quietly.`
                : 'He is reading over your shoulder.'}
            </p>
          )}

          {offering && (
            <p className="mt-2 text-[12px] text-amber-glow">
              He has something to offer, if you want it.
            </p>
          )}
        </div>
      </div>

      {revealed > 0 && (
        // Revealing a hint replaces nothing on screen — it appends below a
        // button you are still standing on — so without a live region the one
        // thing you just asked for is the one thing you are not told about.
        <ol aria-live="polite" className="flex flex-col gap-2 border-t border-ink-700 pt-3">
          {sorted.slice(0, revealed).map((hint) => (
            <li key={hint.tier} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-wider text-ink-400 uppercase">
                {hintPreamble(act, hint.tier)}
              </span>
              <Markdown markdown={hint.text} className="prose-lesson prose-compact" />
            </li>
          ))}
        </ol>
      )}

      {hasMore ? (
        <button
          onClick={() => onReveal(nextTier)}
          className={`self-start rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
            offering
              ? 'border-amber-glow/50 bg-amber-glow/10 text-amber-glow hover:bg-amber-glow/20'
              : 'border-ink-600 text-ink-200 hover:border-ink-500 hover:text-ink-50'
          }`}
        >
          {revealed === 0 ? 'Ask for a hint' : `Ask for more (${nextTier} of ${sorted.length})`}
        </button>
      ) : (
        sorted.length > 0 && (
          <p className="font-mono text-[11px] text-ink-400">
            That is every hint he has. The rest is yours.
          </p>
        )
      )}
    </aside>
  )
}
