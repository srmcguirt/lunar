/**
 * Returns the parameters of a function
 */
type Params<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
) => any
  ? A
  : never;
/**
 * Removes the first parameter of a tuple
 */
type Tail<T extends any[]> = T extends [infer _, ...infer R] ? R : never;

/**
 * Returns the first parameter of a tuple
 */
type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;

/**
 * Returns true if a tuple has more than one parameter
 */
type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

export type { Params, Head, Tail, HasTail };

export function functional(): string {
  return "functional";
}
