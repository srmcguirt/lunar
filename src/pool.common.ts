export function req(module: string) {
  return typeof module !== 'undefined'
    ? module
    : require(module)
}

export const tryReq = (module: string) => {
  try {
    return req(module)
  }
  catch (error) {
    return null
  }
}

const worker_threads = tryReq('node:worker_threads')

export const isNode = (process: NodeJS.Process): boolean => {
  return typeof process !== 'undefined'
      && process.versions != null
      && process.versions.node != null
}

export const platform: 'node' | 'browser' = isNode(process)
  ? 'node'
  : 'browser'

export const isMainWorkerThread = platform === 'node'
  ? ((!worker_threads || worker_threads.isMainThread) && !process.connected)
  : typeof Window !== 'undefined'

export const getCpuCount: number = (platform === 'browser')
  ? self.navigator.hardwareConcurrency
  : tryReq('node:os').cpus().length
