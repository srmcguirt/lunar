import {} from './pool.common'
import * as CONSTANTS from './pool.constants'
import {} from './pool.promise'

/**
 * Controls the lifecycle of a worker.
 */
export class Handler {
  public constructor() {}

  public dispose() {
    const timeout = CONSTANTS.CHILD_PROCESS_EXIT_TIMEOUT
  }
}
