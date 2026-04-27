import { Path, PathValue, StringPath, StringPathValue } from './types';
import { deepClone, deepEqual as deepEqualFn, pathSetWeakTypes, pathKeysSetWeakTypes, Entity } from './utils';

export type Recipe<T extends EntityClass<E, U>, E extends Entity = Entity, U = never> = (entity: T) => T;

export type Shape<T extends EntityClass<E, U>, E extends Entity = Entity, U = never> = ReturnType<T['get']>;

// Convert a Readonly<T> type to writable.
type Writable<T> = { -readonly [K in keyof T]: T[K] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EqualityFn = (a: any, b: any) => boolean;

export class EntityClass<const T extends Entity, U = never> {
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

  set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes: T extends any[] ? T : Partial<T>,
    deepEqual?: boolean | EqualityFn
  ) {
    const _equalityFn = this.getEqualityFn(deepEqual);

    if(Array.isArray(this.entity)) {
      return _equalityFn(this.entity, changes) ?
        this : new EntityClass<T, U>(changes as T);
    } else {
      // At least one of the changes is not identical to the current
      // values.
      const atLeastOneChange =
        Object.keys(changes).filter(
          (key) => !_equalityFn(changes[key as keyof typeof changes], this.entity[key as keyof typeof entity])
        ).length !== 0;

      // If all changes are identical to current values we simply
      // return the current instance, else we spread into a new
      // instance.
      return !atLeastOneChange
        ? this
        : Array.isArray(this.entity)
          ? new EntityClass<T, U>(changes as T)
          : new EntityClass<T, U>({ ...this.entity, ...changes });
    }
  }

  setPath<const P extends StringPath<T, U>>(
    path: P,
    value: StringPathValue<T, U, P>,
    deepEqual?: boolean | EqualityFn
  ) {
    const _equalityFn = this.getEqualityFn(deepEqual);
    const trySet = pathSetWeakTypes(this.entity, path, value);

    // If change is identical to current value we simply
    // return the current instance, else we spread into a new
    // instance.
    return _equalityFn(trySet, this.entity) ? this : new EntityClass<T, U>(trySet);
  }

  setKeysPath<const P extends Path<T, U>>(
    path: P,
    value: PathValue<T, U, P>,
    deepEqual?: boolean | EqualityFn
  ) {
    const _equalityFn = this.getEqualityFn(deepEqual);

    const trySet = pathKeysSetWeakTypes(this.entity, path, value);

    // If change is identical to current value we simply
    // return the current instance, else we spread into a new
    // instance.
    return _equalityFn(trySet, this.entity) ? this : new EntityClass<T, U>(trySet);
  }

  recipe(recipeCallback: Recipe<EntityClass<T, U>, T, U>) {
    return recipeCallback(this);
  }

  get() {
    return this.entity;
  }

  getClone() {
    return deepClone(this.entity) as Writable<T>;
  }
}

export function entity<T extends Entity, U = never>(
  entity: T,
  config?: ConstructorParameters<typeof EntityClass<T, U>>[1]
) {
  return new EntityClass<T, U>(entity, config);
}

// Convenience wrapper/helper when you want to run recipes through
// an external state-library setter.
export const recipe = <const E extends Entity, U = never>
  (...recipes: Recipe<EntityClass<E, U>>[]) =>
  (value: E): E =>
    recipes
      .reduce(
        (_entity, recipe) =>
          _entity.recipe(recipe),
        entity<E, U>(value))
      .get();
