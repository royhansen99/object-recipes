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
    return new EntityClass<T>({ ...this.entity, ...changes });
  }

  setPath<P extends Path<T, ''>>(path: P, value: PathValue<T, P>) {
    return new EntityClass<T>(pathSet(this.entity, path, value));
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
