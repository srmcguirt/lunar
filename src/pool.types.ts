export type Worker = 'auto' | 'web' | 'process' | 'thread'
export interface WorkerPoolOpts {
  min: number
  max: number
  maxQ: number
  worker: Worker
  args: any
  opts: any
  onCreateWorker: Function
  onKillWorker: Function
}
