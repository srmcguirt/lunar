export type float = number
export type int = number
export type double = number

export type FloatArray = number[] | Float32Array | Float64Array
export type IntArray = number[] | Int8Array | Int16Array | Int32Array
export type IndicesArray = number[] | Uint16Array | Uint32Array | Int32Array
export type DataArray = number[] | ArrayBuffer | ArrayBufferView
export type Primitive = string | number | boolean | Function | symbol | undefined | null
export type Worker = 'auto' | 'web' | 'process' | 'thread'
export type Nullable<T> = T | null

export type DeepImmutableObject<T> = { readonly [K in keyof T]: DeepImmutable<T[K]> }
interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}
interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {}

export type DeepImmutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? DeepImmutableArray<U>
    : T extends Map<infer K, infer V>
      ? DeepImmutableMap<K, V>
      : DeepImmutableObject<T>

export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<U>
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<K, V>
      : DeepImmutable<T>

export interface WorkerPoolOpts {
  /**
   * Minimum number of workers to keep in the pool.
   */
  min: number
  /**
   * Maximum number of workers to keep in the pool.
   */
  max: number
  /**
   * Maximum queue size.
   */
  maxQ: number
  /**
   * Worker type.
   */
  worker: Worker
  /**
   * Forked process arguments.
   */
  args: any
  /**
   * Forked process options.
   */
  opts: any
  /**
   * Create worker callback.
   */
  onCreateWorker: Function
  /**
   * Kill worker callback.
   */
  onKillWorker: Function
}
