import {
  cancel as cancelStdin,
  createStdinChannel,
  isolationAvailable,
  resetChannel,
  signalEof,
  writeLine,
  type StdinChannel,
  type StdinTransfer,
} from './stdin'
import type {
  RunReport,
  RunSpec,
  ScriptReport,
  StageBlobs,
  WorkerResponse,
} from './types'

const TIMEOUT_MS = 15000

type Pending = {
  resolve: (value: any) => void
  reject: (reason: Error) => void
  timer: number
  timeoutMs: number
}

export interface TestOutcome {
  report: RunReport
  blobs: StageBlobs
}

export interface ScriptOutcome {
  report: ScriptReport
  blobs: StageBlobs
}

/**
 * Owns the Pyodide web worker. Running Python off the main thread keeps a
 * runaway `while True:` from freezing the page — we just kill the worker.
 */
class PythonRunner {
  private worker: Worker | null = null
  private pending = new Map<number, Pending>()
  private nextId = 1
  private statusListeners = new Set<(message: string) => void>()
  private outputListeners = new Set<(chunk: string) => void>()
  private waitListeners = new Set<() => void>()

  private stdin: StdinChannel | null = null
  private stdinTransfer: StdinTransfer | null = null
  /** True while the worker is parked in Atomics.wait for a typed line. */
  private blocked = false

  /** Whether input() can actually pause and wait for a person. */
  readonly interactive = isolationAvailable()

  onStatus(listener: (message: string) => void): () => void {
    this.statusListeners.add(listener)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  /** Output as it is produced, rather than only when the run finishes. */
  onOutput(listener: (chunk: string) => void): () => void {
    this.outputListeners.add(listener)
    return () => {
      this.outputListeners.delete(listener)
    }
  }

  /** Fires when the program is waiting for a line of input. */
  onAwaitingInput(listener: () => void): () => void {
    this.waitListeners.add(listener)
    return () => {
      this.waitListeners.delete(listener)
    }
  }

  /** Hand a typed line to a program that is waiting for one. */
  submitInput(line: string) {
    if (!this.stdin || !this.blocked) return
    this.blocked = false
    writeLine(this.stdin, line)
    this.restartWatchdog()
  }

  /** Tell a waiting program that no more input is coming. */
  endInput() {
    if (!this.stdin || !this.blocked) return
    this.blocked = false
    signalEof(this.stdin)
    this.restartWatchdog()
  }

  /** Stop a running program — including one parked waiting for input. */
  stop() {
    if (this.stdin) {
      this.blocked = false
      cancelStdin(this.stdin)
      return
    }
    this.terminate()
  }

  /**
   * The 15-second watchdog exists to rescue a runaway loop. A program politely
   * waiting for a human to type is not runaway, so the clock stops while it is
   * blocked and starts again once a line is handed over.
   */
  private pauseWatchdog() {
    this.blocked = true
    this.pending.forEach((entry) => clearTimeout(entry.timer))
  }

  private restartWatchdog() {
    this.pending.forEach((entry, id) => {
      clearTimeout(entry.timer)
      entry.timer = window.setTimeout(() => this.expire(id, entry), entry.timeoutMs)
    })
  }

  private expire(id: number, entry: Pending) {
    this.pending.delete(id)
    this.terminate()
    entry.reject(
      new Error(
        `Your code ran for more than ${entry.timeoutMs / 1000} seconds and was stopped. ` +
          'This usually means a loop never reaches its end condition.',
      ),
    )
  }

  private spawn(): Worker {
    if (this.worker) return this.worker

    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data

      if (message.kind === 'status') {
        this.statusListeners.forEach((listener) => listener(message.message))
        return
      }
      if (message.kind === 'stdout') {
        this.outputListeners.forEach((listener) => listener(message.chunk))
        return
      }
      if (message.kind === 'awaiting-input') {
        this.pauseWatchdog()
        this.waitListeners.forEach((listener) => listener())
        return
      }

      const entry = this.pending.get(message.id)
      if (!entry) return
      this.pending.delete(message.id)
      clearTimeout(entry.timer)
      this.blocked = false

      if (message.kind === 'error') {
        entry.reject(new Error(message.message))
      } else if (message.kind === 'result') {
        const blobs: StageBlobs = {}
        for (const blob of message.blobs ?? []) blobs[blob.id] = blob.buffer
        entry.resolve({ report: message.payload, blobs })
      } else {
        entry.resolve(undefined)
      }
    }

    worker.onerror = (event) => {
      const error = new Error(event.message || 'The Python worker crashed.')
      this.pending.forEach((entry) => {
        clearTimeout(entry.timer)
        entry.reject(error)
      })
      this.pending.clear()
      this.terminate()
    }

    this.worker = worker
    return worker
  }

  terminate() {
    this.worker?.terminate()
    this.worker = null
    this.blocked = false
    // stdinTransfer is deliberately kept: a terminated worker takes the
    // interpreter with it, and the replacement needs the same shared buffer
    // handed to it on its next boot.
  }

  private send<T>(payload: Record<string, unknown>, timeoutMs = TIMEOUT_MS): Promise<T> {
    this.ensureChannel()
    const worker = this.spawn()
    const id = this.nextId++

    return new Promise<T>((resolve, reject) => {
      const entry: Pending = { resolve, reject, timer: 0, timeoutMs }
      entry.timer = window.setTimeout(() => this.expire(id, entry), timeoutMs)
      this.pending.set(id, entry)
      // The channel rides along on every message, not just boot: a worker killed
      // by the watchdog is replaced, and its first message may be a run.
      worker.postMessage({ id, stdin: this.stdinTransfer ?? undefined, ...payload })
    })
  }

  private ensureChannel() {
    if (!this.interactive || this.stdinTransfer) return
    const created = createStdinChannel()
    this.stdin = created.channel
    this.stdinTransfer = created.transfer
  }

  boot(): Promise<void> {
    this.ensureChannel()
    if (this.stdin) resetChannel(this.stdin)
    // Booting downloads and starts CPython; it deserves a longer leash.
    return this.send({ kind: 'boot' }, 120000)
  }

  capabilities(): Promise<{ report: Record<string, unknown> }> {
    return this.send({ kind: 'capabilities' }, 120000)
  }

  loadPackages(packages: string[]): Promise<unknown> {
    return this.send({ kind: 'packages', packages }, 180000)
  }

  runTests(code: string, spec: RunSpec, packages: string[] = []): Promise<TestOutcome> {
    return this.send({ kind: 'test', code, spec, packages })
  }

  runScript(code: string, spec: RunSpec, packages: string[] = []): Promise<ScriptOutcome> {
    if (this.stdin) resetChannel(this.stdin)
    this.blocked = false
    return this.send({ kind: 'script', code, spec, packages })
  }
}

export const pythonRunner = new PythonRunner()
