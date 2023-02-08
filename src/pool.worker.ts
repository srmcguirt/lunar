const TERM_ID = ' __worker_terminate__ '

const tryReq = (module: string) => {
  try {
    return typeof module !== 'undefined'
      ? module
      : require(module)
  }
  catch (error: unknown) {
    return null
  }
}

const worker_threads = tryReq('node:worker_threads')

interface ScriptWorker {
  exit: () => void
  on?: (event: string, cb: (msg: any) => void) => void
  send?: (msg: any) => void
}

const worker: ScriptWorker = {
  exit: () => {},
}

if (typeof self !== 'undefined'
  && typeof postMessage === 'function'
  && typeof addEventListener === 'function'
) {
  worker.on = (event, cb) => {
    addEventListener(event, (msg) => {
      cb(msg)
    })
  }
  worker.send = (msg) => {
    postMessage(msg)
  }
}
else if (typeof process !== 'undefined') {
  let WorkerThreads
  try {
    WorkerThreads = tryReq('node:worker_threads')
  }
  catch (error: any) {
    if (typeof error === 'object'
    && error !== null
    && error.code === 'ERR_MODULE_NOT_FOUND') {
      // no worker threads
    }
    else {
      throw error
    }
  }

  if (WorkerThreads
    && WorkerThreads.parentPort !== null) {
    const parentPort = WorkerThreads.parentPort
    worker.send = parentPort.postMessage.bind(parentPort)
    worker.on = parentPort.on.bind(parentPort)
  }
  else {
    worker.send = process.send.bind(process)
    worker.on = process.on.bind(process)
    worker.on('disconnect', () => {
      process.exit(1)
    })
    worker.exit = process.exit.bind(process)
  }
}
else {
  throw new TypeError('Must execute in a worker context')
}
