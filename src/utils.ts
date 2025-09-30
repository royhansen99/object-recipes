import { Path, PathValue } from './types';

export function deepClone<T>(source: T): T {
  if (source === null || typeof source !== 'object') return source;

  const clone: unknown = Array.isArray(source) ? [] : {};

  for (const key in source)
    if (Object.prototype.hasOwnProperty.call(source, key))
      (clone as T)[key] = deepClone(source[key]);

  return clone as T;
}

// Update string-path on an object with a new value.
// The update is immutable and will return a spread
// of the affected paths.
export const pathSet = <T, P extends Path<T>>(
  object: T,
  path: P,
  value: PathValue<T, P>
): T => {
  const list = path.replace(/(\[[^\[\]]*\])/g, '.$1').split('.');
  const newObject: T = { ...object };

  // We use `any` type here, because we dont want to
  // go through all the trouble of making the for-loop
  // below type-safe.
  // Sometimes unsafe code is preferable to a convoluted
  // type mess.
  //
  // This is the current level being processed in the
  // loop below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentLevel: any = newObject;

  for (let i = 0; i < list.length; i++) {
    let key = list[i];

    // Remove array braces '[' and ']'
    if (key.slice(0, 1) === '[') key = key.slice(1, -1);

    // If current nested-level is not an array or object,
    // throw error.
    if (currentLevel === null || typeof currentLevel !== 'object')
      throw new Error(
        'One or more path levels are not valid. The entire nested structure you specified must be spreadable down to (but not including) the last item.'
      );

    const currentValue = currentLevel[key];

    if (i === list.length - 1) {
      // This is the last key
      currentLevel[key] = value;
    } else if (currentValue !== null && typeof currentValue === 'object') {
      currentLevel[key] = Array.isArray(currentLevel[key])
        ? [...currentLevel[key]]
        : { ...currentLevel[key] };
    }

    currentLevel = currentLevel[key];
  }

  return newObject;
};
