import type { Nullable } from './pool.types'
enum PromiseStates {
  Pending,
  Success,
  Rejected,
}

export class Promise<T> {
  private _state: PromiseStates = PromiseStates.Pending
  private _value?: Nullable<T>
  private _reason: any
  private _children = new Array<Promise<T>>()
  private _parent: Nullable<Promise<T>> | undefined
  private _onSuccess?: (success?: Nullable<T>) => Nullable<Promise<T>> | T
  private _onRejected?: (reason: any) => void
  private _wasRejectConsumed = false

  private get _result(): Nullable<T> | undefined {
    return this._value
  }

  private set _result(value: Nullable<T> | undefined) {
    this._value = value

    if (this._parent && this._parent._result === undefined)
      this._parent._result = value
  }

  public constructor(resolver?: (
    resolve: (value?: Nullable<T>) => void,
    reject: (reason: any) => void
  ) => void) {
    if (resolver) {
      try {
        resolver(
          (value?: Nullable<T>) => {
            this._resolve(value)
          },
          (reason: any) => {
            this._reject(reason)
          },
        )
      }
      catch (error) {
        this._reject(error)
      }
    }
  }

  public then(
    onSuccess?: (success?: Nullable<T>) => Nullable<Promise<T>> | T,
    onRejected?: (reason: any) => void,
  ): Promise<T> {
    let promise = new Promise<T>()
    promise._onSuccess = onSuccess
    promise._onRejected = onRejected

    this._children.push(promise)
    promise._parent = this

    if (this._state === PromiseStates.Pending) {
      setTimeout(() => {
        if (this._state === PromiseStates.Success || this._wasRejectConsumed) {
          const returned: any = promise._resolve(this._result)
          if (returned !== undefined && returned !== null) {
            if ((returned as any)._state !== undefined) {
              const returnedPromise = returned as Promise<T>
              promise._children.push(returnedPromise)
              returnedPromise._parent = promise
              promise = returnedPromise
            }
            else {
              promise._result = (returned as T)
            }
          }
        }
        else {
          promise._reject(this._reason)
        }
      })
    }
    return promise
  }

  public catch(onRejected: (reason: any) => void): Promise<T> {
    return this.then(undefined, onRejected)
  }

  private _moveChildren(children: Promise<T>[]): void {
    this._children.push(...children.splice(0, children.length))

    for (const child of this._children)
      child._parent = this

    if (this._state === PromiseStates.Success) {
      for (const child of this._children)
        child._resolve(this._result)
    }
    else if (this._state === PromiseStates.Rejected) {
      for (const child of this._children)
        child._reject(this._reason)
    }
  }

  private _resolve(value?: Nullable<T>): void {
    try {
      this._state = PromiseStates.Success
      let returned: Nullable<Promise<T>> | T = null

      if (this._onSuccess)
        returned = this._onSuccess(value)

      if (returned !== undefined && returned !== null) {
        if ((returned as Promise<T>)._state !== undefined) {
          const returnedPromise = returned as Promise<T>
          returnedPromise._parent = this
          returnedPromise._moveChildren(this._children)
          value = returnedPromise._result
        }
        else {
          value = (returned as T)
        }
      }
      this._result = value

      for (const child of this._children)
        child._resolve(value)

      this._children.length = 0

      delete this._onSuccess
      delete this._onRejected
    }
    catch (error) {
      this._reject(error, true)
    }
  }

  private _reject(reason: any, local = false): void {
    this._state = PromiseStates.Rejected
    this._reason = reason

    if (this._onRejected && !local) {
      try {
        this._onRejected(reason)
        this._wasRejectConsumed = true
      }
      catch (error) {
        reason = error
      }
    }

    for (const child of this._children) {
      this._wasRejectConsumed
        ? child._resolve(null)
        : child._reject(reason)
    }

    this._children.length = 0
    delete this._onSuccess
    delete this._onRejected
  }

  public static resolve<T>(value?: T): Promise<T> {
    const promise = new Promise<T>()
    promise._resolve(value)
    return promise
  }
}
