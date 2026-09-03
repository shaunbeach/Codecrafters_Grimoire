import type { KeyboardEvent } from 'react'

/**
 * Arrow-key movement for a `role="tablist"`, as the pattern requires.
 *
 * A tablist is one stop in the tab order, not one per tab: you Tab into the
 * strip and then use arrows. That means the unselected tabs must be removed
 * from the tab order (tabIndex -1) and focus has to be moved by hand when the
 * selection changes — which is what `roving` and this handler do between them.
 */
export function roving(selected: boolean) {
  return { role: 'tab' as const, tabIndex: selected ? 0 : -1 }
}

export function onTabKeys<T extends string>(
  ids: readonly T[],
  current: T,
  select: (id: T) => void,
) {
  return (event: KeyboardEvent<HTMLElement>) => {
    const at = ids.indexOf(current)
    if (at < 0) return

    const to =
      event.key === 'ArrowRight'
        ? (at + 1) % ids.length
        : event.key === 'ArrowLeft'
          ? (at - 1 + ids.length) % ids.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? ids.length - 1
              : -1

    if (to < 0) return
    event.preventDefault()
    select(ids[to])

    // Follow the selection with focus, or the arrow key moves the panel out
    // from under the user without moving them with it.
    const strip = event.currentTarget.closest('[role="tablist"]')
    strip?.querySelectorAll<HTMLElement>('[role="tab"]')[to]?.focus()
  }
}
