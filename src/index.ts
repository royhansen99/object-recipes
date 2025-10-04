import { Path, PathValue } from './types';
import { deepClone, pathSet } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Entity = { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Recipe<T extends EntityClass<any>> = (entity: T) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Shape<T extends EntityClass<any>> = ReturnType<T['get']>;

export class EntityClass<T extends Entity> {
  private entity: T;

  constructor(entity: T) {
    this.entity = entity;
  }

  set(changes: Partial<T>) {
    // At least one of the changes is not identical to the current
    // values.
    const atLeastOneChange =
      Object.keys(changes).filter(
        (key) => !Object.is(changes[key], this.entity[key])
      ).length !== 0;

    // If all changes are identical to current values we simply
    // return the current instance, else we spread into a new
    // instance.
    return !atLeastOneChange
      ? this
      : new EntityClass<T>({ ...this.entity, ...changes });
  }

  setPath<P extends Path<T, ''>>(path: P, value: PathValue<T, P>) {
    const trySet = pathSet(this.entity, path, value);

    // If change is identical to current value we simply
    // return the current instance, else we spread into a new
    // instance.
    return Object.is(trySet, this.entity) ? this : new EntityClass<T>(trySet);
  }

  recipe(recipeCallback: Recipe<EntityClass<T>>) {
    return recipeCallback(this);
  }

  get() {
    return this.entity;
  }

  getClone() {
    return deepClone(this.entity);
  }
}

export function entity<T extends Entity>(entity: T) {
  return new EntityClass<T>(entity);
}
