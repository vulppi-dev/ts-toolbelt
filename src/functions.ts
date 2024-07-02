type UnionFunctionWithArgsType<Args extends any[] = any[]> = [
  (...args: Args) => {},
  ...Args,
]
type UnionFunctionType =
  | VoidFunction
  | UnionFunctionWithArgsType
  | undefined
  | null

/**
 * Executes an array of functions serially.
 *
 * @param {UnionFunctionType[]} fns - Array of functions to execute serially.
 * @return {VoidFunction} A function that executes the array of functions serially.
 */
export const unionSerialFunctions =
  (...fns: UnionFunctionType[]): VoidFunction =>
  (): void => {
    for (const fn of fns) {
      if (Array.isArray(fn)) {
        const rfn: (typeof fn)[0] = fn.shift()

        rfn?.(...(fn as Array<(typeof fn)[1]>))
      } else {
        fn?.()
      }
    }
  }

/**
 * Creates a promise that resolves after a specified time delay.
 *
 * @param {number} ms - The time delay in milliseconds.
 * @return {Promise<void>} A promise that resolves after the specified time delay.
 */
export const promiseDelay = (ms: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Creates a deep copy of the given object.
 * If the browser doesn't support structuredClone, it will fallback to JSON.parse(JSON.stringify())
 *
 * @template E - The type of the object to be cloned.
 * @param {E} obj - The object to be cloned.
 * @returns {E} - The cloned object.
 */
export function clone<E extends any>(obj: E): E {
  if (typeof structuredClone !== 'function') {
    return JSON.parse(JSON.stringify(obj)) as E
  } else {
    return structuredClone(obj)
  }
}

/**
 * Returns a new object with all the properties of the input object removed that are specified in the keys parameter.
 *
 * @param {P} obj - The input object.
 * @param {...K[]} keys - The keys of the properties to be removed.
 * @return {Omit<P, K>} - A new object with the specified properties removed.
 */
export function omitShallowProps<P extends object, K extends keyof P>(
  obj: P,
  ...keys: K[]
): Omit<P, K> {
  const ret = clone(obj)
  for (const key of keys) {
    delete ret[key]
  }
  return ret
}

/**
 * Executes the 'run' function within a try-catch block and calls 'cbErr' if an error occurs.
 *
 * @param {R} run - The function to be executed.
 * @param {any} cbErr - The callback function to handle errors.
 * @return {void} This function does not return anything.
 */
export function tryCatchCallback<R extends Function>(run: R, cbErr: any): void {
  try {
    return run()
  } catch (err) {
    console.error(err)
    cbErr && cbErr(err)
  }
}

/**
 * Omit all nullable values from an object recursively.
 *
 * @param {R extends object} obj - The input object to omit nullables from.
 * @return {R} The object with all null and undefined values removed.
 */
export function omitNullables<R extends object>(obj: R): R {
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj))
    return obj.filter((v) => v != null).map(omitNullables) as R

  const result: Record<string, any> = {}
  for (const key in obj) {
    const value = obj[key]
    if (value != null) {
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result[key] = value.filter((v) => v != null).map(omitNullables)
        } else {
          result[key] = omitNullables(value)
        }
      } else {
        result[key] = value
      }
    }
  }
  return result as R
}
