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

export type Path<T, U = never, P extends any[] = []> =
  T extends readonly any[]
    ? (P | Path<T[number], U, [...P, number]>)
    : T extends object
      ? P | {
          [K in keyof T]: K extends string | number ? 
            (T[K] extends (UnaccessibleObjectType | U) 
              ? [...P, K]
              : Path<T[K], U, [...P, K]>)
            : never
        }[keyof T]
      : P;

export type StringPath<T, U = never, P extends string = ''> =
  T extends (UnaccessibleObjectType | U) 
    ? never
    : T extends Array<infer V>
      ? (P extends '' ? '' : never) | 
        `${P}[${number}]` | StringPath<V, U, `${P}[${number}]`>
      : keyof T extends infer K
        ? K extends keyof T & (string | number)
          ? P extends ''
            ? '' | `${K}` | StringPath<T[K], U, `${K}`>
            : `${P}.${K}` | StringPath<T[K], U, `${P}.${K}`>
          : never
        : never;

export type PathValue<T, U = never, P extends readonly any[] = any[]> =
  P extends readonly [infer K, ...infer Rest]
    ? T extends (UnaccessibleObjectType | U)
      ? never
      : K extends keyof T
        ? PathValue<T[K], U, Rest>
        : T extends readonly any[]
          ? K extends number
            ? PathValue<T[number], U, Rest>
            : never
          : never
    : T;

export type StringPathValue<T, U = never, P extends string = ''> =
  P extends ''
    ? T 
    : T extends (UnaccessibleObjectType | U) 
      ? never
      : P extends keyof T
        ? T[P]
        : P extends `[${number}][${infer R}`
          ? T extends any[]
            ? StringPathValue<T[number], U, `[${R}`>
            : never
          : P extends `[${number}].${infer R}`
            ? T extends any[]
              ? StringPathValue<T[number], U, `${R}`>
              : never
            : P extends `[${number}]`
              ? T extends any[]
                ? T[number]
                : never
              : P extends `${infer K}[${infer R}`
                ? K extends keyof T
                  ? StringPathValue<T[K], U, `[${R}`>
                  : never
                : P extends `${infer K}.${infer R}`
                  ? K extends keyof T
                    ? StringPathValue<T[K], U, R>
                    : never
                  : never

export type DeepReadonly<T, U = never> =
  T extends (UnaccessibleObjectType | U)
  ? T
  : T extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;
