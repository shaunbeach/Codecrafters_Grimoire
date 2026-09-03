import { useSyncExternalStore } from 'react'
import type { ProjectId } from './course'

/**
 * Hash routing, hand-rolled. Four routes does not justify a router, and hashes
 * mean a static host needs no rewrite rules — which matters when the same host
 * is already juggling cross-origin isolation headers.
 */
export type Route =
  | { name: 'map' }
  | { name: 'project'; projectId: ProjectId }
  | { name: 'grimoire' }
  | { name: 'wizard' }

export function parse(hash: string): Route {
  const path = hash.replace(/^#\/?/, '')
  if (path.startsWith('p/')) {
    const projectId = decodeURIComponent(path.slice(2))
    if (projectId) return { name: 'project', projectId }
  }
  if (path === 'grimoire') return { name: 'grimoire' }
  if (path === 'wizard') return { name: 'wizard' }
  return { name: 'map' }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'project':
      return `#/p/${encodeURIComponent(route.projectId)}`
    case 'grimoire':
      return '#/grimoire'
    case 'wizard':
      return '#/wizard'
    default:
      return '#/'
  }
}

export function navigate(route: Route) {
  const target = href(route)
  if (window.location.hash !== target) window.location.hash = target
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => '',
  )
  return parse(hash)
}
