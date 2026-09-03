import { useEffect, useRef, useState } from 'react'
import type { ProjectId } from '../../course'
import { loadNote, saveNote } from '../../storage/progress'

/**
 * Per-project notes, autosaved. Deliberately plain text: a notes box that
 * demands syntax is a notes box people stop using.
 */
export function NotesPane({ projectId }: { projectId: ProjectId }) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let live = true
    setText('')
    setSaved('idle')
    loadNote(projectId).then((stored) => {
      if (live) setText(stored ?? '')
    })
    return () => {
      live = false
    }
  }, [projectId])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const update = (value: string) => {
    setText(value)
    setSaved('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      void saveNote(projectId, value).then(() => setSaved('saved'))
    }, 400)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="text-[12.5px] text-ink-300">
          Whatever you want to remember about this one.
        </p>
        <span className="font-mono text-[10px] text-ink-400" aria-live="polite">
          {saved === 'saving' ? 'saving…' : saved === 'saved' ? 'saved' : ''}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(event) => update(event.target.value)}
        spellCheck
        placeholder="What tripped you up? What would you tell yourself next time?"
        aria-label="Notes for this project"
        className="min-h-0 flex-1 resize-none rounded-xl border border-ink-700 bg-ink-950 p-4 font-mono text-[13px] leading-relaxed text-ink-100 placeholder:text-ink-400 focus:border-ink-500 focus:outline-none"
      />
    </div>
  )
}
