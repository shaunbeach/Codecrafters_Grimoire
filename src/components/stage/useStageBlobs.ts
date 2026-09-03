import { useEffect, useRef, useState } from 'react'
import type { StageBlobs } from '../../runner/types'

/**
 * Turns transferred image bytes into object URLs, and — the part that matters —
 * revokes them again.
 *
 * An images module run twenty times would otherwise pin twenty bitmaps in
 * memory for the life of the tab. Every URL is released when the next run
 * arrives or the component goes away.
 */
export function useStageBlobs(blobs: StageBlobs | null): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const created = useRef<string[]>([])

  useEffect(() => {
    created.current.forEach((url) => URL.revokeObjectURL(url))
    created.current = []

    if (!blobs) {
      setUrls({})
      return
    }

    const next: Record<string, string> = {}
    for (const [id, buffer] of Object.entries(blobs)) {
      const url = URL.createObjectURL(new Blob([buffer]))
      next[id] = url
      created.current.push(url)
    }
    setUrls(next)

    return () => {
      created.current.forEach((url) => URL.revokeObjectURL(url))
      created.current = []
    }
  }, [blobs])

  return urls
}
