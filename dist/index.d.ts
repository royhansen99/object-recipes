declare type Entity = {
    [key: string | number]: unknown;
} | unknown[];

export declare function entity<T extends Entity, U = never>(entity: T, config?: ConstructorParameters<typeof EntityClass<T, U>>[1]): EntityClass<T, U>;

export declare class EntityClass<const T extends Entity, U = never> {
    private entity;
    private equalityFn;
    constructor(entity: T, config?: {
        deepEqual?: boolean | EqualityFn;
    });
    private getEqualityFn;
    set(changes: T extends any[] ? T : Partial<T>, deepEqual?: boolean | EqualityFn): EntityClass<T, U>;
    setPath<const P extends StringPath<T, U>>(path: P, value: StringPathValue<T, U, P>, deepEqual?: boolean | EqualityFn): EntityClass<T, U>;
    setKeysPath<const P extends Path<T, U>>(path: P, value: PathValue<T, U, P>, deepEqual?: boolean | EqualityFn): EntityClass<T, U>;
    recipe(recipeCallback: Recipe<EntityClass<T, U>, T, U>): EntityClass<T, U>;
    get(): Readonly<T>;
    getClone(): Writable<T>;
}

declare type EqualityFn = (a: any, b: any) => boolean;

declare type Path<T, U = never, P extends any[] = []> = T extends readonly any[] ? (P | Path<T[number], U, [...P, number]>) : T extends object ? P | {
    [K in keyof T]: K extends string | number ? (T[K] extends (UnaccessibleObjectType | U) ? [...P, K] : Path<T[K], U, [...P, K]>) : never;
}[keyof T] : P;

declare type PathValue<T, U = never, P extends readonly any[] = any[]> = P extends readonly [infer K, ...infer Rest] ? T extends (UnaccessibleObjectType | U) ? never : K extends keyof T ? PathValue<T[K], U, Rest> : T extends readonly any[] ? K extends number ? PathValue<T[number], U, Rest> : never : never : T;

export declare type Recipe<T extends EntityClass<E, U>, E extends Entity = Entity, U = never> = (entity: T) => T;

export declare function recipe<const E extends Entity, U = never>(entity: E, ...recipes: Recipe<EntityClass<E, U>>[]): E;

export declare function recipe<const E extends Entity, U = never>(...recipes: Recipe<EntityClass<E, U>>[]): (entity: E) => E;

export declare type Shape<T extends EntityClass<E, U>, E extends Entity = Entity, U = never> = ReturnType<T['get']>;

declare type StringPath<T, U = never, P extends string = ''> = T extends (UnaccessibleObjectType | U) ? never : T extends Array<infer V> ? (P extends '' ? '' : never) | `${P}[${number}]` | StringPath<V, U, `${P}[${number}]`> : keyof T extends infer K ? K extends keyof T & (string | number) ? P extends '' ? '' | `${K}` | StringPath<T[K], U, `${K}`> : `${P}.${K}` | StringPath<T[K], U, `${P}.${K}`> : never : never;

declare type StringPathValue<T, U = never, P extends string = ''> = P extends '' ? T : T extends (UnaccessibleObjectType | U) ? never : P extends keyof T ? T[P] : P extends `[${number}][${infer R}` ? T extends any[] ? StringPathValue<T[number], U, `[${R}`> : never : P extends `[${number}].${infer R}` ? T extends any[] ? StringPathValue<T[number], U, `${R}`> : never : P extends `[${number}]` ? T extends any[] ? T[number] : never : P extends `${infer K}[${infer R}` ? K extends keyof T ? StringPathValue<T[K], U, `[${R}`> : never : P extends `${infer K}.${infer R}` ? K extends keyof T ? StringPathValue<T[K], U, R> : never : never;

declare type UnaccessibleObjectType = string | number | boolean | symbol | null | undefined | Function | Map<any, any> | WeakMap<any, any> | Set<any> | WeakSet<any> | Date | RegExp | Error | ArrayBuffer | Promise<any> | Symbol;

declare type Writable<T> = {
    -readonly [K in keyof T]: T[K];
};

export { }
