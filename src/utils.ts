import { Path, PathValue } from './types';

export function deepClone<T>(source: T): T {
  if (source === null || typeof source !== 'object') return source;

  const clone: unknown = Array.isArray(source) ? [] : {};

  for (const key in source)
    if (Object.prototype.hasOwnProperty.call(source, key))
      (clone as T)[key] = deepClone(source[key]);

  return clone as T;
}

// Walk a list of paths (`list`) against `object`.
//
// If `compare` is `true`, we compare to check if
// the new value is identical to the current value.
// Returns `true` if identical, `false` if not.
//
// If `compare` is `false`, we actually set the
// new value by walking up the trail by
// spreading/cloning every level up to the final key.
const pathWalker = <T>(
  object: T,
  list: string[],
  value: unknown,
  compare = false
) => {
  // We use `any` type here, because we dont want to
  // go through all the trouble of making the for-loop
  // below type-safe.
  // Sometimes unsafe code is preferable to a convoluted
  // type mess.
  //
  // This is the current level being processed in the
  // loop below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentLevel: any = object;

  for (let i = 0; i < list.length; i++) {
    const key = list[i];

    // If current nested-level is not an array or object,
    // throw error.
    if (currentLevel === null || typeof currentLevel !== 'object')
      throw new Error(
        'One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item.'
      );

    const currentValue = currentLevel[key];

    if (i === list.length - 1) {
      // This is the last key

      if (!compare) {
        // We are not comparing, so set the new value.
        currentLevel[key] = value;
        return true;
      } else if (Object.is(currentValue, value)) {
        // We are comparing values.
        // Return true if the new value is identical to the current value.
        return true;
      }
    } else if (
      !compare &&
      currentValue !== null &&
      typeof currentValue === 'object'
    ) {
      // Only spread/clone if we are not comparing.
      currentLevel[key] = Array.isArray(currentLevel[key])
        ? [...currentLevel[key]]
        : { ...currentLevel[key] };
    }

    currentLevel = currentLevel[key];
  }

  return false;
};

// Update string-path on an object with a new value.
// The update is immutable and will return a spread
// of the affected paths.
export const pathSet = <T, P extends Path<T>>(
  object: T,
  path: P,
  value: PathValue<T, P>
): T => {
  const list = path.replace(/\[([^\[\]]*)\]/g, '.$1').split('.');

  // If new value is equal to current value, simply
  // return the current object instead of
  // spreading/cloning.
  if (pathWalker(object, list, value, true)) return object;

  // Start spread/clone from the beginning.
  const newObject: T = { ...object };

  // Walk up the path trail by spreading/cloning every
  // level up to the final key.
  pathWalker(newObject, list, value);

  return newObject;
};
