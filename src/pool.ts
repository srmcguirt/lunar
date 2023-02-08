interface PoolWorker {
  worker: Worker
  active: boolean
}
/**
 * Push actions to a pool of workers.
 */
export class Pool {
  private _poolWorker: Array<PoolWorker>
  private _queue = new Array<(
    worker: Worker,
    onCompleted: () => void
  ) => void>()

  constructor(poolWorkers: Array<Worker>) {
    this._poolWorker = poolWorkers.map(worker => (
      {
        worker,
        active: false,
      }
    ))
  }

  public dispose(): void {
    for (const poolWorker of this._poolWorker)
      poolWorker.worker.terminate()

    this._poolWorker = []
    this._queue = []
  }

  public _execute(
    poolWorker: PoolWorker,
    action: (
      worker: Worker,
      onCompleted: () => void
    ) => void,
  ): void {
    poolWorker.active = true
    action(poolWorker.worker, () => {
      poolWorker.active = false
      const next = this._queue.shift()
      if (next)
        this._execute(poolWorker, next)
    })
  }

  public push(
    action: (
      worker: Worker,
      onCompleted: () => void
    ) => void,
  ): void {
    for (const poolWorker of this._poolWorker) {
      if (!poolWorker.active) {
        this._execute(poolWorker, action)
        return
      }
    }
  }
}
