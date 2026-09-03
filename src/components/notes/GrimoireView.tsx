import { useEffect, useState } from 'react'
import { COURSE, getProject, type ProjectId } from '../../course'
import { allNotes } from '../../storage/progress'
import { Wizard } from '../wizard/Wizard'

interface Entry {
  id: ProjectId
  title: string
  module: string
  text: string
}

/**
 * Everything you wrote, in course order, in one place — and exportable, because
 * a notebook you cannot take with you at the end is not a notebook.
 */
export function GrimoireView({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<Entry[] | null>(null)

  useEffect(() => {
    allNotes().then((stored) => {
      const byId = new Map(stored)
      const ordered: Entry[] = []

      for (const module of COURSE.modules) {
        for (const projectId of module.projectIds) {
          const text = byId.get(projectId)?.trim()
          if (!text) continue
          ordered.push({
            id: projectId,
            title: getProject(projectId)?.title ?? projectId,
            module: module.title,
            text,
          })
        }
      }
      setEntries(ordered)
    })
  }, [])

  const download = () => {
    if (!entries?.length) return
    const today = new Date().toISOString().slice(0, 10)
    let markdown = `# Codecrafter's Grimoire — my notes\n\n_Exported ${today}_\n`

    let lastModule = ''
    for (const entry of entries) {
      if (entry.module !== lastModule) {
        markdown += `\n## ${entry.module}\n`
        lastModule = entry.module
      }
      markdown += `\n### ${entry.title}\n\n${entry.text}\n`
    }

    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `grimoire-notes-${today}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 sm:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Wizard pose="idle" size="sm" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your Grimoire</h1>
            <p className="mt-1 text-[13.5px] text-ink-300">
              {entries === null
                ? 'Gathering…'
                : entries.length === 0
                  ? 'Nothing written down yet.'
                  : `${entries.length} note${entries.length === 1 ? '' : 's'}, in the order you wrote them.`}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-ink-600 px-4 py-2 text-[13px] font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
          >
            Back to the map
          </button>
          <button
            onClick={download}
            disabled={!entries?.length}
            className="rounded-lg bg-amber-glow px-4 py-2 text-[13px] font-semibold text-amber-ink transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export as Markdown
          </button>
        </div>
      </header>

      {entries?.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-600 p-8 text-center text-[13.5px] text-ink-300">
          Open any project and use the Notes tab. What you write there collects here.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {entries?.map((entry, index) => {
          const showModule = index === 0 || entries[index - 1].module !== entry.module
          return (
            <article key={entry.id} className="flex flex-col gap-2">
              {showModule && (
                <h2 className="mt-4 border-b border-ink-700 pb-2 font-mono text-[11px] tracking-widest text-amber-glow uppercase">
                  {entry.module}
                </h2>
              )}
              <h3 className="text-[15px] font-semibold text-ink-50">{entry.title}</h3>
              <p className="rounded-xl border border-ink-700 bg-ink-850 p-4 text-[13.5px] leading-relaxed whitespace-pre-wrap text-ink-100">
                {entry.text}
              </p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
