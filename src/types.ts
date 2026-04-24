/* eslint-disable @typescript-eslint/no-explicit-any */

type UnaccessibleObjectType =
  | string
  | number
  | boolean
  | symbol
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | Map<any, any>
  | WeakMap<any, any>
  | Set<any>
  | WeakSet<any>
  | Date
  | RegExp
  | Error
  | ArrayBuffer
  | Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  | Symbol;

export type Path<T, P extends any[] = []> =
  T extends readonly any[]
    ? (P | Path<T[number], [...P, number]>)
    : T extends object
      ? P | {
          [K in keyof T]: K extends string | number ? 
            (T[K] extends UnaccessibleObjectType
              ? [...P, K]
              : Path<T[K], [...P, K]>)
            : never
        }[keyof T]
      : P;

export type StringPath<T, P extends string = ''> =
  T extends UnaccessibleObjectType
    ? never
    : T extends Array<infer V>
      ? (P extends '' ? '' : never) | 
        `${P}[${number}]` | StringPath<V, `${P}[${number}]`>
      : keyof T extends infer K
        ? K extends keyof T & (string | number)
          ? P extends ''
            ? '' | `${K}` | StringPath<T[K], `${K}`>
            : `${P}.${K}` | StringPath<T[K], `${P}.${K}`>
          : never
        : never;

export type PathValue<T, P extends readonly any[]> =
  P extends readonly [infer K, ...infer Rest]
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : T extends readonly any[]
        ? K extends number
          ? PathValue<T[number], Rest>
          : never
        : never
    : T;

export type StringPathValue<T, P extends string = ''> =
  P extends ''
    ? T 
    : T extends UnaccessibleObjectType
      ? never
      : P extends keyof T
        ? T[P]
        : P extends `[${number}][${infer R}`
          ? T extends any[]
            ? StringPathValue<T[number], `[${R}`>
            : never
          : P extends `[${number}].${infer R}`
            ? T extends any[]
              ? StringPathValue<T[number], `${R}`>
              : never
            : P extends `[${number}]`
              ? T extends any[]
                ? T[number]
                : never
              : P extends `${infer K}[${infer R}`
                ? K extends keyof T
                  ? StringPathValue<T[K], `[${R}`>
                  : never
                : P extends `${infer K}.${infer R}`
                  ? K extends keyof T
                    ? StringPathValue<T[K], R>
                    : never
                  : never
