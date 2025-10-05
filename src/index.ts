import { Path, PathValue } from './types';
import { deepClone, deepEqual as deepEqualFn, pathSet } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entity = { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Recipe<T extends EntityClass<any>> = (entity: T) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Shape<T extends EntityClass<any>> = ReturnType<T['get']>;

// Convert a Readonly<T> type to writable.
type Writable<T> = { -readonly [K in keyof T]: T[K] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EqualityFn = (a: any, b: any) => boolean;

export class EntityClass<T extends Entity> {
  // Set entity-object as read-only.
  // The Readonly<T> type is not recursive, so does not provide
  // complete type-safety below the root of the object. But
  // that's OK, we dont want the overhead of infering all nested
  // paths anyway.
  private entity: Readonly<T>;

  private equalityFn: EqualityFn = Object.is;

  constructor(entity: T, config?: { deepEqual?: boolean | EqualityFn }) {
    this.entity = entity;

    if (config?.deepEqual)
      this.equalityFn =
        config.deepEqual === true ? deepEqualFn : config.deepEqual;
  }

  private getEqualityFn(deepEqual?: boolean | EqualityFn) {
    return deepEqual === undefined
      ? this.equalityFn
      : deepEqual === false
        ? Object.is
        : deepEqual === true
          ? deepEqualFn
          : deepEqual;
  }

  set(changes: Partial<T>, deepEqual?: boolean | EqualityFn) {
    const _equalityFn = this.getEqualityFn(deepEqual);

    // At least one of the changes is not identical to the current
    // values.
    const atLeastOneChange =
      Object.keys(changes).filter(
        (key) => !_equalityFn(changes[key], this.entity[key])
      ).length !== 0;

    // If all changes are identical to current values we simply
    // return the current instance, else we spread into a new
    // instance.
    return !atLeastOneChange
      ? this
      : new EntityClass<T>({ ...this.entity, ...changes });
  }

  setPath<P extends Path<T, ''>>(
    path: P,
    value: PathValue<T, P>,
    deepEqual?: boolean | EqualityFn
  ) {
    const _equalityFn = this.getEqualityFn(deepEqual);
    const trySet = pathSet(this.entity, path, value);

    // If change is identical to current value we simply
    // return the current instance, else we spread into a new
    // instance.
    return _equalityFn(trySet, this.entity) ? this : new EntityClass<T>(trySet);
  }

  recipe(recipeCallback: Recipe<EntityClass<T>>) {
    return recipeCallback(this);
  }

  get() {
    return this.entity;
  }

  getClone() {
    return deepClone(this.entity) as Writable<T>;
  }
}

export function entity<T extends Entity>(
  entity: T,
  config?: ConstructorParameters<typeof EntityClass<T>>[1]
) {
  return new EntityClass<T>(entity, config);
}
