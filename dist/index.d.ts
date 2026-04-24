declare type Entity = {
    [key: string | number]: unknown;
} | unknown[];

export declare function entity<T extends Entity>(entity: T, config?: ConstructorParameters<typeof EntityClass<T>>[1]): EntityClass<T>;

export declare class EntityClass<const T extends Entity> {
    private entity;
    private equalityFn;
    constructor(entity: T, config?: {
        deepEqual?: boolean | EqualityFn;
    });
    private getEqualityFn;
    set(changes: T extends any[] ? T : Partial<T>, deepEqual?: boolean | EqualityFn): EntityClass<T>;
    setPath<P extends StringPath<T>>(path: P, value: StringPathValue<T, P>, deepEqual?: boolean | EqualityFn): EntityClass<T>;
    setKeysPath<const P extends Path<T>>(path: P, value: PathValue<T, P>, deepEqual?: boolean | EqualityFn): EntityClass<T>;
    recipe(recipeCallback: Recipe<EntityClass<T>>): EntityClass<T>;
    get(): Readonly<T>;
    getClone(): Writable<T>;
}

declare type EqualityFn = (a: any, b: any) => boolean;

declare type Path<T, P extends any[] = []> = T extends readonly any[] ? (P | Path<T[number], [...P, number]>) : T extends object ? P | {
    [K in keyof T]: K extends string | number ? (T[K] extends UnaccessibleObjectType ? [...P, K] : Path<T[K], [...P, K]>) : never;
}[keyof T] : P;

declare type PathValue<T, P extends readonly any[]> = P extends readonly [infer K, ...infer Rest] ? K extends keyof T ? PathValue<T[K], Rest> : T extends readonly any[] ? K extends number ? PathValue<T[number], Rest> : never : never : T;

export declare type Recipe<T extends EntityClass<any>> = (entity: T) => T;

export declare const recipe: <const T extends Entity>(...recipes: Recipe<EntityClass<T>>[]) => (value: T) => Readonly<T>;

export declare type Shape<T extends EntityClass<any>> = ReturnType<T['get']>;

declare type StringPath<T, P extends string = ''> = T extends UnaccessibleObjectType ? never : T extends Array<infer V> ? (P extends '' ? '' : never) | `${P}[${number}]` | StringPath<V, `${P}[${number}]`> : keyof T extends infer K ? K extends keyof T & (string | number) ? P extends '' ? '' | `${K}` | StringPath<T[K], `${K}`> : `${P}.${K}` | StringPath<T[K], `${P}.${K}`> : never : never;

declare type StringPathValue<T, P extends string = ''> = P extends '' ? T : T extends UnaccessibleObjectType ? never : P extends keyof T ? T[P] : P extends `[${number}][${infer R}` ? T extends any[] ? StringPathValue<T[number], `[${R}`> : never : P extends `[${number}].${infer R}` ? T extends any[] ? StringPathValue<T[number], `${R}`> : never : P extends `[${number}]` ? T extends any[] ? T[number] : never : P extends `${infer K}[${infer R}` ? K extends keyof T ? StringPathValue<T[K], `[${R}`> : never : P extends `${infer K}.${infer R}` ? K extends keyof T ? StringPathValue<T[K], R> : never : never;

declare type UnaccessibleObjectType = string | number | boolean | symbol | null | undefined | Function | Map<any, any> | WeakMap<any, any> | Set<any> | WeakSet<any> | Date | RegExp | Error | ArrayBuffer | Promise<any> | Symbol;

declare type Writable<T> = {
    -readonly [K in keyof T]: T[K];
};

export { }
