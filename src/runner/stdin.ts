/**
 * A blocking stdin channel between the main thread and the Python worker.
 *
 * Python's input() is synchronous: it must not return until a line exists. The
 * worker therefore parks in Atomics.wait on a SharedArrayBuffer while the main
 * thread writes the typed line into that same buffer and wakes it.
 *
 * Two consequences that shape everything here:
 *
 *   1. A worker parked in Atomics.wait CANNOT receive postMessage. Every signal
 *      the worker needs while blocked — the line, end-of-input, cancellation —
 *      has to travel through the buffer.
 *   2. Anything the program printed must reach the screen BEFORE the worker
 *      parks, or the reader stares at a frozen console that never showed the
 *      prompt they are being asked to answer.
 */

export const CTL_STATE = 0
export const CTL_LENGTH = 1
export const CTL_GENERATION = 2

export const STATE_IDLE = 0
export const STATE_WAITING = 1
export const STATE_READY = 2
export const STATE_EOF = 3
export const STATE_CANCELLED = 4

const HEADER_INTS = 8
const DATA_BYTES = 64 * 1024

export interface StdinChannel {
  control: Int32Array
  data: Uint8Array
  /** Pyodide's own interrupt buffer: writing 2 raises KeyboardInterrupt. */
  interrupt: Uint8Array
}

export interface StdinTransfer {
  controlBuffer: SharedArrayBuffer
  interruptBuffer: SharedArrayBuffer
}

export function isolationAvailable(): boolean {
  return (
    typeof SharedArrayBuffer === 'function' &&
    (globalThis as { crossOriginIsolated?: boolean }).crossOriginIsolated === true
  )
}

export function createStdinChannel(): { channel: StdinChannel; transfer: StdinTransfer } {
  const controlBuffer = new SharedArrayBuffer(HEADER_INTS * 4 + DATA_BYTES)
  const interruptBuffer = new SharedArrayBuffer(1)

  return {
    channel: adoptStdinChannel({ controlBuffer, interruptBuffer }),
    transfer: { controlBuffer, interruptBuffer },
  }
}

export function adoptStdinChannel(transfer: StdinTransfer): StdinChannel {
  return {
    control: new Int32Array(transfer.controlBuffer, 0, HEADER_INTS),
    data: new Uint8Array(transfer.controlBuffer, HEADER_INTS * 4, DATA_BYTES),
    interrupt: new Uint8Array(transfer.interruptBuffer),
  }
}

// ---------------------------------------------------------------- main thread

export function writeLine(channel: StdinChannel, line: string) {
  const bytes = new TextEncoder().encode(line)
  const length = Math.min(bytes.length, channel.data.length)

  channel.data.set(bytes.subarray(0, length))
  Atomics.store(channel.control, CTL_LENGTH, length)
  Atomics.store(channel.control, CTL_STATE, STATE_READY)
  Atomics.notify(channel.control, CTL_STATE)
}

export function signalEof(channel: StdinChannel) {
  Atomics.store(channel.control, CTL_LENGTH, 0)
  Atomics.store(channel.control, CTL_STATE, STATE_EOF)
  Atomics.notify(channel.control, CTL_STATE)
}

/** Wake a blocked worker and raise KeyboardInterrupt inside the running code. */
export function cancel(channel: StdinChannel) {
  channel.interrupt[0] = 2 // SIGINT, as Pyodide's interrupt buffer expects
  Atomics.store(channel.control, CTL_STATE, STATE_CANCELLED)
  Atomics.notify(channel.control, CTL_STATE)
}

export function resetChannel(channel: StdinChannel) {
  channel.interrupt[0] = 0
  Atomics.store(channel.control, CTL_LENGTH, 0)
  Atomics.store(channel.control, CTL_STATE, STATE_IDLE)
  Atomics.store(channel.control, CTL_GENERATION, 0)
}

// -------------------------------------------------------------------- worker

/**
 * Blocks this thread until a line arrives. Returns null at end of input.
 * Called from Python, synchronously, through a JsProxy.
 */
export function blockingReadLine(channel: StdinChannel, onWait: () => void): string | null {
  Atomics.store(channel.control, CTL_STATE, STATE_WAITING)
  const generation = Atomics.add(channel.control, CTL_GENERATION, 1) + 1

  // Tell the main thread we are about to sleep. This must happen before the
  // wait, because once parked we cannot post anything.
  onWait()

  for (;;) {
    const state = Atomics.load(channel.control, CTL_STATE)

    if (state === STATE_READY) {
      const length = Atomics.load(channel.control, CTL_LENGTH)
      // TextDecoder refuses a view onto shared memory, so copy out first.
      const bytes = new Uint8Array(length)
      bytes.set(channel.data.subarray(0, length))
      Atomics.store(channel.control, CTL_STATE, STATE_IDLE)
      return new TextDecoder().decode(bytes)
    }
    if (state === STATE_EOF) {
      Atomics.store(channel.control, CTL_STATE, STATE_IDLE)
      return null
    }
    if (state === STATE_CANCELLED || channel.interrupt[0] !== 0) {
      Atomics.store(channel.control, CTL_STATE, STATE_IDLE)
      throw new Error('__grimoire_cancelled__')
    }

    // A bounded wait, looped: an unbounded one could never notice a
    // cancellation written without a notify, and would hang the worker for
    // the life of the tab.
    Atomics.wait(channel.control, CTL_STATE, STATE_WAITING, 500)

    if (Atomics.load(channel.control, CTL_GENERATION) !== generation) {
      // A newer request superseded this one; abandon it.
      return null
    }
  }
}
