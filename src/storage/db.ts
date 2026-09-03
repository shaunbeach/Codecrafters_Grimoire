/**
 * A very small IndexedDB wrapper. No dependency, because we need four
 * operations and none of them are interesting.
 *
 * Why not localStorage: 130 code drafts plus 130 notes will approach the ~5 MB
 * origin quota, and localStorage signals that by throwing on write — which,
 * without care, silently discards somebody's work mid-session.
 */

const DB_NAME = 'codecrafters-grimoire'
const DB_VERSION = 1

export type StoreName = 'drafts' | 'notes'

let connection: Promise<IDBDatabase> | null = null

function open(): Promise<IDBDatabase> {
  if (connection) return connection

  connection = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('drafts')) db.createObjectStore('drafts')
      if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes')
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the database'))
  })

  return connection
}

function run<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(store, mode)
        const request = work(transaction.objectStore(store))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error ?? new Error('Database write failed'))
      }),
  )
}

export async function get<T>(store: StoreName, key: string): Promise<T | undefined> {
  try {
    return await run<T>(store, 'readonly', (s) => s.get(key) as IDBRequest<T>)
  } catch {
    return undefined
  }
}

export async function put(store: StoreName, key: string, value: unknown): Promise<void> {
  try {
    await run(store, 'readwrite', (s) => s.put(value, key) as IDBRequest<IDBValidKey>)
  } catch {
    // Private browsing or a full disk. The session still works; nothing is saved.
  }
}

export async function del(store: StoreName, key: string): Promise<void> {
  try {
    await run(store, 'readwrite', (s) => s.delete(key) as unknown as IDBRequest<undefined>)
  } catch {
    /* ignore */
  }
}

export async function entries<T>(store: StoreName): Promise<Array<[string, T]>> {
  try {
    const db = await open()
    return await new Promise((resolve, reject) => {
      const out: Array<[string, T]> = []
      const request = db.transaction(store, 'readonly').objectStore(store).openCursor()
      request.onsuccess = () => {
        const cursor = request.result
        if (!cursor) {
          resolve(out)
          return
        }
        out.push([String(cursor.key), cursor.value as T])
        cursor.continue()
      }
      request.onerror = () => reject(request.error)
    })
  } catch {
    return []
  }
}

export async function clearAll(): Promise<void> {
  try {
    const db = await open()
    await Promise.all(
      (['drafts', 'notes'] as StoreName[]).map(
        (store) =>
          new Promise<void>((resolve) => {
            const request = db.transaction(store, 'readwrite').objectStore(store).clear()
            request.onsuccess = () => resolve()
            request.onerror = () => resolve()
          }),
      ),
    )
  } catch {
    /* ignore */
  }
}
