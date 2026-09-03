/**
 * Shown while a route's chunk or a module's content is in flight.
 *
 * It announces itself. A screen reader user who follows a link and hears
 * nothing has no way to tell a slow fetch from a dead control, so the wait is
 * spoken once, politely, rather than left to the spinner.
 */
export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-ink-300"
    >
      <span
        aria-hidden
        className="size-6 animate-spin rounded-full border-2 border-ink-700 border-t-amber-glow motion-reduce:animate-none"
      />
      <p className="text-[13px]">{label}…</p>
    </div>
  )
}
