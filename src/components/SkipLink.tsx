/**
 * Hidden until focused, then the first thing Tab reaches.
 *
 * Both screens put controls above the thing you came for — the map's view
 * toggle and stats, the workspace's breadcrumb and tab strip — and a keyboard
 * user should not have to walk past them on every visit.
 */
export function SkipLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a
      href={to}
      onClick={(event) => {
        // A hash link would rewrite the route, since this app routes on hashes.
        event.preventDefault()
        const target = document.querySelector<HTMLElement>(to)
        if (!target) return
        target.setAttribute('tabindex', '-1')
        target.focus()
        target.scrollIntoView({ block: 'start' })
      }}
      className="sr-only rounded-lg bg-amber-glow px-4 py-2 text-[13px] font-semibold text-amber-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
    >
      {children}
    </a>
  )
}
